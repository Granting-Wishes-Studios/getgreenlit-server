'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class space extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.project,   {
        foreignKey: 'spaceId',
        as: 'projects',
      });
      this.hasOne(models.licenseIntro,      
        {
          foreignKey: 'spaceId',
           as: "licenseIntro" 
        });
      this.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'owner',
      })
      this.hasMany(models.stakingTier,      
        {
          foreignKey: 'spaceId',
           as: "tiers" 
        });
      this.hasMany(models.membership,      
      {
        foreignKey: 'spaceId',
         as: "members" 
      });
     
    }
  }
  space.init({
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
    title: Sequelize.STRING,
    legalCustodian: Sequelize.STRING,
    ipDescription: Sequelize.TEXT,
    officialWebsite: Sequelize.STRING,
    twitter: Sequelize.STRING,
    discord: Sequelize.STRING,
    hideFromHomepage: Sequelize.BOOLEAN,
    logoImg: Sequelize.STRING,
    bannerImg: Sequelize.STRING,
    featuredImg: Sequelize.STRING,
    resources: Sequelize.TEXT
  }, {
    sequelize,
    modelName: 'space',
  });
  return space;
};