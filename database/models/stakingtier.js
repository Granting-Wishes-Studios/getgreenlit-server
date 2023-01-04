'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stakingTier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.space,      
        {
          foreignKey: 'spaceId',
            as: "tiers" 
        });
      this.hasOne(models.project,      
        {
          foreignKey: 'stakingTierId',
           as: "tier" 
        });
    }
  }
  stakingTier.init({
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    spaceId: Sequelize.UUID,
    tierName: Sequelize.STRING,
    tierSummary: Sequelize.TEXT,
    requiredToken: Sequelize.STRING,
    requiredStake: Sequelize.INTEGER,
    tokenId: Sequelize.STRING,
    licenseToBeGranted: Sequelize.STRING,
    projectCategory: Sequelize.STRING,
    projectBudgetRange: Sequelize.STRING,
    royalty: Sequelize.STRING,
    status: Sequelize.BOOLEAN,
    adminApproval: Sequelize.BOOLEAN,
  }, {
    sequelize,
    modelName: 'stakingTier',
  });
  return stakingTier;
};