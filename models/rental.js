/* eslint-disable no-unused-vars */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

// First we need to create a custom schema & model for rental

// We dont re-use the customer schema cause we dont have to use all properties of customers
// for our rental Schema , so we creat a whole new schema in the same time for customers
// ( with the essential properties related to rental ) and a whole new schema for movies
// (with the essential properties related to rental);

const Rental = mongoose.model(
  'Rental',
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 2,
          maxlength: 50
        },
        isGold: {
          type: Boolean,
          required: true,
          default: false
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 20
        }
      }),
      required: true
    },
    movie: {
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
      },
      dailyRentalPriceInUsd: {
        type: Number,
        min: 1,
        max: 50,
        required: true
      },
      required: true
    },
    dateOut: {
      type: Date,
      default: Date.now,
      required: true
    },
    dateReturned: {
      type: Date
    },
    rentalFee: {
      type: Number,
      min: 1,
      max: 100000
    }
  })
);

function validateRental(rental) {
  const schema = {
    // this is properties that the client send to the server, because
    // we dont want the client to send the dateOut server or the datereturned or rentalFee
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  };
  return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
