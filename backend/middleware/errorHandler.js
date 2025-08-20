const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  console.error('Error:', err);

  // Erro de validação do Sequelize
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(error => error.message).join(', ');
    error = {
      message: `Erro de validação: ${message}`,
      statusCode: 400
    };
  }

  // Erro de constraint única do Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Recurso já existe';
    error = {
      message,
      statusCode: 400
    };
  }

  // Erro de FK constraint do Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Referência inválida';
    error = {
      message,
      statusCode: 400
    };
  }

  // Erro de conexão com DB
  if (err.name === 'SequelizeConnectionError') {
    const message = 'Erro de conexão com o banco de dados';
    error = {
      message,
      statusCode: 503
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = {
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = {
      message,
      statusCode: 401
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
