const { Sequelize } = require('sequelize');
const { DB_URL } = require('./config');

const sequelize = new Sequelize(DB_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch(err) {
    console.error('connecting database failed');
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
