const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('index', {
    title: 'Vidly APP',
    message: 'Welcome to Official Vidly App !'
  });
});

module.exports = router;
