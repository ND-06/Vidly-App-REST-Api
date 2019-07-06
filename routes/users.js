/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');

const router = express.Router();

// Create a User in DB

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // check if The user is already registered

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered');

  // if not registered, allow to create a new user

  // user = new User({
  //  name: req.body.name,
  //  email: req.body.email,
  //  password: req.body.password
  // });

  // Lodash Way more dry

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  // We always need to hash the password with Bcrypt, its async code too
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  // save user in our DB with properly hashed password
  user = await user.save();
  // we create a token variable , inside , we use sign method of jwt,
  // first we need to pass the user id as identifier, and then
  // we call the get method of config to call our privatekey which stored
  // in our config folder, its name is jwtPrivateKey

  const token = user.generateAuthToken();
  // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  // A better approach is to return the jsonwebtoken into a http header
  // we have header in request , but also hearder in response
  // so we use res.header ( and for custom reader, as first argument, we need
  // to write x-auth-token, and as second argument the value
  //  which is in our case the token)
  res
    .header('x-auth-token', token)
    .send(_.pick(user, ['_id', 'name', 'email']));

  // 2 methods to control our response to the client :

  // res.status(200).send({
  //  name: user.name,
  //  email: user.email
  // });

  // this way we can exclude the password and the version properties

  // Or we can use Lodash which allows us many functionalities to manage objects
  // we use the pick method related to lodash , and then ( inside an array )
  // as first argument, we select
  // the object that we want to work with, and as second , third etc arguments, the properties
  // selected => so we will get a new object with theses 3 properties (_id, email and name)

  res.status(200).send(_.pick(user, ['_id', 'name', 'email']));
});

// get all users

router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.status(200).send(users);
});

module.exports = router;
