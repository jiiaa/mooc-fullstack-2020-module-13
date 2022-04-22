const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Blog extends Model {};

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
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isMaxCurrentYear(year) {
        const today = new Date();
        const currentYear = today.getFullYear();
        if (year < 1991 || year > currentYear) {
          throw new Error('The year of published must be between 1991 and the current year');
        }
      }
    }
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog'
});

module.exports = Blog;
