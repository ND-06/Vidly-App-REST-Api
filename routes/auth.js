/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  // this validate function comes from user model , and
  // works for validating a new user when they create
  // their account , only by checking if mail & Password & Name are present

  // We dont need this here, we need a validate function to authenticate a registered user
  // when he types its password and
  // email ( so we define another validate function at the bottom of
  // the file)

  const { error } = validate(req);
  if (error) {
    return res.status(400).send('Password is not valid !');
  }

  // check if The user is already registered

  const user = await User.findOne({ email: req.body.email });
  // If user not registered , or not send right email or password, we have to send
  // a 400 error with "Invalid Email or Password"
  if (!user) return res.status(400).send('Invalid Email or Password');

  bcrypt.compare(req.body.password, user.password);

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Email or Password');
  res.send(true);

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

function validate(req) {
  const schema = {
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

module.exports = router;
