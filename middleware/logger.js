const log = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('Logging...');
  next();
};

module.exports = log;
