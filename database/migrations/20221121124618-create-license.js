'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('licenses', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,   
      },
      spaceId: {
        type: Sequelize.UUID
      },
      licenseFile: {
        type: Sequelize.STRING
      },
      licenseFileName: {
        type: Sequelize.STRING
      },
      licenseName: {
        type: Sequelize.STRING
      },
      licenseSummary: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('licenses');
  }
};