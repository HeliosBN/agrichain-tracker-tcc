const express = require('express');
const { Product, User, SupplyChainEvent } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/v1/supply-chain/events - Listar eventos da cadeia de suprimentos
router.get('/events', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      product_id,
      event_type,
      from_date,
      to_date
    } = req.query;

    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    if (product_id) {
      whereClause.product_id = product_id;
    }
    
    if (event_type) {
      whereClause.event_type = event_type;
    }
    
    if (from_date || to_date) {
      whereClause.timestamp = {};
      if (from_date) {
        whereClause.timestamp[Op.gte] = new Date(from_date);
      }
      if (to_date) {
        whereClause.timestamp[Op.lte] = new Date(to_date);
      }
    }

    const { count, rows } = await SupplyChainEvent.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'product_id', 'name', 'category']
        },
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'name', 'company_name', 'role']
        },
        {
          model: User,
          as: 'toUser',
          attributes: ['id', 'name', 'company_name', 'role']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['timestamp', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching supply chain events:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar eventos da cadeia de suprimentos',
      error: error.message
    });
  }
});

// GET /api/v1/supply-chain/product/:product_id/timeline - Timeline do produto
router.get('/product/:product_id/timeline', async (req, res) => {
  try {
    const { product_id } = req.params;

    // Buscar produto
    const product = await Product.findOne({
      where: {
        [Op.or]: [
          { id: product_id },
          { product_id: product_id }
        ]
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Buscar eventos do produto
    const events = await SupplyChainEvent.findAll({
      where: { product_id: product.id },
      include: [
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'name', 'company_name', 'role']
        },
        {
          model: User,
          as: 'toUser',
          attributes: ['id', 'name', 'company_name', 'role']
        }
      ],
      order: [['timestamp', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          product_id: product.product_id,
          name: product.name,
          category: product.category,
          current_status: product.current_status
        },
        timeline: events
      }
    });

  } catch (error) {
    console.error('Error fetching product timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar timeline do produto',
      error: error.message
    });
  }
});

// POST /api/v1/supply-chain/events - Criar novo evento
router.post('/events', async (req, res) => {
  try {
    const {
      product_id,
      from_user_id,
      to_user_id,
      event_type,
      description,
      location,
      timestamp,
      event_data,
      temperature,
      humidity,
      documents
    } = req.body;

    // Validações básicas
    if (!product_id || !event_type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: product_id, event_type, description'
      });
    }

    // Verificar se o produto existe
    const product = await Product.findOne({
      where: {
        [Op.or]: [
          { id: product_id },
          { product_id: product_id }
        ]
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Criar evento
    const event = await SupplyChainEvent.create({
      product_id: product.id,
      from_user_id,
      to_user_id,
      event_type,
      description,
      location: location || {},
      timestamp: timestamp || new Date(),
      event_data: event_data || {},
      temperature,
      humidity,
      documents: documents || []
    });

    // Atualizar status do produto se necessário
    const statusMap = {
      'harvest': 'harvested',
      'processing': 'processed',
      'shipping': 'in_transit',
      'receiving': 'at_distributor',
      'retail_delivery': 'at_retailer',
      'sale': 'sold'
    };

    if (statusMap[event_type]) {
      await product.update({
        current_status: statusMap[event_type],
        current_holder_id: to_user_id || from_user_id
      });
    }

    // Buscar evento criado com associações
    const createdEvent = await SupplyChainEvent.findByPk(event.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'product_id', 'name']
        },
        {
          model: User,
          as: 'fromUser',
          attributes: ['id', 'name', 'company_name']
        },
        {
          model: User,
          as: 'toUser',
          attributes: ['id', 'name', 'company_name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Evento criado com sucesso',
      data: createdEvent
    });

  } catch (error) {
    console.error('Error creating supply chain event:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar evento',
      error: error.message
    });
  }
});

// PUT /api/v1/supply-chain/events/:id - Atualizar evento
router.put('/events/:id', async (req, res) => {
  try {
    const event = await SupplyChainEvent.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    const updatedEvent = await event.update(req.body);

    res.json({
      success: true,
      message: 'Evento atualizado com sucesso',
      data: updatedEvent
    });

  } catch (error) {
    console.error('Error updating supply chain event:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar evento',
      error: error.message
    });
  }
});

// POST /api/v1/supply-chain/transfer - Transferir produto
router.post('/transfer', async (req, res) => {
  try {
    const {
      product_id,
      from_user_id,
      to_user_id,
      location,
      notes
    } = req.body;

    if (!product_id || !from_user_id || !to_user_id) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: product_id, from_user_id, to_user_id'
      });
    }

    // Verificar produto
    const product = await Product.findOne({
      where: {
        [Op.or]: [
          { id: product_id },
          { product_id: product_id }
        ]
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Verificar usuários
    const fromUser = await User.findByPk(from_user_id);
    const toUser = await User.findByPk(to_user_id);

    if (!fromUser || !toUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuário remetente ou destinatário não encontrado'
      });
    }

    // Criar evento de transferência
    const transferEvent = await SupplyChainEvent.create({
      product_id: product.id,
      from_user_id,
      to_user_id,
      event_type: 'shipping',
      description: `Transferência de ${fromUser.name} para ${toUser.name}`,
      location: location || {},
      event_data: {
        transfer_type: 'ownership',
        notes: notes || ''
      }
    });

    // Atualizar produto
    await product.update({
      current_holder_id: to_user_id,
      current_status: 'in_transit'
    });

    res.status(201).json({
      success: true,
      message: 'Transferência registrada com sucesso',
      data: transferEvent
    });

  } catch (error) {
    console.error('Error transferring product:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar transferência',
      error: error.message
    });
  }
});

module.exports = router;
