'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    userId: DataTypes.INTEGER,
    walkerId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    walkDate: DataTypes.STRING,
    // basePrice: DataTypes.INTEGER,
    // totalPrice: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    // distance: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    beforePhoto: DataTypes.STRING,
    afterPhoto: DataTypes.STRING,
    poopPhoto: DataTypes.STRING,
    isRated: DataTypes.BOOLEAN,
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.User, { foreignKey: 'userId' });
    Transaction.belongsTo(models.Walker, { foreignKey: 'walkerId' });
    Transaction.hasMany(models.TransactionDetail, { foreignKey: 'transactionId' });
    Transaction.hasOne(models.Schedule, { foreignKey: 'transactionId' });
  };
  return Transaction;
};