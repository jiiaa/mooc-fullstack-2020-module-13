const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User } = require('../models');
const { Blog } = require('../models');
const { ReadList } = require('../models');

// Get all users and their blogs
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash', 'updatedAt'] },
      include: {
        model: Blog,
        // attributes: ['author', 'title', 'url', 'likes']
        attributes: { exclude: ['userId'] }
      }
    });
    res.json(users);
  } catch(exception) {
    res.status(404).json({ exception });
  }
});

// Create a new user
router.post('/', async (req, res, next) => {
  const { username, password, name } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  try {
    const user = await User.create({ username, passwordHash, name });
    res.json(user);
  } catch(exception) {
    next(exception);
  }
});

// Get a user's reading list
router.get('/:id', async (req, res, next) => {
  const where = {};

  if (req.query.read) {
    where.isRead = req.query.read
  }

  try {
    const users = await User.findAll({
      attributes: ['name', 'username'],
      include: {
        model: Blog,
        as: 'readBlogs',
        attributes: { exclude: ['createdAt', 'updatedAt', 'userId']},
        through: {
          attributes: ['id', 'isRead'],
          where,
        },
      },
    });
    res.json(users);
  } catch(error) {
    next(error);
  }
});

// Change user's name
router.put('/:username', async (req, res, next) => {
  const username = req.params.username;
  try {
    const user = await User.findOne({
      where: {
        username
      }
    });
    if (user) {
      user.name = req.body.name;
      const response = await user.save();
      res.json(response);
    } else {
      res.status(404).end();
    }
  } catch(exception) {
    next(exception);
  }
});

module.exports = router;