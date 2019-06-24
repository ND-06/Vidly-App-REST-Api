/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const express = require('express');

const mongoose = require('mongoose');
const { validate, Movie } = require('../models/movie');
const { Genre } = require('../models/genre');

const router = express.Router();

// Get all movies

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.status(200).send(movies);
});

// Get a specific movie

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res
      .status(404)
      .send('Oups, the movie with the given ID was not found !');
  res.status(200).send(movie);
});

// Delete a specific Movie

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return res
      .status(404)
      .send('Oups, the movie with the given ID was not found !');
  res.status(200).send(movie);
});

// Create a movie in the DB

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid Genre');

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    dateOfRelease: req.body.dateOfRelease,
    budgetInUsd: req.body.budgetInUsd,
    nationality: req.body.nationality,
    director: req.body.director,
    rate: req.body.rate,
    actors: req.body.actors
  });
  movie = await movie.save();

  res.status(200).send(movie);
});

// Modify a movie in the DB

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid Genre');

  let movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      dateOfRelease: req.body.dateOfRelease,
      budgetInUsd: req.body.budgetInUsd,
      nationality: req.body.nationality,
      director: req.body.director,
      rate: req.body.rate,
      actors: req.body.actors
    },
    { new: true }
  );
  movie = await movie.save();

  res.status(200).send(movie);
});

module.exports = router;
