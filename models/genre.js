const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50
  }
});

// Create a genre model for the Database
const Genre = mongoose.model('Genre', genreSchema);

const validateGenre = genre => {
  const schema = {
    // eslint-disable-next-line no-undef
    name: Joi.string().min(3)
  };
  // eslint-disable-next-line no-undef
  return Joi.validate(genre, schema);
};

// We export Genre class and validateGenre function ( we have shortened validateGenre
// name to validate)
module.exports.Genre = Genre;
module.exports.validate = validateGenre;
