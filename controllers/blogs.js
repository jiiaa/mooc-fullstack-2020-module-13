const router = require('express').Router();

const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  const id = req.params.id;
  req.blog = await Blog.findByPk(id);
  next();
};

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch(error) {
    return res.status(404).json({ error });
  }
});

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch(error) {
    res.status(400).json({ error });
  }
});

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    try {
      req.blog.likes = req.body.likes;
      const response = await req.blog.save();
      res.json(response);
    } catch(error) {
      res.status(404).json({ error: error });
    }
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    try {
      const response = await blog.destroy();
      res.status(204).json(response);
    } catch(err) {
      res.status(404).json({ err });
    }
  }
});

module.exports = router;
