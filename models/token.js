const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Token extends Model {};

Token.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users',key: 'id' },
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
 }, {
  sequelize,
  underscored: true,
  timestamp: true,
  modelName: 'token'
});

module.exports = Token;