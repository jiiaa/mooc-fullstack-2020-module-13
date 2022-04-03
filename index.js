require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT });
    blogs.forEach(element => {
      console.log('%s: \'%s\', %s likes ', element.author, element.title, element.likes);
    });
    sequelize.close();
  } catch (err) {
    console.error('Unable to connect, error: ', error);
  }
};

main();
