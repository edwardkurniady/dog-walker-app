'use strict';
module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define('CommentLike', {
    commentId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  CommentLike.associate = function(models) {
    // associations can be defined here
    CommentLike.belongsTo(models.Comment, { foreignKey: 'commentId' });
    CommentLike.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return CommentLike;
};