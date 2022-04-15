const express = require('express');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');

app.use(express.json());

app.use('/api/blogs', blogsRouter);

const errorHandler = (err, req, res, next) => {
  console.error('Error message: ', err.message);
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

 