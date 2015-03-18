var mongoose = require('mongoose');
var Friend = require('./friend');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:   
  {type: String},

  time:   
  {type : Date, default: Date.now},
});

// statics
userSchema.statics.findByName = function (name, cb) {
  this.findOne({name:name}, cb);
}

userSchema.methods.getFriends = function(cb) {
  Friend.getFriends(this.name, cb);
};
userSchema.methods.addFriend = function(name, cb) {
  friend = new Friend();
  friend.name = this.name;
  friend.friend = name;
  friend.save(cb);
};

module.exports = mongoose.model('User', userSchema)

