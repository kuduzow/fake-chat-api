const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  username: String,
  fullname: String,
  picture: String,
  status: String
});

module.exports = mongoose.model('Profile', profileSchema);
