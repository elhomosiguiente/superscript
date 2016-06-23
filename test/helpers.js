/* global bot:true, Promise */

var script = require("../index");
var fs = require("fs");
var rmdir = require("rmdir");
var async = require("async");
var mongoose = require("mongoose");
var mergex = require("deepmerge");
var parse = require("ss-parser")();
var data;

data = [
  // './test/fixtures/concepts/bigrams.tbl', // Used in Reason tests
  // './test/fixtures/concepts/trigrams.tbl',
  // './test/fixtures/concepts/concepts.top',
  // './test/fixtures/concepts/verb.top',
  // './test/fixtures/concepts/color.tbl',
  // './test/fixtures/concepts/opp.tbl'
];

var removeModel = function(name) {
  return new Promise(function(resolve, reject){
    mongoose.connection.models[name].remove(function(error, removed) {
      if(error) {
        return reject(error);
      }
      delete mongoose.connection.models[name];
      resolve(removed);
    });
  });
};

exports.after = function(end) {
  bot = null;
  end();
};

var importFilePath = function(path, callback) {
  if(!mongoose.connection.readyState) {
    mongoose.connect('mongodb://localhost/superscriptDB');
  }
  var TopicSystem = require("../lib/topics/index")(mongoose);
  TopicSystem.importerFile(path, callback);

  // This is here in case you want to see what exactly was imported.
  // TopicSystem.importerFile(path, function () {
  //   Topic.find({name: 'random'}, "gambits")
  //     .populate("gambits")
  //     .exec(function (err, mgambits) {
  //     console.log("------", err, mgambits);
  //     callback();
  //   });
  // });

};

exports.before = function(file) {

  var options = {
    scope: {}
  };

  return function(done) {
    var fileCache = './test/fixtures/cache/'+ file +'.json';
    fs.exists(fileCache, function (exists) {

      if (!exists) {
        parse.loadDirectory('./test/fixtures/' + file, function(err, result) {
          options.mongoose = mongoose;

          fs.writeFile(fileCache, JSON.stringify(result), function (err) {
            // Load the topic file into the MongoDB
            importFilePath(fileCache, function() {
              new script(options, function(err, botx) {
                bot = botx;
                done();
              });
            });
          });
        });
      } else {
        console.log("Loading Cached Script");
        var contents = fs.readFileSync(fileCache, 'utf-8');
        contents = JSON.parse(contents);

        options.mongoose   = mongoose;

        var sums = contents.checksums;
        var start = new Date().getTime();
        var results;

        parse.loadDirectory('./test/fixtures/' + file, sums, function(err, result) {
          results = mergex(contents, result);
          fs.writeFile(fileCache, JSON.stringify(results), function (err) {
            bot = null;
            importFilePath(fileCache, function() {
              new script(options, function(err, botx) {
                bot = botx;
                done();
              }); // new bot
            }); // import file
            // }); // create user
          }); // write file
        }); // Load files to parse
      }
    });
  };
};
