const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const authorRouter = require('./controllers/author');
const readListRouter = require('./controllers/readinglist');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/authors', authorRouter);
app.use('/api/readinglists', readListRouter);

const errorHandler = (err, req, res, next) => {
  if (err.message.includes('Validation isEmail on username failed')) {
    return res.status(404).json({ error: 'Username must be a valid email'});
  }
  res.status(404).json({ error: err.message });
  next(err);
};

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

 