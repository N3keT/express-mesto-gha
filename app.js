const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { INCORRECT_DATA_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('./utils/errors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '63d55c30ed9c21a476949e1e'
  };

  next();
});
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Указанная страница не найдена' });
});

app.listen(PORT);