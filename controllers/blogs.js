const router = require('express').Router();

const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  const id = req.params.id;
  try {
    req.blog = await Blog.findByPk(id);
    next();
  } catch(exception) {
    next(exception);
  }
};

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch(exception) {
    return res.status(404).json({ exception });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch(exception) {
    next(exception);
  }
});

router.put('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    try {
      req.blog.likes = req.body.likes;
      const response = await req.blog.save();
      res.json(response);
    } catch(exception) {
      next(exception);
    }
  } else {
    res.status(404).end();
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    try {
      const response = await req.blog.destroy();
      res.status(204).json(response);
    } catch(exception) {
      return res.status(404).json({ exception });
    }
  } else {
    res.status(404).end();
  }
});

module.exports = router;
