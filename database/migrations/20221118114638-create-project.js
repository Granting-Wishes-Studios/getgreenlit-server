'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, 
        primaryKey: true,   
      },
      userId: {
        type: Sequelize.UUID,
      },
      spaceId: {
        type: Sequelize.UUID,
      },
      stakingTierId: {
        type: Sequelize.UUID
      },
      address: {
        type: Sequelize.STRING,
      },
      projectTitle: {
        type: Sequelize.STRING
      },
      projectDescription: {
        type: Sequelize.STRING
      },
      projectEmail: {
        type: Sequelize.STRING
      },
      projectCategory: {
        type: Sequelize.STRING
      },
      projectAnticipatedRelease: {
        type: Sequelize.STRING
      },
      projectRelease: {
        type: Sequelize.STRING
      },
      projectAction: {
        type: Sequelize.STRING
      },
      projectActionLink: {
        type: Sequelize.STRING
      },
      twitter: {
        type: Sequelize.STRING
      },
      discord: {
        type: Sequelize.STRING
      },
      bannerImg: {
        type: Sequelize.STRING
      },
      featuredImg: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected", "in-progress", "released", "defunct"),
        defaultValue: "pending",
      },
      authored: {
        type: Sequelize.STRING
      },
      statusNote: {
        type: Sequelize.TEXT
      },
      staked: {
        type: Sequelize.BOOLEAN
      },
      signed: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('projects');
  }
};