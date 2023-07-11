'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TransactionDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dogId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Dogs',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      transactionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Transactions',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TransactionDetails');
  }
};