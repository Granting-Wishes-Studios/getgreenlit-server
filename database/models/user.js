'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { 
      this.hasMany(models.space, {
        foreignKey: 'userId',
        as: 'spaces',
      });
  
      this.hasMany(models.project, {
        foreignKey: 'userId',
        as: 'projects',
      });
    }
  }
  user.init({
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    profileImage: Sequelize.STRING,
    userToken: Sequelize.STRING,
    address: Sequelize.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};