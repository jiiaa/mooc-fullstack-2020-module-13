require('dotenv').config();
const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize');
const express = require('express');
const app = express();

app.use(express.json());

const sequelize = new Sequelize(process.env.DB_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

class Blog extends Model{};
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
   url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
});

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    console.log(JSON.stringify(blogs));
    res.json(blogs);
  } catch(err) {
    return res.status(404).json({ err });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    console.log(blog);
    res.json(blog);
  } catch(err) {
    res.status(400).json({ err });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await Blog.destroy({ where: { id: id } });
    console.log(blog);
    res.status(200).json(blog);
  } catch(err) {
    res.status(400).json({ err });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 