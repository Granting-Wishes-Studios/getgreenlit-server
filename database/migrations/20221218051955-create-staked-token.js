'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stakedTokens', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,   
      },
      pid: {
        type: Sequelize.UUID
      },
      address: {
        type: Sequelize.STRING
      },
      tokens: {
        type: Sequelize.TEXT
      },
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
    await queryInterface.dropTable('stakedTokens');
  }
};