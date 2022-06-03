const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const NOT_FOUND_CODE = 404;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6299f5de56387abc14b6ab3e',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// Обработчик 404-ошибки
app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({
    message: 'Страница не найдена. Проверьте ссылку',
  });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log('Сервер запущен');
});
