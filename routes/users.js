/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const { validate, User } = require('../models/user');

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

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  // save user in our DB
  user = await user.save();
  res.status(200).send(user);
});

// get all users

router.get('/', async (req, res) => {
  const users = await User.find().sort('name');
  res.status(200).send(users);
});

module.exports = router;
