'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionDetail = sequelize.define('TransactionDetail', {
    dogId: DataTypes.INTEGER,
    transactionId: DataTypes.INTEGER
  }, {});
  TransactionDetail.associate = function(models) {
    // associations can be defined here
    TransactionDetail.belongsTo(models.Dog, { foreignKey: 'dogId' });
    TransactionDetail.belongsTo(models.Transaction, { foreignKey: 'transactionId' });
  };
  return TransactionDetail;
};