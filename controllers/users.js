const User = require('../models/user');
const { INCORRECT_DATA_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
  .then((user) => {
    if (!user) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь по указанному _id не найден' });
    }
    return res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные пользователя' });
    }
    return res.status(DEFAULT_ERROR).send({ message: 'Произошла ошибка' });
  });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(DEFAULT_ERROR).send({message: 'Произошла ошибка'})});
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
  .then((user) => {
    if (!user) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(DEFAULT_ERROR).send({message: 'Произошла ошибка'});
  });
};

module.exports.updateAvatar = (req, res) =>{
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
  .then((user) => {
    if (!user) {
      return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден' });
    }
    return res.send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(INCORRECT_DATA_ERROR).send({ message: 'Переданы некорректные данные при обновлении аватара' })
    }
    return res.status(DEFAULT_ERROR).send({message: 'Произошла ошибка'});
  });
};