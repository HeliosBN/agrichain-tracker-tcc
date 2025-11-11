const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash'
  },
  role: {
    type: DataTypes.ENUM('producer', 'distributor', 'retailer', 'consumer'),
    allowNull: false,
    defaultValue: 'consumer'
  }
}, {
  timestamps: true,
  tableName: 'users'
});

User.prototype.validatePassword = function(password) {
  // Para dados de teste, comparação simples
  return this.password_hash === password;
};

module.exports = User;
