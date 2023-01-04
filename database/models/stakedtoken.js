'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stakedToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.project, {
        foreignKey: "pid",
        as: "project",
     });
    }
  }
  stakedToken.init({
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    pid: Sequelize.UUID, 
    address: Sequelize.STRING, 
    tokens: Sequelize.TEXT,
  }, {
    sequelize,
    modelName: 'stakedToken',
  });
  return stakedToken;
};