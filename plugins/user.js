var debug = require("debug")("SS:UserFacts");
var _ = require("lodash");
exports.save = function(key, value, cb) {
  this.user.memory.put(key, value, cb);
};

exports.hasItem = function(key, bool, cb) {
  this.user.memeroy.get(key, function(err, res) {
    cb(null, ""+!!res);
  });  
};

exports.get = function(key, cb) {
  this.user.memory.get(key, cb);
};

exports.createUserFact = function() {
  throw new Error("plugins.user.createUserFact Not Implemented");
};

exports.known = function() {
  throw new Error("plugins.user.known Not Implemented");
};

exports.inTopic = function(topic, cb) {
  console.log("plugins.user.inTopic");
  if (topic == this.user.currentTopic) {
    cb(null, "true");
  } else {
    cb(null, "false");
  }   
};
