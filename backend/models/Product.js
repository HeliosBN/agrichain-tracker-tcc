const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  product_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  
  category: {
    type: DataTypes.ENUM('vegetables', 'fruits', 'grains', 'dairy', 'meat', 'herbs', 'others'),
    allowNull: false
  },
  
  variety: {
    type: DataTypes.STRING
  },
  
  description: {
    type: DataTypes.TEXT
  },
  
  // Informações do produtor
  producer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  producer_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  farm_location: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  
  // Informações de produção
  harvest_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  
  unit: {
    type: DataTypes.ENUM('kg', 'tons', 'units', 'liters'),
    allowNull: false
  },
  
  batch_number: {
    type: DataTypes.STRING
  },
  
  growing_method: {
    type: DataTypes.ENUM('organic', 'conventional', 'hydroponic', 'greenhouse'),
    defaultValue: 'conventional'
  },
  
  // Certificações
  certifications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  
  // Qualidade e análises
  quality_grade: {
    type: DataTypes.ENUM('A', 'B', 'C', 'premium'),
    defaultValue: 'A'
  },
  
  nutritional_info: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  
  // Status atual
  current_status: {
    type: DataTypes.ENUM('harvested', 'processed', 'in_transit', 'at_distributor', 'at_retailer', 'sold'),
    defaultValue: 'harvested'
  },
  
  current_location: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  
  current_holder_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Dados ambientais
  environmental_data: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  
  // Imagens e documentos
  images: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  
  documents: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  
  // Preços
  price_per_unit: {
    type: DataTypes.DECIMAL(10, 2)
  },
  
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'BRL'
  },
  
  // Metadados
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  
  // Analytics
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  
  expiry_date: {
    type: DataTypes.DATE
  }
  
}, {
  tableName: 'products',
  indexes: [
    {
      fields: ['product_id']
    },
    {
      fields: ['producer_id']
    },
    {
      fields: ['category']
    },
    {
      fields: ['current_status']
    },
    {
      fields: ['harvest_date']
    },
    {
      fields: ['is_active']
    }
  ]
});

module.exports = Product;
