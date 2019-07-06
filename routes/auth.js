/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
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

  const { error } = validate(req.body);
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

  // JWT (jsonwebtoken) , we create a variable and inside we use , with jsonwebtoken, the sign
  // method : As Payload : as first argument ,  we put an
  // object with one property ( user._id in our case)
  // and as second argument we pass also the private key ( here , its hardocoded, but obviously
  // in real app, we cannot put the private key in our code source ^_^)
  // the private key is used to create the digital signature ( we can use any string obviously)

  // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

  // but thats a bad way of code, because if we want to add more properties one day,
  // it will be less readable and we will have to
  // make the same modification maybe in several places .
  // So we have just to create a method which generate token ( this method
  // has been added directly in user model , just after the userSchema)

  const token = user.generateAuthToken();

  // When the user logs in , it will generate a jsonwebtoken , and this token
  // will be returned in the body of the response
  // Then we have to call config.get and pass the name of the application settings ( in our config folder )
  // thats allows us to not display the jwtPrivateKey in our source code
  // so the actual secret will be in our custom environnement variable , in config folder

  // finally we can return this token to the client
  res.send(token);

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

  //  res.status(200).send(_.pick(user, ['_id', 'name', 'email']));
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
  return Joi.validate(req, schema);
}

module.exports = router;
