var mongoose = require('mongoose');
var Friend = require('./friend');
var Chat = require('./chat');
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


// fiends
userSchema.methods.getFriends = function(cb) {
  Friend.getFriends(this.name, cb);
};
userSchema.methods.addFriend = function(name, cb) {
  friend = new Friend();
  friend.name = this.name;
  friend.friend = name;
  friend.save(cb);
};

// chats
userSchema.methods.getChatsFrom = function(n, cb) {
  Chat.find({from:n, to:this.name}, cb);
};
userSchema.methods.getLastChatFrom = function(n, cb) {
  Chat.find({from:n, to:this.name}).sort({_id:-1}).limit(1).exec(cb);
};
userSchema.methods.addChatsTo = function(name, message, cb) {
  chat = new Chat();
  chat.from = this.name;
  chat.to = name;
  chat.message = message; 
  chat.save(cb);
};

module.exports = mongoose.model('User', userSchema)

