'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    post: DataTypes.STRING
  }, {});

  Post.associate = function (models){
    Post.belongsTo(models.User, {as: 'user', foreignKey: 'userId'});
    Post.belongsToMany(models.User, {through: 'Likes', as: 'postLikes', foreignKey: 'postId'})
  }



  return Post;
};

// User.belongsToMany(models.Todo, {through: 'UserTodos', foreignKey: 'userId', otherKey: 'todoId'});
