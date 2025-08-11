import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  InputGroup,
  Badge,
  Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ConsumerView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock featured products
  const featuredProducts = [
    {
      id: '1001',
      name: 'Organic Tomatoes',
      producer: 'Green Valley Farm',
      location: 'São Paulo, SP',
      certifications: ['Organic', 'Non-GMO'],
      image: '🍅',
      rating: 4.8,
      trustScore: 98
    },
    {
      id: '1002',
      name: 'Premium Coffee Beans',
      producer: 'Mountain Peak Coffee',
      location: 'Minas Gerais, MG',
      certifications: ['Fair Trade', 'Organic'],
      image: '☕',
      rating: 4.9,
      trustScore: 99
    },
    {
      id: '1003',
      name: 'Fresh Lettuce',
      producer: 'Sunrise Agriculture',
      location: 'Rio Grande do Sul, RS',
      certifications: ['Organic'],
      image: '🥬',
      rating: 4.7,
      trustScore: 95
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const results = featuredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.includes(searchTerm)
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 1000);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="d-flex align-items-center">
        {Array.from({ length: fullStars }, (_, index) => (
          <i key={index} className="bi bi-star-fill text-warning"></i>
        ))}
        {hasHalfStar && <i className="bi bi-star-half text-warning"></i>}
        {Array.from({ length: 5 - Math.ceil(rating) }, (_, index) => (
          <i key={index} className="bi bi-star text-warning"></i>
        ))}
        <span className="ms-2 small text-muted">({rating})</span>
      </div>
    );
  };

  const getTrustScoreColor = (score) => {
    if (score >= 95) return 'success';
    if (score >= 85) return 'primary';
    if (score >= 75) return 'warning';
    return 'danger';
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-5">
        <Col className="text-center">
          <h1 className="display-5 fw-bold mb-3">
            🌾 Know Your Food's Journey
          </h1>
          <p className="lead text-muted mb-4">
            Discover the complete story behind your agricultural products - from farm to table
          </p>
          
          {/* Search Form */}
          <Row className="justify-content-center">
            <Col lg={6} md={8}>
              <Form onSubmit={handleSearch}>
                <InputGroup size="lg" className="shadow-sm">
                  <Form.Control
                    type="text"
                    placeholder="Enter product code or scan QR code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-end-0"
                  />
                  <Button 
                    type="submit" 
                    variant="success"
                    disabled={isSearching || !searchTerm.trim()}
                  >
                    {isSearching ? (
                      <i className="bi bi-search"></i>
                    ) : (
                      <i className="bi bi-search"></i>
                    )}
                  </Button>
                </InputGroup>
              </Form>
              
              <div className="mt-3">
                <small className="text-muted">
                  Try: 1001, 1002, tomatoes, coffee
                </small>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Row className="mb-5">
          <Col>
            <h4 className="mb-3">Search Results</h4>
            <Row className="g-3">
              {searchResults.map((product) => (
                <Col key={product.id} lg={4} md={6}>
                  <Card className="card-hover h-100">
                    <Card.Body className="text-center">
                      <div className="display-1 mb-3">{product.image}</div>
                      <h5 className="fw-bold mb-2">{product.name}</h5>
                      <p className="text-muted mb-3">{product.producer}</p>
                      
                      <div className="mb-3">
                        {renderStars(product.rating)}
                      </div>
                      
                      <div className="mb-3">
                        <Badge 
                          bg={getTrustScoreColor(product.trustScore)}
                          className="fs-6"
                        >
                          Trust Score: {product.trustScore}%
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        {product.certifications.map(cert => (
                          <Badge key={cert} bg="success" className="me-1 mb-1">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button
                        as={Link}
                        to={`/supply-chain/${product.id}`}
                        variant="outline-primary"
                        className="w-100"
                      >
                        View Journey
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      )}

      {/* Features Section */}
      <Row className="mb-5">
        <Col>
          <h3 className="text-center mb-4">Why Trace Your Food?</h3>
          <Row className="g-4">
            <Col md={4}>
              <Card className="text-center border-0 h-100">
                <Card.Body>
                  <div className="display-4 text-success mb-3">🔍</div>
                  <h5>Full Transparency</h5>
                  <p className="text-muted">
                    See exactly where your food comes from, how it was grown, and its complete journey to your table.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="text-center border-0 h-100">
                <Card.Body>
                  <div className="display-4 text-primary mb-3">🛡️</div>
                  <h5>Verified Quality</h5>
                  <p className="text-muted">
                    All data is stored on blockchain, ensuring information authenticity and preventing fraud.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="text-center border-0 h-100">
                <Card.Body>
                  <div className="display-4 text-warning mb-3">🌱</div>
                  <h5>Sustainability</h5>
                  <p className="text-muted">
                    Support sustainable farming practices by choosing products with verified certifications.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Featured Products */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Featured Products</h3>
            <Button as={Link} to="/track-product" variant="outline-success">
              View All Products
            </Button>
          </div>
          
          <Row className="g-3">
            {featuredProducts.map((product) => (
              <Col key={product.id} lg={4} md={6}>
                <Card className="card-hover h-100">
                  <Card.Body>
                    <div className="d-flex align-items-start mb-3">
                      <div className="me-3" style={{ fontSize: '2rem' }}>
                        {product.image}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">{product.name}</h6>
                        <small className="text-muted">{product.producer}</small>
                        <br />
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {product.location}
                        </small>
                      </div>
                      <Badge 
                        bg={getTrustScoreColor(product.trustScore)}
                        className="ms-2"
                      >
                        {product.trustScore}%
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      {renderStars(product.rating)}
                    </div>
                    
                    <div className="mb-3">
                      {product.certifications.map(cert => (
                        <Badge key={cert} bg="success" className="me-1 mb-1">
                          <i className="bi bi-award me-1"></i>
                          {cert}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button
                      as={Link}
                      to={`/supply-chain/${product.id}`}
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                    >
                      <i className="bi bi-eye me-1"></i>
                      Trace This Product
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* How It Works */}
      <Row className="mb-5">
        <Col>
          <Card className="bg-light border-0">
            <Card.Body className="py-5">
              <h3 className="text-center mb-4">How It Works</h3>
              <Row className="g-4">
                <Col md={3} className="text-center">
                  <div className="display-1 text-primary mb-3">1️⃣</div>
                  <h5>Find Product Code</h5>
                  <p className="text-muted small">
                    Look for the QR code or product ID on packaging
                  </p>
                </Col>
                
                <Col md={3} className="text-center">
                  <div className="display-1 text-success mb-3">2️⃣</div>
                  <h5>Scan or Enter Code</h5>
                  <p className="text-muted small">
                    Use our search tool to enter the product code
                  </p>
                </Col>
                
                <Col md={3} className="text-center">
                  <div className="display-1 text-warning mb-3">3️⃣</div>
                  <h5>View Journey</h5>
                  <p className="text-muted small">
                    See the complete supply chain from farm to store
                  </p>
                </Col>
                
                <Col md={3} className="text-center">
                  <div className="display-1 text-info mb-3">4️⃣</div>
                  <h5>Make Informed Choices</h5>
                  <p className="text-muted small">
                    Choose products that align with your values
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Call to Action */}
      <Row>
        <Col className="text-center">
          <Alert variant="success" className="border-0 shadow-sm">
            <h5 className="alert-heading">
              <i className="bi bi-shield-check me-2"></i>
              Trust Through Transparency
            </h5>
            <p className="mb-3">
              Every product in our system has been verified through blockchain technology, 
              ensuring the information you see is authentic and tamper-proof.
            </p>
            <Button as={Link} to="/track-product" variant="success" size="lg">
              Start Tracking Your Food
            </Button>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default ConsumerView;
