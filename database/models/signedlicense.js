'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class signedLicense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  signedLicense.init({
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    pid: Sequelize.UUID, 
    address: Sequelize.STRING, 
    signee: Sequelize.STRING,
    sign: Sequelize.BOOLEAN,
    licenseFile: Sequelize.STRING,
  }, {
    sequelize,
    modelName: 'signedLicense',
  });
  return signedLicense;
};