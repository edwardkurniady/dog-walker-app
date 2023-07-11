'use strict';
module.exports = (sequelize, DataTypes) => {
  const Dog = sequelize.define('Dog', {
    name: DataTypes.STRING,
    ownerId: DataTypes.INTEGER,
    breedId: DataTypes.INTEGER,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    specialNeeds: DataTypes.STRING
  }, {});
  Dog.associate = function(models) {
    Dog.belongsTo(models.User, { foreignKey: 'ownerId' });
    Dog.belongsTo(models.Breed, { foreignKey: 'breedId' });
    Dog.hasMany(models.TransactionDetail, { foreignKey: 'dogId' });
  };
  return Dog;
};