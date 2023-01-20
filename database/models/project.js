'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'owner'
      });
      this.belongsTo(models.space, {
        foreignKey: 'spaceId',
        as: 'space'
      });
      this.hasOne(models.stakedToken,      
        {
          foreignKey: 'pid',
           as: "stakedtokens" 
        });
      this.belongsTo(models.stakingTier,      
        {
          foreignKey: 'stakingTierId',
            as: "tier" 
        });
    }
  }
  project.init({
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
    stakingTierId: Sequelize.UUID,
    address: {
      type: Sequelize.STRING,
    },
    projectTitle: Sequelize.STRING,
    projectDescription: Sequelize.STRING,
    projectEmail: Sequelize.STRING,
    projectCategory: Sequelize.STRING,
    projectAnticipatedRelease: Sequelize.STRING,
    projectRelease: Sequelize.STRING,
    projectAction: Sequelize.STRING,
    projectActionLink: Sequelize.STRING,
    twitter: Sequelize.STRING,
    discord: Sequelize.STRING,
    bannerImg: Sequelize.STRING,
    featuredImg: Sequelize.STRING,
    status: {
      type: Sequelize.ENUM,
      values: ["pending", "approved", "rejected", "in-progress", "released", "defunct"]
    },
    authored: Sequelize.STRING,
    statusNote: Sequelize.TEXT,
    staked: Sequelize.BOOLEAN,
    signed: Sequelize.BOOLEAN,
  }, {
    sequelize,
    modelName: 'project',
  });
  return project;
};