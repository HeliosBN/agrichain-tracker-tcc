const express = require('express');
const { Product, User, SupplyChainEvent } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const router = express.Router();

// GET /api/v1/analytics/dashboard - Dashboard geral
router.get('/dashboard', async (req, res) => {
  try {
    // Contadores gerais
    const totalProducts = await Product.count({ where: { is_active: true } });
    const totalUsers = await User.count({ where: { is_active: true } });
    const totalEvents = await SupplyChainEvent.count();

    // Produtos por categoria
    const productsByCategory = await Product.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('id')), 'count']
      ],
      where: { is_active: true },
      group: ['category'],
      raw: true
    });

    // Produtos por status
    const productsByStatus = await Product.findAll({
      attributes: [
        'current_status',
        [fn('COUNT', col('id')), 'count']
      ],
      where: { is_active: true },
      group: ['current_status'],
      raw: true
    });

    // Usuários por tipo
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [fn('COUNT', col('id')), 'count']
      ],
      where: { is_active: true },
      group: ['role'],
      raw: true
    });

    // Eventos por tipo (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const eventsByType = await SupplyChainEvent.findAll({
      attributes: [
        'event_type',
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        timestamp: { [Op.gte]: thirtyDaysAgo }
      },
      group: ['event_type'],
      raw: true
    });

    // Produtos mais visualizados
    const topViewedProducts = await Product.findAll({
      attributes: ['id', 'product_id', 'name', 'category', 'view_count'],
      where: { is_active: true },
      order: [['view_count', 'DESC']],
      limit: 5,
      raw: true
    });

    // Atividade recente (últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await SupplyChainEvent.findAll({
      attributes: [
        [fn('DATE', col('timestamp')), 'date'],
        [fn('COUNT', col('id')), 'events']
      ],
      where: {
        timestamp: { [Op.gte]: sevenDaysAgo }
      },
      group: [fn('DATE', col('timestamp'))],
      order: [[fn('DATE', col('timestamp')), 'ASC']],
      raw: true
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalUsers,
          totalEvents,
          activeProducts: await Product.count({
            where: {
              is_active: true,
              current_status: { [Op.not]: 'sold' }
            }
          })
        },
        charts: {
          productsByCategory,
          productsByStatus,
          usersByRole,
          eventsByType,
          recentActivity
        },
        topProducts: topViewedProducts
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar analytics do dashboard',
      error: error.message
    });
  }
});

// GET /api/v1/analytics/products - Analytics de produtos
router.get('/products', async (req, res) => {
  try {
    const { period = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Produtos criados por período
    const productsByPeriod = await Product.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        created_at: { [Op.gte]: startDate },
        is_active: true
      },
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
      raw: true
    });

    // Produtos por método de cultivo
    const productsByGrowingMethod = await Product.findAll({
      attributes: [
        'growing_method',
        [fn('COUNT', col('id')), 'count']
      ],
      where: { is_active: true },
      group: ['growing_method'],
      raw: true
    });

    // Produtos por qualidade
    const productsByQuality = await Product.findAll({
      attributes: [
        'quality_grade',
        [fn('COUNT', col('id')), 'count']
      ],
      where: { is_active: true },
      group: ['quality_grade'],
      raw: true
    });

    // Médias de preços por categoria
    const avgPriceByCategory = await Product.findAll({
      attributes: [
        'category',
        [fn('AVG', col('price_per_unit')), 'avg_price'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        is_active: true,
        price_per_unit: { [Op.not]: null }
      },
      group: ['category'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        productsByPeriod,
        productsByGrowingMethod,
        productsByQuality,
        avgPriceByCategory
      }
    });

  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar analytics de produtos',
      error: error.message
    });
  }
});

// GET /api/v1/analytics/supply-chain - Analytics da cadeia de suprimentos
router.get('/supply-chain', async (req, res) => {
  try {
    const { period = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Eventos por período
    const eventsByPeriod = await SupplyChainEvent.findAll({
      attributes: [
        [fn('DATE', col('timestamp')), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        timestamp: { [Op.gte]: startDate }
      },
      group: [fn('DATE', col('timestamp'))],
      order: [[fn('DATE', col('timestamp')), 'ASC']],
      raw: true
    });

    // Tempo médio entre eventos por produto
    const avgEventTime = await SupplyChainEvent.findAll({
      attributes: [
        'product_id',
        [fn('COUNT', col('id')), 'event_count'],
        [fn('MIN', col('timestamp')), 'first_event'],
        [fn('MAX', col('timestamp')), 'last_event']
      ],
      group: ['product_id'],
      having: literal('COUNT(id) > 1'),
      raw: true
    });

    // Eventos por localização (se disponível)
    const eventsByLocation = await SupplyChainEvent.findAll({
      attributes: [
        [literal("location->>'city'"), 'city'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        timestamp: { [Op.gte]: startDate },
        location: { [Op.ne]: null }
      },
      group: [literal("location->>'city'")],
      having: literal("location->>'city' IS NOT NULL"),
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 10,
      raw: true
    });

    // Status de produtos ao longo do tempo
    const statusEvolution = await SupplyChainEvent.findAll({
      attributes: [
        [fn('DATE', col('timestamp')), 'date'],
        'event_type',
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        timestamp: { [Op.gte]: startDate }
      },
      group: [fn('DATE', col('timestamp')), 'event_type'],
      order: [[fn('DATE', col('timestamp')), 'ASC']],
      raw: true
    });

    res.json({
      success: true,
      data: {
        eventsByPeriod,
        avgEventTime: avgEventTime.map(item => ({
          product_id: item.product_id,
          event_count: parseInt(item.event_count),
          duration_days: Math.ceil((new Date(item.last_event) - new Date(item.first_event)) / (1000 * 60 * 60 * 24))
        })),
        eventsByLocation: eventsByLocation.filter(item => item.city),
        statusEvolution
      }
    });

  } catch (error) {
    console.error('Error fetching supply chain analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar analytics da cadeia de suprimentos',
      error: error.message
    });
  }
});

// GET /api/v1/analytics/users - Analytics de usuários
router.get('/users', async (req, res) => {
  try {
    const { period = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Usuários por período
    const usersByPeriod = await User.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        created_at: { [Op.gte]: startDate },
        is_active: true
      },
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
      raw: true
    });

    // Usuários ativos (que fizeram login nos últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsers = await User.count({
      where: {
        last_login: { [Op.gte]: sevenDaysAgo },
        is_active: true
      }
    });

    // Verificação de usuários
    const verificationStats = await User.findAll({
      attributes: [
        'is_verified',
        [fn('COUNT', col('id')), 'count']
      ],
      where: { is_active: true },
      group: ['is_verified'],
      raw: true
    });

    // Top produtores (por número de produtos)
    const topProducers = await User.findAll({
      attributes: [
        'id',
        'name',
        'company_name',
        [fn('COUNT', col('products.id')), 'product_count']
      ],
      include: [{
        model: Product,
        as: 'products',
        attributes: [],
        where: { is_active: true },
        required: true
      }],
      where: {
        role: 'producer',
        is_active: true
      },
      group: ['User.id', 'User.name', 'User.company_name'],
      order: [[fn('COUNT', col('products.id')), 'DESC']],
      limit: 10,
      subQuery: false,
      raw: true
    });

    res.json({
      success: true,
      data: {
        usersByPeriod,
        activeUsers,
        verificationStats,
        topProducers
      }
    });

  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar analytics de usuários',
      error: error.message
    });
  }
});

module.exports = router;
