/* eslint-disable no-unused-vars */
/* eslint-disable radix */
const express = require('express');

const router = express.Router();

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Horror' },
  { id: 3, name: 'Drama' },
];

const validateGenre = (genre) => {
  const schema = {
    // eslint-disable-next-line no-undef
    name: Joi.string().min(3),
  };
  // eslint-disable-next-line no-undef
  return Joi.validate(genre, schema);
};

// Get all Genres
router.get('/', (req, res) => {
  res.status(200).send(genres);
});

// Get a specific genre
router.get('/:id', (req, res) => {
  // eslint-disable-next-line radix
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send('The genre with the given ID was not found');
  } else {
    res.status(200).send(genre);
  }
});

// Create a new genre

router.post('/', (req, res) => {
  const result = validateGenre(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  }
  const genre = { id: genres.length + 1, name: req.body.name };
  genres.push(genre);
  res.status(200).send(genre);
});

router.put('/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send('The genre with the given ID was not found');
  }
  const result = validateGenre(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  }
  genre.name = req.body.name;
  res.status(200).send(genre);
});

router.delete('/:id', (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) {
    res.status(404).send('The genre with the given ID was not found');
  }
  const index = genres.indexOf(genre);
  genres.splice(genre, 1);
  res.status(200).send(genre);
});


module.exports = router;
