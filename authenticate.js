/* eslint-disable no-console */
const auth = (req, res, next) => {
  console.log("Authenticating...");
  next();
};

module.exports = auth;
