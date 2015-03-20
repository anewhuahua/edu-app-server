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


module.exports = mongoose.model('Chat', chatSchema)

