/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const config = require('config');

/* eslint-disable no-unused-vars */
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res
      .status(401)
      .send(
        'Access Denied : no token provided. You have to be registered to make this action.'
      );
  }
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    // if its valid, it will be decoded and will return the payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = auth;
