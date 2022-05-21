const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      default: false
    }).then(function (data) {
      queryInterface.sequelize.query(
        `UPDATE users SET disabled=false`
      )
    }).then(function (data) {
      queryInterface.changeColumn('users', 'disabled', {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      });
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'disabled'); 
  },
};