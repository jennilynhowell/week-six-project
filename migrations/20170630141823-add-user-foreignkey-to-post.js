'use strict';
//add foreign key "userId" to post table

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn (
      'Posts',
      'userId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'Posts',
      'userId'
    )
  }
};
