const Card = require('../models/card');
const {
  WRONG_DATA_CODE, NOT_FOUND_CODE, DEFAULT_ERROR_CODE, NotFoundError,
} = require('../utils/utils');

// Запрос всех карточек мест
module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ cards }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({
      message: 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!',
    }));
};

// Создание карточки места
module.exports.createCard = (req, res) => {
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
        res.status(WRONG_DATA_CODE).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!',
      });
    });
};

// Удаление карточки места
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => new NotFoundError('Not Found'))
    .then(() => {
      res.send({
        message: 'Карточка места удалена',
      });
    })
    .catch(err => {
      if (err.name === 'CastError') {
        res.status(WRONG_DATA_CODE).send({
          message: 'Карточка с указанным _id не найдена',
        });
        return;
      }
      if (err instanceof NotFoundError) {
        res.status(NOT_FOUND_CODE).send({
          message: 'Передан несуществующий _id карточки',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!',
      });
    });
};

// Добавления лайка для карточки
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Not Found'))
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
        res.status(WRONG_DATA_CODE).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
        return;
      }
      if (err instanceof NotFoundError) {
        res.status(NOT_FOUND_CODE).send({
          message: 'Передан несуществующий _id карточки',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!',
      });
    });
};

// Снятие лайка с карточки
module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new NotFoundError('Not Found'))
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
        res.status(WRONG_DATA_CODE).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
        return;
      }
      if (err instanceof NotFoundError) {
        res.status(NOT_FOUND_CODE).send({
          message: 'Передан несуществующий _id карточки',
        });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({
        message: 'На сервере произошла ошибка... Проверьте данные и повторите Ваш запрос чуть позже!',
      });
    });
};
