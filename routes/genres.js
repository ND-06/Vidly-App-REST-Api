/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable radix */
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// we import our validateGenre function
// and our Genre class function from our genre model
// we use destructuring in order to load at the same time)
// validate function and Genre class

const { Genre, validate } = require('../models/genre');

const router = express.Router();

// Create a schema

// Get all Genres
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.status(200).send(genres);
});

// Get a specific genre

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  // If genre doesnt have an existing ID, it will return a 404 status - Not found
  if (!genre)
    return res.status(404).send('The genre with the given id was not found!');
  // If genre has an id , it will send to the client a 200 status ( Ok Status ) and
  // will send the genre specified
  res.status(200).send(genre);
});

// Create a new genre

// we want only registered users ( those with jsonwebtokens) have the capability
// to post a new genre
// for this, we have to use a middleware

// we add as second argument the middleware function auth to prevent unregistered
// users to have access to post a new genre
router.post('/', auth, async (req, res) => {
  const token = res.header('x-auth-token');
  // If user doesnt have a token, and so is not registered , we send a 401 error
  // thats means the user doesnt have required crendentials to post a new genre
  res
    .status(401)
    .send('You have to be registered to post a new genre. No token found');

  const result = validate(req.body);
  if (result.error) return res.status(404).send(result.details[0].message);
  let genre = new Genre({
    name: req.body.name
  });
  genre = await genre.save();
  res.status(200).send(genre);
});

// Modify a genre

router.put('/:id', async (req, res) => {
  const result = validate(req.body);
  if (result.error) return res.status(404).send(result.details[0].message);
  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name
  });
  res.status(200).send(genre);
});

// Delete a genre

// ( we use 2 customs middlewares, the first to check if the user sends a valid json web token,
// and if it is ok , the second middleware checks if the user is admin or not.
// If he is admin, so the last middleware allows the user to delete genre : req / res)
router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  // If genre doesnt have an existing ID, it will return a 404 status - Not found
  if (!genre)
    // If genre has an id , it will send to the client a 200 status ( Ok Status ) and
    // will send the genre specified
    return res.status(404).send('The genre with the given id was not found !');
  res.status(200).send(genre);
});

module.exports = router;
