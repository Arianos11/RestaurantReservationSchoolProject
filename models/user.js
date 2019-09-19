const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  login: {
      type: String,
      required: [true, "Login error"]
    },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: [true, "Email existing"],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8
  }
});

module.exports = mongoose.model('User', userSchema);