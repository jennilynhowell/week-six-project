'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addConstraint(
      'Users',
      ['username'],
      {
        type: 'unique',
        name: 'unique_user'
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeConstraint(
      'Users',
      'unique_user'
    );
  }
};
