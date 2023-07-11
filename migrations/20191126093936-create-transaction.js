'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      walkerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Walkers',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      status: {
        type: Sequelize.STRING
      },
      walkDate: {
        type: Sequelize.STRING
      },
      // basePrice: {
      //   type: Sequelize.INTEGER
      // },
      // totalPrice: {
      //   type: Sequelize.INTEGER
      // },
      price: {
        type: Sequelize.INTEGER
      },
      // distance: {
      //   type: Sequelize.INTEGER
      // },
      duration: {
        type: Sequelize.INTEGER
      },
      beforePhoto: {
        type: Sequelize.STRING
      },
      afterPhoto: {
        type: Sequelize.STRING
      },
      poopPhoto: {
        type: Sequelize.STRING
      },
      isRated: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('Transactions');
  }
};