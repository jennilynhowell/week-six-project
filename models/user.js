'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});

  User.associate = function(models) {
    User.hasMany(models.Post, {as: 'posts', foreignKey: 'userId'});
    User.belongsToMany(models.Post, {through: 'Likes', as: 'userLikes', foreignKey: 'userId', otherKey: 'postId'});
  };

  return User;
};
