'use strict';
module.exports = (sequelize, DataTypes) => {
  const Breed = sequelize.define('Breed', {
    name: DataTypes.STRING
  }, {});
  Breed.associate = function(models) {
    // associations can be defined here
    Breed.hasMany(models.Dog, { foreignKey: 'breedId' });
  };
  return Breed;
};