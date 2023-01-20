'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.stakingTier,   {
        foreignKey: 'tokenId',
        as: 'tokentiers',
      });
    }
  }
  token.init({
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    spaceId: Sequelize.UUID,
    tid: Sequelize.STRING,
    tokenName: Sequelize.STRING,
    network: Sequelize.STRING,
    tokenContractAddress: Sequelize.STRING,
    tokenDescription: Sequelize.TEXT
  }, {
    sequelize,
    modelName: 'token',
  });
  return token;
};