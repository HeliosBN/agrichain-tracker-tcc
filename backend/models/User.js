const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  
  role: {
    type: DataTypes.ENUM('producer', 'distributor', 'retailer', 'consumer', 'admin'),
    allowNull: false,
    defaultValue: 'consumer'
  },
  
  phone: {
    type: DataTypes.STRING,
    validate: {
      len: [10, 15]
    }
  },
  
  address: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  
  company_name: {
    type: DataTypes.STRING
  },
  
  certification_number: {
    type: DataTypes.STRING
  },
  
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  
  last_login: {
    type: DataTypes.DATE
  },
  
  profile_image: {
    type: DataTypes.STRING
  },
  
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'users',
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['role']
    },
    {
      fields: ['is_active']
    }
  ]
});

module.exports = User;
