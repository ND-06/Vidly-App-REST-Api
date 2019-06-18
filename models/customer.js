const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

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

// we export the Customer class
module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
// we export the validateCustomer function
// ( we can make shorter with calling it validate)
