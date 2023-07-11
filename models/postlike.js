'use strict';
module.exports = (sequelize, DataTypes) => {
  const PostLike = sequelize.define('PostLike', {
    postId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  PostLike.associate = function(models) {
    // associations can be defined here
    PostLike.belongsTo(models.Post, { foreignKey: 'postId' });
    PostLike.belongsTo(models.User, { foreignKey: 'userId' });
  };
  return PostLike;
};