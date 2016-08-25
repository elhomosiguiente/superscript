var mocha = require("mocha");
var should  = require("should");
var help = require("./helpers");

describe('SuperScript Custom Functions', function(){
  before(help.before("script"));

  describe('Custom functions', function(){

    it("should call a custom function with hyphen", function(done) {
      bot.reply("user1", "error with function thirty-two", function(err, reply) {
        reply.string.should.eql("thirty-two");
        done();
      });
    });


    it("should call a custom function", function(done) {
      bot.reply("user1", "custom function", function(err, reply) {
        reply.string.should.eql("The Definition of function is perform duties attached to a particular office or place or function");
        done();
      });
    });

    it("should continue if error is passed into callback", function(done) {
      bot.reply("user1", "custom 3 function", function(err, reply) {
        reply.string.should.eql("backup plan");
        done();
      });
    });

    it("pass a param into custom function", function(done) {
      bot.reply("user1", "custom 5 function", function(err, reply) {
        reply.string.should.eql("he likes this");
        done();
      });
    });

    it("pass a param into custom function1", function(done) {
      bot.reply("user1", "custom 6 function", function(err, reply) {
        ["he cottons this","he prefers this", "he cares for this", "he loves this", "he pleases this"].should.containEql(reply.string);
        done();
      });
    });

    it("the same function twice with different params", function(done) {
      bot.reply("user1", "custom 8 function", function(err, reply) {
        reply.string.should.eql("4 + 3 = 7");
        done();
      });
    });

    it("should not freak out if function does not exist", function(done) {
      bot.reply("user1", "custom4 function", function(err, reply) {
        reply.string.should.eql("one + one = 2");
        done();
      });
    });

    it("function in multi-line reply", function(done) {
      bot.reply("user1", "custom9 function", function(err, reply) {
        reply.string.should.eql("a\nb\none\n\nmore");
        done();
      });
    });

    it("should treat custom function quote parameters as a single unit", function(done) {
      bot.reply("user1", "custom 10 function", function(err, reply) {
        reply.string.should.eql("I found 4 parameters");
        done();
      });
    });

    it("should allow special characters inside quoted params", function(done) {
      bot.reply("user1", "custom 11 function", function(err, reply) {
        reply.string.should.eql("I found 2 parameters");
        done();
      });
    });

    it("should follow previous behavior if special characters are present outside of quoted params", function(done) {
      bot.reply("user1", "custom 12 function", function(err, reply) {
        reply.string.should.eql("^countParams(special chars without quotes, should still fail!)");
        done();
      });
    });

  });

  after(help.after);

});
