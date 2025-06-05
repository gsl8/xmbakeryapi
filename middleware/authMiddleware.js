const responseHandler = require('../utils/responseHandler');

const authenticate = (req, res, next) => {
  return responseHandler.error(res, 'Authentication disabled', 401);
};

const restrictTo = () => {
  return (req, res, next) => {
    return responseHandler.error(res, 'Authorization disabled', 403);
  };
};

module.exports = { authenticate, restrictTo };
