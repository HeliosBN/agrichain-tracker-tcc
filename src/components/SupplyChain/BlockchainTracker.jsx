import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import MetaMaskConnect from '../Web3/MetaMaskConnect';
import web3Service from '../../services/web3Service';

const BlockchainTracker = () => {
  const [web3Connection, setWeb3Connection] = useState({
    isConnected: false,
    isCorrectNetwork: false,
    account: null,
    web3: null,
    isAuthorized: false
  });
  
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchProductId, setSearchProductId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [contractStats, setContractStats] = useState(null);
  const [error, setError] = useState('');

  const handleWeb3ConnectionChange = (connectionData) => {
    setWeb3Connection(connectionData);
  };

  // Carregar todos os produtos quando conectado
  useEffect(() => {
    const loadAllProducts = async () => {
      if (web3Connection.isConnected && web3Connection.isCorrectNetwork) {
        setLoading(true);
        setError('');
        
        try {
          const result = await web3Service.getAllProducts();
          if (result.success) {
            setProducts(result.products);
          } else {
            setError('Erro ao carregar produtos: ' + result.error);
          }

          // Carregar estatísticas
          const statsResult = await web3Service.getContractStats();
          if (statsResult.success) {
            setContractStats(statsResult.stats);
          }
        } catch (err) {
          setError('Erro ao conectar com a blockchain: ' + err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAllProducts();
  }, [web3Connection.isConnected, web3Connection.isCorrectNetwork]);

  const handleSearchProduct = async (e) => {
    e.preventDefault();
    if (!searchProductId.trim()) return;

    setSearchLoading(true);
    setSearchResult(null);
    setError('');

    try {
      const productResult = await web3Service.getProduct(searchProductId);
      
      if (productResult.success) {
        const eventsResult = await web3Service.getProductEvents(searchProductId);
        
        setSearchResult({
          product: productResult.product,
          events: eventsResult.success ? eventsResult.events : []
        });
      } else {
        setError('Produto não encontrado: ' + productResult.error);
      }
    } catch (err) {
      setError('Erro na busca: ' + err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getEventTypeIcon = (eventType) => {
    const icons = {
      harvest: 'bi-flower2',
      processing: 'bi-gear',
      transport: 'bi-truck',
      quality_check: 'bi-check-circle',
      sale: 'bi-cart-check',
      default: 'bi-circle'
    };
    return icons[eventType] || icons.default;
  };

  const getEventTypeColor = (eventType) => {
    const colors = {
      harvest: 'success',
      processing: 'primary',
      transport: 'warning',
      quality_check: 'info',
      sale: 'danger',
      default: 'secondary'
    };
    return colors[eventType] || colors.default;
  };

  if (!web3Connection.isConnected) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={8}>
            <MetaMaskConnect onConnectionChange={handleWeb3ConnectionChange} />
            <Alert variant="info" className="mt-4">
              <h5><i className="bi bi-info-circle me-2"></i>Blockchain Tracker</h5>
              <p className="mb-0">
                Conecte sua wallet MetaMask para visualizar produtos e transações registrados na blockchain Sepolia.
              </p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={12}>
          {/* MetaMask Connection */}
          <div className="mb-4">
            <MetaMaskConnect onConnectionChange={handleWeb3ConnectionChange} />
          </div>

          {/* Contract Statistics */}
          {contractStats && (
            <Card className="mb-4">
              <Card.Header>
                <h5><i className="bi bi-graph-up me-2"></i>Estatísticas da Blockchain</h5>
              </Card.Header>
              <Card.Body>
                <Row className="text-center">
                  <Col md={4}>
                    <div className="h3 text-primary">{contractStats.totalProducts}</div>
                    <div className="text-muted">Produtos Registrados</div>
                  </Col>
                  <Col md={4}>
                    <div className="h3 text-success">{contractStats.totalEvents}</div>
                    <div className="text-muted">Eventos da Cadeia</div>
                  </Col>
                  <Col md={4}>
                    <div className="h3 text-info">{contractStats.totalAuthorizedActors}</div>
                    <div className="text-muted">Atores Autorizados</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Search Product */}
          <Card className="mb-4">
            <Card.Header>
              <h5><i className="bi bi-search me-2"></i>Buscar Produto Específico</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearchProduct}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Digite o ID do produto (ex: AGRI-1703123456-ABC12)"
                    value={searchProductId}
                    onChange={(e) => setSearchProductId(e.target.value)}
                  />
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={searchLoading || !searchProductId.trim()}
                  >
                    {searchLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <i className="bi bi-search"></i>
                    )}
                  </Button>
                </InputGroup>
              </Form>

              {/* Search Result */}
              {searchResult && (
                <div className="mt-4">
                  <h6>Produto Encontrado:</h6>
                  <Card className="border-primary">
                    <Card.Body>
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>Nome:</strong> {searchResult.product.name}</p>
                          <p><strong>Categoria:</strong> {searchResult.product.category}</p>
                          <p><strong>Produtor:</strong> {searchResult.product.producer}</p>
                          <p><strong>Quantidade:</strong> {searchResult.product.quantity} {searchResult.product.unit}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Data Colheita:</strong> {formatDate(searchResult.product.harvestDate)}</p>
                          <p><strong>Qualidade:</strong> {searchResult.product.qualityGrade}</p>
                          <p><strong>Registrado em:</strong> {formatDate(searchResult.product.registeredAt)}</p>
                          <p><strong>Status:</strong> 
                            <Badge bg={searchResult.product.isActive ? 'success' : 'secondary'} className="ms-2">
                              {searchResult.product.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </p>
                        </div>
                      </div>

                      {/* Events Timeline */}
                      {searchResult.events.length > 0 && (
                        <div className="mt-3">
                          <h6>Histórico da Cadeia de Suprimentos:</h6>
                          <div className="timeline">
                            {searchResult.events.map((event, index) => (
                              <div key={index} className="d-flex mb-3">
                                <div className="me-3">
                                  <Badge bg={getEventTypeColor(event.eventType)}>
                                    <i className={getEventTypeIcon(event.eventType)}></i>
                                  </Badge>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="fw-bold">{event.eventType.toUpperCase()}</div>
                                  <div className="text-muted small">{formatDate(event.timestamp)}</div>
                                  <div>{event.description}</div>
                                  {event.actor && <div className="small text-muted">Por: {event.actor}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" className="mb-4">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}

          {/* All Products */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5><i className="bi bi-list-ul me-2"></i>Todos os Produtos na Blockchain</h5>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => window.location.reload()}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Atualizar
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <div className="mt-2">Carregando produtos da blockchain...</div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox display-4"></i>
                  <div className="mt-2">Nenhum produto encontrado na blockchain</div>
                </div>
              ) : (
                <Row>
                  {products.map((product, index) => (
                    <Col md={6} lg={4} key={index} className="mb-3">
                      <Card className="h-100 border-start border-primary border-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="mb-0">{product.name}</h6>
                            <Badge bg={product.isActive ? 'success' : 'secondary'}>
                              {product.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          
                          <p className="text-muted small mb-2">
                            <i className="bi bi-tag me-1"></i>
                            {product.category.toUpperCase()}
                          </p>
                          
                          <p className="mb-1">
                            <strong>Produtor:</strong> {product.producer}
                          </p>
                          
                          <p className="mb-1">
                            <strong>Quantidade:</strong> {product.quantity} {product.unit}
                          </p>
                          
                          <p className="mb-1">
                            <strong>Qualidade:</strong> {product.qualityGrade}
                          </p>
                          
                          <p className="text-muted small mb-2">
                            <i className="bi bi-calendar me-1"></i>
                            Colhido em: {formatDate(product.harvestDate)}
                          </p>
                          
                          <div className="mt-auto">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => {
                                setSearchProductId(product.productId);
                                handleSearchProduct({ preventDefault: () => {} });
                              }}
                            >
                              <i className="bi bi-eye me-1"></i>
                              Ver Detalhes
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BlockchainTracker;