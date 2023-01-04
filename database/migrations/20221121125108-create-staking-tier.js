'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stakingTiers', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,   
      },
      spaceId: {
        type: Sequelize.UUID
      },
      tierName: {
        type: Sequelize.STRING
      },
      tierSummary: {
        type: Sequelize.TEXT
      },
      requiredToken: {
        type: Sequelize.STRING
      },
      requiredStake: {
        type: Sequelize.INTEGER
      },
      tokenId: {
        type: Sequelize.STRING
      },
      licenseToBeGranted: {
        type: Sequelize.STRING
      },
      projectCategory: {
        type: Sequelize.STRING
      },
      projectBudgetRange: {
        type: Sequelize.STRING
      },
      royalty: {
        type: Sequelize.STRING
      },
      status: Sequelize.BOOLEAN,
      adminApproval: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('stakingTiers');
  }
};