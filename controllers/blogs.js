const router = require('express').Router();

const { Blog } = require('../models');

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch(err) {
    return res.status(404).json({ err });
  }
});

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch(err) {
    res.status(400).json({ err });
  }
});

router.delete('/api/blogs/:id', async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findByPk(id);
  if (blog) {
    try {
      const response = await blog.destroy();
      res.status(204).json(response);
    } catch(err) {
      res.status(400).json({ err });
    }
  }
});

module.exports = router;