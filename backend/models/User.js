const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: {
    type: String, // URL to the image
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 