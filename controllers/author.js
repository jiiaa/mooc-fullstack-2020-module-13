const router = require('express').Router();
const { Op } = require('sequelize');

const { Blog } = require('../models');
const User = require('../models/user');
const { sequelize } = require('../util/db');

// Get all authors, count of blogs and sum of likes of those blogs
router.get('/', async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: {
        exclude: ['id', 'author', 'url', 'title', 'likes', 'userId'],
        include: [
          [sequelize.fn('DISTINCT', sequelize.col('author')), 'author'],
          [sequelize.fn('COUNT', sequelize.col('*')), 'blogs'],
          [sequelize.fn('SUM', sequelize.col('likes')), 'likes_total'],
        ]
      },
      group: 'author',
      order: sequelize.literal('likes_total DESC')
    });
    res.json(authors);
  } catch (error) {
    return res.status(404).json({ error });
  }
});

module.exports = router;
