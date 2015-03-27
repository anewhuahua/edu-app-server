var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
  from:   
  {type: String},
  to:
  {type: String},
  message:
  {type: String},
  time:   
  {type : Date, default: Date.now}
});

// statics
chatSchema.statics.getLastMsg = function (n1, n2, cb) {
  this.find({"$or": [{from:n1, to:n2}, {from:n2, to:n1}]}).sort({_id:-1}).limit(1).exec(cb);
}

module.exports = mongoose.model('Chat', chatSchema)

