'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlpha: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        matchPass: function() {
          if (password != this.password) {
            throw new Error('Log-in validation error.');
          }
        }
      }
    }

  }, {});

  User.associate = function(models) {
    User.hasMany(models.Post, {as: 'posts', foreignKey: 'userId'});
    User.belongsToMany(models.Post, {through: 'Likes', as: 'userLikes', foreignKey: 'userId', otherKey: 'postId'});
  };

  return User;
};
