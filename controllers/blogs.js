const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { SECRET } = require('../util/config');
const { Blog } = require('../models');
const { User } = require('../models/');
const { Token } = require('../models');

// Find a blog by primary key (id)
const blogFinder = async (req, res, next) => {
  const id = req.params.id;
  try {
    req.blog = await Blog.findByPk(id);
    next();
  } catch(exception) {
    next(exception);
  }
};

// Verify the token, session and user and extract user data
const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  const token = authorization.substring(7);
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      const sessionValid = await Token.findOne({ where: { token }});
      if (!sessionValid) {
        res.status(401).json({ error: 'Token invalid' });
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

// Get all blogs or search blogs by string in author or in title
router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
  };

  try {
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
        include: {
          model: User,
          attributes: ['name']
        },
        where,
        order: [
          ['likes', 'DESC']
        ]
    });
    res.json(blogs);
  } catch(error) {
    return res.status(404).json({ error: error });
  }
});

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create({...req.body, userId: user.id});
    res.json(blog);
  } catch(error) {
    next(error);
  }
});

router.put('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    try {
      req.blog.likes = req.body.likes;
      const response = await req.blog.save();
      res.json(response);
    } catch(error) {
      next(error);
    }
  } else {
    res.status(404).end();
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog not found'});
  }
  if (req.blog.userId === req.decodedToken.id) {
    try {
      const response = await req.blog.destroy();
      res.status(204).json(response);
    } catch(error) {
      return res.status(404).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Only the blog owner can delete the blog'});
  }
});

module.exports = router;
