const router = require('express').Router();
const { Op } = require('sequelize');

const { ReadList } = require('../models');

router.post('/', async (req, res, next) => {
  console.log('readingList: ', req.body);
  try {
    const read = await ReadList.create({
      userId: req.body.user_id,
      blogId: req.body.blog_id
    });
    res.json(read);
  } catch(error) {
    next(error);
  }
});

module.exports = router;

