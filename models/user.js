/* eslint-disable no-unused-vars */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

// Create a User schema

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 4,
    maxlength: 255,
    unique: true,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 255,
    required: true
  }
});

// create a User model

const User = mongoose.model('User', userSchema);

// create a validate function for User

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(4)
      .max(255)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  };
  return Joi.validate(schema, user);
}

// export modules

module.exports.User = User;
module.exports.validate = validateUser;
