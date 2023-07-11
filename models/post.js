'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    content: DataTypes.STRING,
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.User, { foreignKey: 'userId' });
    Post.hasMany(models.PostLike, { foreignKey: 'postId' });
  };
  return Post;
};