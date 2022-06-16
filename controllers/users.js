const { hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const User = require('../models/user');
const { secretKey } = require('../utils/utils');
const NotFoundError = require('../errors/not-found-err');
const WrongDataError = require('../errors/wrong-data-err');
const AlreadyExistError = require('../errors/already-exist-err');

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  hash(password, 10)
    .then(passwordHash => User.create({
      email,
      password: passwordHash,
      name,
      about,
      avatar,
    }))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        throw new WrongDataError('Переданы некорректные данные при создании пользователя');
      }
      if (err.code === 11000) {
        throw new AlreadyExistError('Указанный Email уже зарегистрирован');
      }
      next(err);
    })
    .catch(next);
};

// Аутентификация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(user => {
      const token = sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 60480000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Вы успешно авторизовались' });
    })
    .catch(() => {
      throw new WrongDataError('Некорректные почта или пароль');
    })
    .catch(next);
};

// Запрос всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send({ users }))
    .catch(next);
};

// Запрос информации о конкретном пользователе
module.exports.getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => new NotFoundError('Пользователь по указанному _id не найден'))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        throw new WrongDataError('Указан некорректный формат _id пользователя');
      }
      next(err);
    })
    .catch(next);
};

// Запрос информации о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь по указанному _id не найден'))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        throw new WrongDataError('Указан некорректный формат _id пользователя');
      }
      next(err);
    })
    .catch(next);
};

// Обновление профиля пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        throw new WrongDataError('Переданы некорректные данные при обновлении пользователя');
      }
      if (err instanceof NotFoundError) {
        next(err);
      }
      next(err);
    })
    .catch(next);
};

// Обновление аватара пользователя
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        throw new WrongDataError('Переданы некорректные данные при обновлении аватара');
      }
      if (err instanceof NotFoundError) {
        next(err);
      }
      next(err);
    })
    .catch(next);
};
