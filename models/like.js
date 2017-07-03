'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {});

  Like.associate = function(models) {
    Like.belongsTo(models.Post, {as: 'postLikes', foreignKey: 'id'});
    Like.belongsTo(models.User, {as: 'userLikes', foreignKey: 'id'});
  };

  return Like;
};
