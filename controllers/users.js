const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ users }))
    .catch(err => res.status(500).send({ message: "Что-то пошло не так... Повторите Ваш запрос чуть позже!" }));
}

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: "Пользователь по указанному _id не найден" });
        return;
      }
      res.status(500).send({ message: "Что-то пошло не так... Повторите Ваш запрос чуть позже!" });
    });
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: "Переданы некорректные данные при создании пользователя" });
        return;
      }
      res.status(500).send({ message: "Что-то пошло не так... Проверьте данные и повторите Ваш запрос чуть позже!" });
    });
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: "Переданы некорректные данные при обновлении пользователя" });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: "Пользователь с указанным _id не найден" });
        return;
      }
      res.status(500).send({ message: "Что-то пошло не так... Проверьте данные и повторите Ваш запрос чуть позже!" });
    });
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: "Переданы некорректные данные при обновлении аватара" });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: "Пользователь с указанным _id не найден" });
        return;
      }
      res.status(500).send({ message: "Что-то пошло не так... Проверьте данные и повторите Ваш запрос чуть позже!" });
    });
}