const notFound = (req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
    availableRoutes: {
      '/': 'GET - Informações da API',
      '/health': 'GET - Status da aplicação',
      '/api/v1/products': 'GET, POST - Gerenciar produtos',
      '/api/v1/users': 'GET, POST - Gerenciar usuários',
      '/api/v1/supply-chain': 'GET, POST - Cadeia de suprimentos',
      '/api/v1/analytics': 'GET - Analytics e relatórios'
    }
  });
};

module.exports = notFound;
