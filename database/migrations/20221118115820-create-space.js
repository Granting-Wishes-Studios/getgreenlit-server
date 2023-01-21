'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spaces', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,   
      },
      userId: {
        type: Sequelize.UUID,
      },
      address: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING
      },
      legalCustodian: {
        type: Sequelize.STRING
      },
      ipDescription: {
        type: Sequelize.TEXT
      },
      officialWebsite: {
        type: Sequelize.STRING
      },
      twitter: {
        type: Sequelize.STRING
      },
      discord: {
        type: Sequelize.STRING
      },
      hideFromHomepage: {
        type: Sequelize.BOOLEAN
      },
      logoImg: {
        type: Sequelize.STRING
      },
      bannerImg: {
        type: Sequelize.STRING
      },
      featuredImg: {
        type: Sequelize.STRING
      },
      resources: {
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
    await queryInterface.dropTable('spaces');
  }
};