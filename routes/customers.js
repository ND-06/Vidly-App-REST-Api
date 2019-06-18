/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();

// Create a Schema

const customersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  lastname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 12
  },
  isGold: {
    type: Boolean,
    default: false
  }
});

// Create a model and compile it with the schema

const Customer = mongoose.model('Customer', customersSchema);

// const Customer = mongoose.model('Customer', customersSchema);

// Validation with Joi

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    lastname: Joi.string()
      .min(2)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(6)
      .max(12)
      .required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

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
  const result = validateCustomer(req.body);
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
  const result = validateCustomer(req.body);
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
