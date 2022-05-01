const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { SECRET } = require('../util/config');
const { ReadList } = require('../models');

// Verify the token and extract the user info
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error){
      console.log({ error });
      return res.status(401).json({ error: 'Token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'Token missing' });
  }
  next();
}

// Add new blog with user to reading list
router.post('/', async (req, res, next) => {
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

// Update isRead to true
router.put('/:id', tokenExtractor, async (req, res, next) => {
  if (req.body.read !== true ) {
    return res.status(400).json({ error: 'Read status missing or invalid'});
  }

  if (!req.decodedToken) {
    return res.status(400).json({ error: 'Token missing or invalid' });
  }
  try {
    const readBlog = await ReadList.findByPk(req.params.id);
    if (readBlog.userId === req.decodedToken.id) {
      readBlog.isRead = true;
      const response = await readBlog.save();
      res.json(response);
    } else {
      return res.status(403).json({
        error: 'Only the owner is allowed to set the status'
      });
    }
  } catch(error) {
    next(error);
  }
})

module.exports = router;

