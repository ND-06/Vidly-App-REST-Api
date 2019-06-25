/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const express = require('express');

const mongoose = require('mongoose');
const { validate, Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

const router = express.Router();

// Get all rentals

router.get('/', async (req, res) => {
  // we sort our rentals by dateOut in descending order
  const rentals = await Rental.find().sort('-Dateout');
  res.status(200).send(rentals);
});

// Get a specific rental

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res
      .status(404)
      .send('Oups, the rental with the given ID was not found !');
  res.status(200).send(rental);
});

// Create a rental in the DB

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Then we have to be sure that the customer who sends to our server is
  // a valid customer with a valid customerId

  const customer = await Customer.findById(req.body.customerId);
  if (!genre) return res.status(400).send('Invalid Customer');

  // Then we have to be sure that the movie selected by the customer is
  // a valid movie with a valid movieId

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid Movie');

  // Also, we have to check if the movie selected by the customer is in stock

  if (movie.numberInStock === 0)
    return res
      .status(400)
      .send('We are sorry but your movie is out of stock !');

  // After this point , everything is valid , so we can create a new rental
  // the customer have to send all essential informations about him, and
  // all essential informations about the movie that he wants to rent

  let rental = new Rental({
    customer: {
      _id: customer._id,
      phone: customer.phone,
      name: customer.name
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalPriceInUsd: movie.dailyRentalPriceInUsd
    }
  });
  // we have not set dateOut property because by default , this DateOut is set automatically
  // by the server (date.now)

  rental = await rental.save();
  // after that , we have to update the stock of the movie, we need to decrement the stock
  movie.numberInStock--;
  movie.save();

  // In our case, we have to separate operations , and it is possible that the server crashes ,
  // or connection to MongoDB drops,
  // thats why we need to use "transactions"
  res.status(200).send(rental);
});

module.exports = router;
