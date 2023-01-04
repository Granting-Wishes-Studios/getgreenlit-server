'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class licenseToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  licenseToken.init({
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    spaceId: Sequelize.UUID,
    tokenName: Sequelize.STRING,
    network: Sequelize.STRING,
    tokenContractAddress: Sequelize.STRING,
    tokenDescription: Sequelize.TEXT
  }, {
    sequelize,
    modelName: 'licenseToken',
  });
  return licenseToken;
};