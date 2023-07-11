'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Dogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      breedId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Breeds',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      age: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.INTEGER
      },
      gender: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      specialNeeds: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Dogs');
  }
};