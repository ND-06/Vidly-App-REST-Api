/* eslint-disable no-unused-vars */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

// Create a User schema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  }
});

// create a User model

const User = mongoose.model('User', userSchema);

// create a validate function for User

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

// export modules

module.exports.User = User;
module.exports.validate = validateUser;
