const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  username: String,
  fullname: String,
  picture: String,
  lastMessage: String,
  lastMessageDate: Date,
  lastVisit: Date,
  archived: {
    type: Boolean,
    default: false
  },
  socials: {
    type: Schema({
      _id: false,
      twitter: String,
      instagram: String,
      facebook: String
    })
  }
});

module.exports = mongoose.model('Contact', contactSchema);
