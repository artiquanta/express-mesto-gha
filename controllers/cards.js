const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const WrongDataError = require('../errors/wrong-data-err');

// Запрос всех карточек мест
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then(cards => res.send({ cards }))
    .catch((err) => next(err));
};

// Создание карточки места
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
      likes: card.likes,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        throw new WrongDataError('Переданы некорректные данные при создании карточки');
      }
      next(err);
    })
    .catch(next);
};

// Удаление карточки места
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then(() => {
      res.send({
        message: 'Карточка места удалена',
      });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        throw new WrongDataError('Карточка с указанным _id не найдена');
      }
      if (err instanceof NotFoundError) {
        next(err);
      }
      next(err);
    })
    .catch(next);
};

// Добавления лайка для карточки
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then(card => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
      likes: card.likes,
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        throw new WrongDataError('Переданы некорректные данные для постановки лайка');
      }
      if (err instanceof NotFoundError) {
        next(err);
      }
      next(err);
    })
    .catch(next);
};

// Снятие лайка с карточки
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки'))
    .then(card => res.send({
      _id: card._id,
      name: card.name,
      link: card.link,
      owner: card.owner,
      createdAt: card.createdAt,
      likes: card.likes,
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        throw new WrongDataError('Переданы некорректные данные для постановки лайка');
      }
      if (err instanceof NotFoundError) {
        next(err);
      }
      next(err);
    })
    .catch(next);
};
