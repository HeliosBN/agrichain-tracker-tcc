const User = require('./User');
const Product = require('./Product');
const SupplyChainEvent = require('./SupplyChainEvent');

// Definir associações
User.hasMany(Product, {
  foreignKey: 'producer_id',
  as: 'products'
});

Product.belongsTo(User, {
  foreignKey: 'producer_id',
  as: 'producer'
});

Product.belongsTo(User, {
  foreignKey: 'current_holder_id',
  as: 'currentHolder'
});

Product.hasMany(SupplyChainEvent, {
  foreignKey: 'product_id',
  as: 'supplyChainEvents'
});

SupplyChainEvent.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

SupplyChainEvent.belongsTo(User, {
  foreignKey: 'from_user_id',
  as: 'fromUser'
});

SupplyChainEvent.belongsTo(User, {
  foreignKey: 'to_user_id',
  as: 'toUser'
});

SupplyChainEvent.belongsTo(User, {
  foreignKey: 'verified_by',
  as: 'verifier'
});

User.hasMany(SupplyChainEvent, {
  foreignKey: 'from_user_id',
  as: 'sentEvents'
});

User.hasMany(SupplyChainEvent, {
  foreignKey: 'to_user_id',
  as: 'receivedEvents'
});

module.exports = {
  User,
  Product,
  SupplyChainEvent
};
