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
      this.hasMany(models.project,      
        {
          foreignKey: 'stakingTierId',
           as: "projects" 
        });
      this.belongsTo(models.token,      
        {
            foreignKey: 'tokenId',
             as: "token" 
       });
      this.belongsTo(models.license,      
      {
        foreignKey: 'licenseId',
          as: "license" 
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
    tokenId: Sequelize.UUID,
    licenseId: Sequelize.UUID,
    tierName: Sequelize.STRING,
    tid: Sequelize.STRING,
    tierSummary: Sequelize.TEXT,
    requiredStake: Sequelize.INTEGER,
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