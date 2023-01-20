'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  role.init({
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    creator: {
      type: Sequelize.STRING
    },
    role: Sequelize.STRING,
    mid: {
      type: Sequelize.UUID,
    },
    address: Sequelize.STRING,
    status: Sequelize.BOOLEAN
  }, {
    sequelize,
    modelName: 'role',
  });
  return role;
};