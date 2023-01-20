'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class licenseIntro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.space, {
        foreignKey: 'spaceId',
        as: 'space',
      })
    }
  }
  licenseIntro.init({
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    spaceId: Sequelize.UUID,
    intro: Sequelize.TEXT
  }, {
    sequelize,
    modelName: 'licenseIntro',
  });
  return licenseIntro;
};