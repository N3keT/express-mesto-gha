const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND_ERROR } = require('./utils/errors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// app.use(limiter);
// app.use(helmet());
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