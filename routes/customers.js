/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const express = require('express');

// we import our validateCustomer function
// and our Customer class function from our customer model
// we use destructuring in order to load at the same time
// validate function and Customer class

const { Customer, validate } = require('../models/customer');

const router = express.Router();

// Get all customers

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.status(200).send(customers);
});

// Get a specific customer
router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send('The customer with the given id was not found!');
  res.status(200).send(customer);
});

// Create a new customer

router.post('/', async (req, res) => {
  const result = validate(req.body);
  if (result.error) res.status(400).send(result.details[0].message);
  let customer = new Customer({
    name: req.body.name,
    lastname: req.body.lastname,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  customer = await customer.save();

  res.send(customer);
});

router.put('/:id', async (req, res) => {
  const result = validate(req.body);
  if (result.error) res.status(400).send(result.details[0].message);
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      lastname: req.body.lastname,
      isGold: req.body.isGold,
      phone: req.body.phone
    },
    { new: true }
  );
  if (!customer)
    return res
      .status(404)
      .send('The customer with the given id was not found!');
  res.status(200).send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  res.status(200).send(customer);
});

module.exports = router;
