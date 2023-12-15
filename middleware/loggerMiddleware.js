const morgan = require('morgan');

const loggerMiddleware = morgan('combined', {
  skip: (req, res) => res.statusCode < 400, // Log only when status code is 4xx or 5xx
});

module.exports = loggerMiddleware;