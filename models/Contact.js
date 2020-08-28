const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  username: String,
  fullname: String,
  picture: String,
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
}, {
  toJSON: {
    virtuals: true
  }
});

contactSchema.virtual('online').get(() => {
  return Boolean(Math.random() < 0.5)
})

module.exports = mongoose.model('Contact', contactSchema);
