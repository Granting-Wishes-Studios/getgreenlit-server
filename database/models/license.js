'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class license extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.stakingTier,   {
        foreignKey: 'licenseId',
        as: 'licensetiers',
      });
    }
  }
  license.init({
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    spaceId: Sequelize.UUID,
    licenseFile: Sequelize.STRING,
    licenseFileName: Sequelize.STRING,
    licenseName: Sequelize.STRING,
    licenseSummary: Sequelize.STRING
  }, {
    sequelize,
    modelName: 'license',
  });
  return license;
};