'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Walkers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      isVerified: {
        type: Sequelize.BOOLEAN
      },
      isRecommended: {
        type: Sequelize.BOOLEAN
      },
      description: {
        type: Sequelize.STRING
      },
      travelDistance: {
        type: Sequelize.INTEGER
      },
      walkDuration: {
        type: Sequelize.INTEGER
      },
      maxDogSize: {
        type: Sequelize.INTEGER
      },
      pricing: {
        type: Sequelize.INTEGER
      },
      rating: {
        type: Sequelize.DOUBLE
      },
      raters: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Walkers');
  }
};