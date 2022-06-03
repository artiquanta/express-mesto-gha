const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ cards: cards }))
    .catch(err => res.status(500).send({
      message: 'Что-то пошло не так... Проверьте данные и повторите Ваш запрос чуть позже!'
    }));
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
      likes: card.likes
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так... Проверьте данные и повторите Ваш запрос чуть позже!' });
    });
}

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then(() => res.send({ message: 'Карточка места удалена' }))
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка с указанным _id не найден' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так... Проверьте данные и повторите Ваш запрос чуть позже!' });
    });
}

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then(card => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
      likes: card.likes
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так... Проверьте данные и повторите Ваш запрос чуть позже!' });
    });
}

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then(card => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
      likes: card.likes
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(500).send({ message: 'Что-то пошло не так... Проверьте данные и повторите Ваш запрос чуть позже!' });
    });
}