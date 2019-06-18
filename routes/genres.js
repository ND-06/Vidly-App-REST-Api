/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable radix */
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

// we import our validateGenre function
// and our Genre class function from our genre model
// we use destructuring in order to load at the same time
// validate function and Genre class

const { Genre, validate } = require('../models/genre');

const router = express.Router();

// Create a schema

// Get all Genres
router.get('/', async (req, res) => {
  const genre = await Genre.find().sort('name');
  res.status(200).send(genre);
});

// Get a specific genre

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send('The genre with the given Id was not found');
  }
  res.status(200).send(genre);
});

// Create a new genre

router.post('/', async (req, res) => {
  const result = validate(req.body);
  if (result.error) res.status(400).send(result.details[0].message);
  let genre = new Genre({
    name: req.body.name
  });
  genre = await genre.save();
  res.status(200).send(genre);
});

// Modify a genre

router.put('/:id', async (req, res) => {
  const result = validate(req.body);
  if (result.error) res.status(400).send(result.details[0].message);
  // findByIdAndUpdate is much more efficient than query approach
  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    new: true
  });
  res.status(200).send(genre);
});

// Delete a genre

router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  res.status(200).send(genre);
});

module.exports = router;
