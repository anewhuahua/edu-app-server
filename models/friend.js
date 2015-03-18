var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendSchema = new Schema({
  name:   
  {type: String},
  friend:
  {type: String}
});

// statics
friendSchema.statics.getFriends = function (name, cb) {
  this.find({name:name}, cb);
}

module.exports = mongoose.model('Friend', friendSchema)

