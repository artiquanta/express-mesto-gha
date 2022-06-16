const { verify } = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized-err');
const { secretKey } = require('../utils/utils');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new NotAuthorizedError('Ошибка авторизации');
  }
  const token = jwt.replace('Bearer ', '');
  let playload;

  try {
    playload = verify(token, secretKey);
  } catch (err) {
    throw new NotAuthorizedError('Ошибка авторизации');
  }

  req.user = playload;
  next();
};