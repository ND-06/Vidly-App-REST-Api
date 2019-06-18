/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable radix */
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const router = express.Router();

// Create a schema

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50
  }
});

// Create a model for genre for the Database
const Genre = mongoose.model('Genre', genreSchema);
// const genres = [
//  { id: 1, name: 'Action' },
//  { id: 2, name: 'Horror' },
//  { id: 3, name: 'Drama' }
// ];

const validateGenre = genre => {
  const schema = {
    // eslint-disable-next-line no-undef
    name: Joi.string().min(3)
  };
  // eslint-disable-next-line no-undef
  return Joi.validate(genre, schema);
};

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
  const result = validateGenre(req.body);
  if (result.error) res.status(400).send(result.details[0].message);
  let genre = new Genre({
    name: req.body.name
  });
  genre = await genre.save();
  res.status(200).send(genre);
});

// Modify a genre

router.put('/:id', async (req, res) => {
  const result = validateGenre(req.body);
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
