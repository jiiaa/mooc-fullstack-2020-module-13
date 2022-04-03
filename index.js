require('dotenv').config();
const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize');

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

const main = async () => {
  try {
    await sequelize.authenticate();
    //const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT });
    const blogs = await Blog.findAll();
    blogs.forEach(element => {
      console.log('%s: %c\'%s\'%c, %s likes ', element.author, 'color: #bde052;', element.title, 'color: white;', element.likes);
    });
    sequelize.close();
  } catch (err) {
    console.error('Unable to connect, error: ', error);
  }
};

main();
