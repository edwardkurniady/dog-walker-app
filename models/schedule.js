'use strict';
module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
    transactionId: DataTypes.INTEGER,
    walkerId: DataTypes.INTEGER
  }, {});
  Schedule.associate = function(models) {
    // associations can be defined here
    Schedule.belongsTo(models.Walker, { foreignKey: 'walkerId' });
    Schedule.belongsTo(models.Transaction, { foreignKey: 'transactionId' });
  };
  return Schedule;
};