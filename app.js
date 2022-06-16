const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, isCelebrateError } = require('celebrate');
const { urlPattern, celebrateErrors } = require('./utils/utils');

const { PORT = 3000 } = process.env;
const { createUser, login } = require('./controllers/users');
const WrongDataError = require('./errors/wrong-data-err');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(rateLimit({
  windowMs: 900000,
  max: 100,
}));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlPattern),
  }).messages(celebrateErrors),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }).messages(celebrateErrors),
}), login);

app.use(require('./middlewares/auth'));

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Обработчик 404-ошибки
app.use((req, res) => {
  res.status(404).send({
    message: 'Страница не найдена. Проверьте ссылку',
  });
});

// Обработчик ошибок валидации celebrate
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    throw new WrongDataError(err.details.get('body').message);
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!'
        : message,
    });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
