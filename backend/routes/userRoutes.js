const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Gerar JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// GET /api/v1/users - Listar usuários
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      is_verified
    } = req.query;

    const offset = (page - 1) * limit;
    
    let whereClause = { is_active: true };
    
    if (role) {
      whereClause.role = role;
    }
    
    if (is_verified !== undefined) {
      whereClause.is_verified = is_verified === 'true';
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { company_name: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password_hash'] },
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
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários',
      error: error.message
    });
  }
});

// GET /api/v1/users/:id - Buscar usuário específico
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário',
      error: error.message
    });
  }
});

// POST /api/v1/users/register - Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      company_name,
      certification_number
    } = req.body;

    // Validações básicas
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: name, email, password, role'
      });
    }

    // Verificar se email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }

    // Hash da senha
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role,
      phone,
      address: address || {},
      company_name,
      certification_number
    });

    // Gerar token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company_name: user.company_name
      },
      token
    });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário',
      error: error.message
    });
  }
});

// POST /api/v1/users/login - Login do usuário
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = await User.findOne({ 
      where: { 
        email
      } 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar senha (validação simples para dados de teste)
    const isValidPassword = user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Atualizar último login
    await user.update({ last_login: new Date() });

    // Gerar token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company_name: user.company_name,
        is_verified: user.is_verified
      },
      token
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
      error: error.message
    });
  }
});

// PUT /api/v1/users/:id - Atualizar usuário
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Se está atualizando senha, fazer hash
    if (req.body.password) {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    const updatedUser = await user.update(req.body);

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        company_name: updatedUser.company_name
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário',
      error: error.message
    });
  }
});

// DELETE /api/v1/users/:id - Desativar usuário
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    await user.update({ is_active: false });

    res.json({
      success: true,
      message: 'Usuário desativado com sucesso'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao desativar usuário',
      error: error.message
    });
  }
});

module.exports = router;
