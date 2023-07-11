'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    postId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.Post, { foreignKey: 'postId' });
    Comment.belongsTo(models.User, { foreignKey: 'userId' });
    Comment.hasMany(models.CommentLike, { foreignKey: 'commentId' });
  };
  return Comment;
};