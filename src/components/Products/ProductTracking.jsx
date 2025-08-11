import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  InputGroup
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductTracking = () => {
  const [productId, setProductId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Mock products for demonstration
  const mockProducts = [
    {
      id: '1001',
      name: 'Organic Tomatoes',
      producer: 'Green Valley Farm',
      status: 'In Transit',
      location: 'São Paulo, SP',
      harvestDate: '2025-08-05',
      category: 'Vegetables',
      certifications: ['Organic', 'Non-GMO']
    },
    {
      id: '1002',
      name: 'Premium Coffee Beans',
      producer: 'Mountain Peak Coffee',
      status: 'Delivered',
      location: 'Rio de Janeiro, RJ',
      harvestDate: '2025-08-01',
      category: 'Beverages',
      certifications: ['Fair Trade', 'Organic']
    },
    {
      id: '1003',
      name: 'Fresh Lettuce',
      producer: 'Sunrise Agriculture',
      status: 'Processed',
      location: 'Minas Gerais, MG',
      harvestDate: '2025-08-07',
      category: 'Vegetables',
      certifications: ['Organic']
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!productId.trim()) {
      setError('Please enter a Product ID');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock search logic
      const results = mockProducts.filter(product => 
        product.id.toLowerCase().includes(productId.toLowerCase()) ||
        product.name.toLowerCase().includes(productId.toLowerCase()) ||
        product.producer.toLowerCase().includes(productId.toLowerCase())
      );

      setSearchResults(results);

      if (results.length === 0) {
        setError('No products found matching your search criteria');
      }
    } catch (err) {
      setError('Failed to search products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Harvested': 'success',
      'Processed': 'primary',
      'In Transit': 'warning',
      'Delivered': 'info',
      'Distributed': 'secondary'
    };
    return colors[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2>
            <i className="bi bi-search me-2"></i>
            Track Products
          </h2>
          <p className="text-muted">
            Search for products using Product ID, name, or producer to view their supply chain journey
          </p>
        </Col>
      </Row>

      {/* Search Form */}
      <Row className="justify-content-center mb-4">
        <Col lg={8} xl={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <Form onSubmit={handleSearch}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Search Product
                  </Form.Label>
                  <InputGroup size="lg">
                    <Form.Control
                      type="text"
                      placeholder="Enter Product ID, name, or producer..."
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      disabled={loading}
                    />
                    <Button 
                      type="submit" 
                      variant="success"
                      disabled={loading || !productId.trim()}
                    >
                      {loading ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                        />
                      ) : (
                        <i className="bi bi-search"></i>
                      )}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    You can search by Product ID (e.g., 1001), product name, or producer name
                  </Form.Text>
                </Form.Group>
              </Form>

              {/* Quick Search Examples */}
              <div className="mt-3">
                <small className="text-muted d-block mb-2">Try these examples:</small>
                <div className="d-flex flex-wrap gap-2">
                  {['1001', '1002', 'tomatoes', 'coffee'].map((example) => (
                    <Button
                      key={example}
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setProductId(example)}
                      disabled={loading}
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="justify-content-center mb-4">
          <Col lg={8} xl={6}>
            <Alert variant="danger">
              <Alert.Heading className="h6">
                <i className="bi bi-exclamation-circle me-2"></i>
                Search Error
              </Alert.Heading>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Search Results */}
      {hasSearched && !loading && !error && searchResults.length === 0 && (
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="text-center">
              <Card.Body className="py-5">
                <i className="bi bi-search display-1 text-muted mb-3"></i>
                <h5>No Products Found</h5>
                <p className="text-muted mb-4">
                  No products match your search criteria. Try searching with different keywords.
                </p>
                <Button 
                  as={Link} 
                  to="/register-product" 
                  variant="success"
                >
                  Register New Product
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Results Grid */}
      {searchResults.length > 0 && (
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                Search Results ({searchResults.length} found)
              </h5>
            </div>
            
            <Row className="g-3">
              {searchResults.map((product) => (
                <Col key={product.id} lg={6} xl={4}>
                  <Card className="card-hover h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="fw-bold mb-1">{product.name}</h6>
                          <small className="text-muted">ID: #{product.id}</small>
                        </div>
                        <span 
                          className={`badge bg-${getStatusColor(product.status)}`}
                        >
                          {product.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-building me-2 text-muted"></i>
                          <small>{product.producer}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-geo-alt me-2 text-muted"></i>
                          <small>{product.location}</small>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-calendar me-2 text-muted"></i>
                          <small>Harvested: {formatDate(product.harvestDate)}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-tag me-2 text-muted"></i>
                          <small>{product.category}</small>
                        </div>
                      </div>

                      {/* Certifications */}
                      {product.certifications.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1">Certifications:</small>
                          <div className="d-flex flex-wrap gap-1">
                            {product.certifications.map((cert) => (
                              <span 
                                key={cert}
                                className="badge bg-success bg-opacity-10 text-success"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="d-grid">
                        <Button
                          as={Link}
                          to={`/supply-chain/${product.id}`}
                          variant="outline-primary"
                        >
                          <i className="bi bi-eye me-2"></i>
                          View Supply Chain
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}

      {/* Help Section */}
      <Row className="mt-5">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body className="text-center py-4">
              <h6 className="mb-3">Need Help?</h6>
              <Row className="g-3 justify-content-center">
                <Col md={4}>
                  <div className="d-flex flex-column align-items-center">
                    <i className="bi bi-question-circle display-6 text-primary mb-2"></i>
                    <h6>How to Track</h6>
                    <small className="text-muted">
                      Use the Product ID found on packaging or receipts
                    </small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex flex-column align-items-center">
                    <i className="bi bi-shield-check display-6 text-success mb-2"></i>
                    <h6>Verified Data</h6>
                    <small className="text-muted">
                      All information is stored on blockchain for transparency
                    </small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex flex-column align-items-center">
                    <i className="bi bi-clock-history display-6 text-info mb-2"></i>
                    <h6>Real-time Updates</h6>
                    <small className="text-muted">
                      Track products throughout their entire journey
                    </small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductTracking;
