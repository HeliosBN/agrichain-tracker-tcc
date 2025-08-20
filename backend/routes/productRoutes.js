const express = require('express');
const { Product, User, SupplyChainEvent } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const router = express.Router();

// Gerar ID único para produto
const generateProductId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `AGRI-${timestamp}-${random}`.toUpperCase();
};

// GET /api/v1/products - Listar produtos
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      producer_id,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    
    let whereClause = { is_active: true };
    
    if (category) {
      whereClause.category = category;
    }
    
    if (status) {
      whereClause.current_status = status;
    }
    
    if (producer_id) {
      whereClause.producer_id = producer_id;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { product_id: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'producer',
          attributes: ['id', 'name', 'company_name']
        },
        {
          model: User,
          as: 'currentHolder',
          attributes: ['id', 'name', 'company_name'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
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
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos',
      error: error.message
    });
  }
});

// GET /api/v1/products/:id - Buscar produto específico
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        [Op.or]: [
          { id: req.params.id },
          { product_id: req.params.id }
        ]
      },
      include: [
        {
          model: User,
          as: 'producer',
          attributes: ['id', 'name', 'email', 'company_name', 'phone']
        },
        {
          model: User,
          as: 'currentHolder',
          attributes: ['id', 'name', 'company_name'],
          required: false
        },
        {
          model: SupplyChainEvent,
          as: 'supplyChainEvents',
          include: [
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
          ],
          order: [['timestamp', 'ASC']]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Incrementar contador de visualizações
    await product.increment('view_count');

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produto',
      error: error.message
    });
  }
});

// POST /api/v1/products - Criar novo produto
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      variety,
      description,
      producer_id,
      producer_name,
      farm_location,
      harvest_date,
      quantity,
      unit,
      batch_number,
      growing_method,
      certifications,
      quality_grade,
      nutritional_info,
      environmental_data,
      price_per_unit,
      expiry_date
    } = req.body;

    // Validações básicas
    if (!name || !category || !producer_id || !harvest_date || !quantity || !unit) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: name, category, producer_id, harvest_date, quantity, unit'
      });
    }

    // Verificar se o produtor existe
    const producer = await User.findByPk(producer_id);
    if (!producer) {
      return res.status(404).json({
        success: false,
        message: 'Produtor não encontrado'
      });
    }

    const productId = generateProductId();

    const product = await Product.create({
      product_id: productId,
      name,
      category,
      variety,
      description,
      producer_id,
      producer_name: producer_name || producer.name,
      farm_location: farm_location || {},
      harvest_date,
      quantity,
      unit,
      batch_number,
      growing_method: growing_method || 'conventional',
      certifications: certifications || [],
      quality_grade: quality_grade || 'A',
      nutritional_info: nutritional_info || {},
      environmental_data: environmental_data || {},
      price_per_unit,
      current_holder_id: producer_id,
      expiry_date
    });

    // Criar evento inicial de colheita
    await SupplyChainEvent.create({
      product_id: product.id,
      from_user_id: producer_id,
      to_user_id: producer_id,
      event_type: 'harvest',
      description: `Produto ${name} colhido`,
      location: farm_location || {},
      timestamp: harvest_date,
      event_data: {
        quantity,
        unit,
        batch_number,
        growing_method
      }
    });

    // Buscar produto criado com associações
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        {
          model: User,
          as: 'producer',
          attributes: ['id', 'name', 'company_name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: createdProduct
    });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar produto',
      error: error.message
    });
  }
});

// PUT /api/v1/products/:id - Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        [Op.or]: [
          { id: req.params.id },
          { product_id: req.params.id }
        ]
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const updatedProduct = await product.update(req.body);

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar produto',
      error: error.message
    });
  }
});

// DELETE /api/v1/products/:id - Desativar produto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        [Op.or]: [
          { id: req.params.id },
          { product_id: req.params.id }
        ]
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    await product.update({ is_active: false });

    res.json({
      success: true,
      message: 'Produto desativado com sucesso'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao desativar produto',
      error: error.message
    });
  }
});

module.exports = router;
