const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SupplyChainEvent = sequelize.define('SupplyChainEvent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  
  from_user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  to_user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  event_type: {
    type: DataTypes.ENUM(
      'harvest', 
      'processing', 
      'quality_check', 
      'packaging', 
      'shipping', 
      'receiving', 
      'storage', 
      'retail_delivery', 
      'sale',
      'return'
    ),
    allowNull: false
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  
  location: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  
  // Dados específicos do evento
  event_data: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  
  // Condições ambientais
  temperature: {
    type: DataTypes.DECIMAL(5, 2)
  },
  
  humidity: {
    type: DataTypes.DECIMAL(5, 2)
  },
  
  // Documentos relacionados
  documents: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  
  // Status do evento
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    defaultValue: 'completed'
  },
  
  // Verificação
  verified_by: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  verification_date: {
    type: DataTypes.DATE
  },
  
  // Metadados
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
  
}, {
  tableName: 'supply_chain_events',
  indexes: [
    {
      fields: ['product_id']
    },
    {
      fields: ['event_type']
    },
    {
      fields: ['timestamp']
    },
    {
      fields: ['from_user_id']
    },
    {
      fields: ['to_user_id']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = SupplyChainEvent;
