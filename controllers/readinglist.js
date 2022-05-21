const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { SECRET } = require('../util/config');
const { ReadList } = require('../models');
const { Token } = require('../models');
const { User } = require('../models');

// Verify token, session and user and extract user data
const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  const token = authorization.substring(7);
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(token, SECRET);
      const sessionValid = await Token.findOne({ where: { token }});
      if (!sessionValid) {
        return res.status(401).json({ error: 'Token expired' });
      }
      const user = await User.findByPk(req.decodedToken.id);
      if (user.disabled === true) {
        return res.status(403).json({ error: 'User is disabled' });
      }
    } catch (error){
      console.error({ error });
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

// Set the status of blog to read
router.put('/:id', tokenExtractor, async (req, res, next) => {
  if (req.body.read !== true ) {
    return res.status(400).json({ error: 'Read status missing or invalid'});
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

