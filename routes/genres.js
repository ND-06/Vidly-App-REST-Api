/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable radix */
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

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

router.post('/', async (req, res) => {
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

router.delete('/:id', (req, res) => {
  const genre = Genre.findByIdAndRemove(req.params.id);
  // If genre doesnt have an existing ID, it will return a 404 status - Not found
  if (!genre)
    // If genre has an id , it will send to the client a 200 status ( Ok Status ) and
    // will send the genre specified
    return res.status(404).send('The genre with the given id was not found !');
  res.status(200).send(genre);
});

module.exports = router;
