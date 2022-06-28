const { allowedCors, DEFAULT_ALLOWED_METHODS } = require('../utils/utils');

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;

  if (allowedCors.includes(origin)) {
    res.set({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
    });

    if (method === 'OPTIONS') {
      const requestHeaders = req.headers['access-control-request-headers'];
      res.set({
        'Access-Control-Allow-Methods': DEFAULT_ALLOWED_METHODS,
        'Access-Control-Allow-Headers': requestHeaders,
      });
    }
  }

  next();
};
