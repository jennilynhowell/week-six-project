'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Posts',
      'post',
      {
        allowNull: false,
        type: Sequelize.STRING(140)
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Posts',
      'post',
      {
        allowNull: false,
        type: Sequelize.STRING
      }
    )
  }
};
