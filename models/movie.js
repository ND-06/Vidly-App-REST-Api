/* eslint-disable no-unused-vars */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

// First we have to create a model and a Schema for Movies with different properties

const Movie = mongoose.model(
  'Movies',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true
    },
    director: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255
    },
    genre: {
      type: genreSchema,
      required: true
    },
    dateOfRelease: {
      type: Number,
      required: true,
      min: 1850,
      max: 2020
    },
    budgetInUsd: {
      type: Number,
      required: false,
      min: 0,
      max: 10000000000
    },
    nationality: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 30
    },
    rate: {
      type: Number,
      min: 0,
      max: 20,
      required: true
    },
    dailyRentalPriceInUsd: {
      type: Number,
      min: 1,
      max: 15
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    actors: [String]
  })
);

// Then we have to create Joi validator function

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .required()
      .min(3)
      .max(255),
    director: Joi.string()
      .min(3)
      .max(255)
      .required(),
    dateOfRelease: Joi.number()
      .required()
      .min(1850)
      .max(2020),
    budgetInUsd: Joi.number()
      .min(0)
      .max(10000000000),
    nationality: Joi.string()
      .required()
      .min(2)
      .max(30),
    rate: Joi.number()
      .required()
      .min(0)
      .max(20),
    genreId: Joi.string().required(),
    dailyRentalPriceInUsd: Joi.number()
      .min(1)
      .max(15),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100),
    actors: Joi.array()
      .items(Joi.string())
      .required()
  };
  return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
