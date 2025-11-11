const { Sequelize } = require('sequelize');

// Database configuration
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'agrichain_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'agrichain2024',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
  }
});

// Test connection with detailed info
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    console.log(`📊 Connected to: ${sequelize.config.database}`);
    console.log(`🌐 Host: ${sequelize.config.host}:${sequelize.config.port}`);
    console.log(`👤 User: ${sequelize.config.username}`);
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    console.error('🔧 Check if PostgreSQL is running and credentials are correct');
    return false;
  }
};

// Sync database
const syncDatabase = async (force = false) => {
  try {
    console.log('🔄 Syncing database...');
    await sequelize.sync({ force, alter: !force });
    console.log('✅ Database synced successfully');
    return true;
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};
