'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('licenseTokens', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,   
      },
      spaceId: {
        type: Sequelize.UUID
      },
      tokenName: {
        type: Sequelize.STRING
      },
      network: {
        type: Sequelize.STRING
      },
      tokenContractAddress: {
        type: Sequelize.STRING
      },
      tokenDescription: {
        type: Sequelize.TEXT
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('licenseTokens');
  }
};