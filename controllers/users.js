const User = require('../models/user');

// Коды ошибок
const DEFAULT_ERROR_CODE = 500;
const WRONG_DATA_CODE = 400;
const NOT_FOUND_CODE = 404;

// Запрос всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ users }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({
      message: 'На сервере произошла ошибка... Повторите Ваш запрос чуть позже!',
    }));
};

// Запрос информации о конкретном пользователе
module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(WRONG_DATA_CODE).send({
          message: 'Указан некорректный формат _id пользователя',
        });
        return;
      }
      if (!err.path) {
        res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь по указанному _id не найден',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка... Повторите Ваш запрос чуть позже!',
      });
    });
};

// Создание пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(WRONG_DATA_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!',
      });
    });
};

// Обновление профиля пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(WRONG_DATA_CODE).send({
          message: 'Переданы некорректные данные при обновлении пользователя',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь с указанным _id не найден',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!',
      });
    });
};

// Обновление аватара пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(WRONG_DATA_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_CODE).send({
          message: 'Пользователь с указанным _id не найден',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!',
      });
    });
};
