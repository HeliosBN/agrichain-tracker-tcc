const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const SupplyChainEvent = require('../models/SupplyChainEvent');

// Debug route to view all data
router.get('/data', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    
    const products = await Product.findAll({
      order: [['created_at', 'DESC']]
    });
    
    const events = await SupplyChainEvent.findAll({
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      summary: {
        total_users: users.length,
        total_products: products.length,
        total_events: events.length,
        last_sync: new Date().toISOString()
      },
      users: users,
      products: products,
      events: events
    });
  } catch (error) {
    console.error('Debug data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get users only
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'created_at'],
      order: [['created_at', 'DESC']]
    });
    res.json({
      total: users.length,
      users: users
    });
  } catch (error) {
    console.error('Debug users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get products only
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({
      total: products.length,
      products: products
    });
  } catch (error) {
    console.error('Debug products error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get events only
router.get('/events', async (req, res) => {
  try {
    const events = await SupplyChainEvent.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({
      total: events.length,
      events: events
    });
  } catch (error) {
    console.error('Debug events error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Statistics dashboard
router.get('/stats', async (req, res) => {
  try {
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    const productsByCategory = await Product.findAll({
      attributes: [
        'category',
        [Product.sequelize.fn('COUNT', Product.sequelize.col('product_id')), 'count']
      ],
      group: ['category']
    });

    const totalUsers = await User.count();
    const totalProducts = await Product.count();
    const totalEvents = await SupplyChainEvent.count();

    res.json({
      totals: {
        users: totalUsers,
        products: totalProducts,
        events: totalEvents
      },
      breakdown: {
        users_by_role: usersByRole,
        products_by_category: productsByCategory
      },
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;