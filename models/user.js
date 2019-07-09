/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

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
  },
  isAdmin: Boolean
});

// we want to add to this schema a Method to create a function in order to generate token
// eslint-disable-next-line func-names
// we also want to add , in our payload , isAdmin property , to generate directly in the payload
// this information
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  );
  return token;
};

// So we need a new middleware function ( to add in middleware folder of our app )
// to check if the user is an admin or not

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
