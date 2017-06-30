'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});

  User.associate = function(models) {
    User.hasMany(models.Post, {as: 'posts', foreignKey: 'userId'});

  };

  return User;
};

// User.belongsToMany(models.Todo, {through: 'UserTodos', foreignKey: 'userId', otherKey: 'todoId'});
