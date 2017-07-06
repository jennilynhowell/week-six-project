'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    post: DataTypes.STRING
  }, {});

  Post.associate = function (models){
    //is the .belongsTo() necessary??
    Post.belongsTo(models.User, {as: 'user', foreignKey: 'userId'});
    Post.belongsToMany(models.User, {through: 'Likes', as: 'postLikes', foreignKey: 'postId', otherKey: 'userId'});
  }



  return Post;
};
