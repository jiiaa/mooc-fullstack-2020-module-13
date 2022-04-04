const router = require('express').Router();

const { Blog } = require('../models');

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

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const likes = req.body.likes;
  const blog = await Blog.findByPk(id);
  if (blog) {
    try {
      blog.likes = likes;
      const response = await blog.save();
      res.json(response);
    } catch(error) {
      res.status(404).json({ error: error });
    }
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findByPk(id);
  if (blog) {
    try {
      const response = await blog.destroy();
      res.status(204).json(response);
    } catch(err) {
      res.status(404).json({ err });
    }
  }
});

module.exports = router;
