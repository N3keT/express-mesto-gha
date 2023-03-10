const Card = require('../models/card');
const { INCORRECT_DATA_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
  });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
       return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные при удалении карточки' });
    }
    return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
});
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
  .then((card) => {
    if (!card) {
       return res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные для постановки лайка' })
    }
    return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
  });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
  .then((card) => {
    if (!card) {
       return res.status(NOT_FOUND_ERROR).send({ message: 'Передан несуществующий _id карточки' });
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные для снятии лайка' });
    }
    return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
  });
};