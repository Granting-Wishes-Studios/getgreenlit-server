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
      tokenId: {
        type: Sequelize.UUID
      },
      licenseId: {
        type: Sequelize.UUID
      },
      tierName: {
        type: Sequelize.STRING
      },
      tid: {
        type: Sequelize.STRING
      },
      tierSummary: {
        type: Sequelize.TEXT
      },
      requiredStake: {
        type: Sequelize.INTEGER
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
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn ('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn ('now')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stakingTiers');
  }
};