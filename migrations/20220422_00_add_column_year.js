const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isMaxCurrentYear(year) {
          const today = new Date();
          const currentYear = today.getFullYear();
          if (value < 1991 || value > currentYear) {
            throw new Error('The year of published must be between 1991 and the current year');
          }
        }
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year');
  },
};
