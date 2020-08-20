const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  fromUserId: Schema.Types.ObjectId,
  toUserId: Schema.Types.ObjectId,
  type: String,
  content: String,
  time: Date,
  read: {
    type: Boolean,
    default: false,
    required: true
  }
});

module.exports = mongoose.model('Message', messageSchema);
