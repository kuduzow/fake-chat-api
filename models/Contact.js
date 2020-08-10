const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  userId: Schema.Types.ObjectId,
  lastMessage: String,
  lastMessageDate: Date,
});

module.exports = mongoose.model('Contact', contactSchema);
