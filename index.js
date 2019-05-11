/* eslint-disable no-console */
/* eslint-disable radix */
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
// eslint-disable-next-line no-unused-vars
const Joi = require('@hapi/joi');
const express = require('express');
const logger = require('./logger');
const genres = require('./routes/genres');
const auth = require('./authenticate');

const app = express();

// To detect in which environnement the app is running
console.log(`Application Name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Mail Server Password: ${config.get('mail.password')}`);
// Use
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('Morgan Enabled...');
}

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger, auth);

// We are telling to express that for any routes with this endpoint ,
// use the router ('genres' module)
app.use('/api/genres', genres);

// Get the HomePage of Vidly APP
app.get('/', (req, res) => {
  res.status(200).send('Welcome to The Official Vidly APP Rental Service!');
});

// Define our port - choose env.PORT or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
