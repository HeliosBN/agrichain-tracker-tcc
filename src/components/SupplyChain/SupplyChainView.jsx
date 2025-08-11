import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Badge, 
  Button, 
  Spinner,
  Alert,
  Table
} from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useSupplyChain } from '../../hooks/useSupplyChain';

const SupplyChainView = () => {
  const { productId } = useParams();
  const { getProductHistory, loading, error } = useSupplyChain();
  const [product, setProduct] = useState(null);
  const [supplyChainHistory, setSupplyChainHistory] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Mock product data
        const mockProduct = {
          id: productId,
          name: 'Organic Tomatoes',
          producer: 'Green Valley Farm',
          category: 'Vegetables',
          harvestDate: '2025-08-05',
          quantity: '500 kg',
          currentStatus: 'In Transit',
          currentLocation: 'São Paulo, SP',
          certifications: ['Organic', 'Non-GMO', 'Fair Trade'],
          description: 'Fresh organic tomatoes grown using sustainable farming practices',
          qrCode: `https://agrichain-tracker.com/track/${productId}`
        };

        setProduct(mockProduct);

        // Fetch supply chain history
        const history = await getProductHistory(productId);
        setSupplyChainHistory(history);
      } catch (err) {
        console.error('Failed to fetch product data:', err);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId, getProductHistory]);

  const getStatusColor = (status) => {
    const colors = {
      'Harvested': 'success',
      'Processed': 'primary',
      'In Transit': 'warning',
      'At Distributor': 'info',
      'Delivered': 'success',
      'Sold': 'secondary'
    };
    return colors[status] || 'secondary';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStepIcon = (action) => {
    const icons = {
      'Harvested': 'bi-scissors',
      'Processed': 'bi-gear',
      'In Transit': 'bi-truck',
      'At Distributor': 'bi-building',
      'Delivered': 'bi-check-circle',
      'Sold': 'bi-cart-check'
    };
    return icons[action] || 'bi-circle';
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="success" className="mb-3" />
          <h5>Loading supply chain data...</h5>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error Loading Product</Alert.Heading>
          {error}
          <hr />
          <Button as={Link} to="/track-product" variant="outline-danger">
            Back to Search
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          <Alert.Heading>Product Not Found</Alert.Heading>
          No product found with ID: {productId}
          <hr />
          <Button as={Link} to="/track-product" variant="outline-warning">
            Back to Search
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header with Navigation */}
      <Row className="mb-4">
        <Col>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/track-product" className="text-decoration-none">Track Products</Link>
              </li>
              <li className="breadcrumb-item active">Product #{productId}</li>
            </ol>
          </nav>
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
            <div>
              <h2 className="mb-2">
                <i className="bi bi-box-seam me-2"></i>
                {product.name}
              </h2>
              <p className="text-muted mb-0">
                Product ID: <code>#{product.id}</code>
              </p>
            </div>
            <Badge 
              bg={getStatusColor(product.currentStatus)} 
              className="fs-6 mt-2 mt-md-0"
            >
              {product.currentStatus}
            </Badge>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Product Information */}
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Product Details
              </h5>
            </Card.Header>
            <Card.Body>
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td className="fw-semibold text-muted">Producer:</td>
                    <td>{product.producer}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">Category:</td>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">Harvest Date:</td>
                    <td>{new Date(product.harvestDate).toLocaleDateString('pt-BR')}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">Quantity:</td>
                    <td>{product.quantity}</td>
                  </tr>
                  <tr>
                    <td className="fw-semibold text-muted">Current Location:</td>
                    <td>{product.currentLocation}</td>
                  </tr>
                </tbody>
              </Table>

              {/* Certifications */}
              {product.certifications.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-muted mb-2">Certifications:</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {product.certifications.map((cert) => (
                      <Badge key={cert} bg="success" className="mb-1">
                        <i className="bi bi-award me-1"></i>
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="mt-3">
                  <h6 className="text-muted mb-2">Description:</h6>
                  <p className="small mb-0">{product.description}</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* QR Code Section */}
          <Card className="mt-3">
            <Card.Header className="bg-light">
              <h6 className="mb-0">
                <i className="bi bi-qr-code me-2"></i>
                Share Product
              </h6>
            </Card.Header>
            <Card.Body className="text-center">
              <div className="qr-container mb-3">
                <div 
                  className="bg-light border rounded d-flex align-items-center justify-content-center"
                  style={{ height: '120px' }}
                >
                  <i className="bi bi-qr-code display-4 text-muted"></i>
                </div>
              </div>
              <small className="text-muted d-block mb-2">
                Scan to view this product's supply chain
              </small>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => navigator.clipboard.writeText(product.qrCode)}
              >
                <i className="bi bi-clipboard me-1"></i>
                Copy Link
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Supply Chain Timeline */}
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Supply Chain Journey
              </h5>
            </Card.Header>
            <Card.Body>
              {supplyChainHistory.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-clock-history display-4 text-muted mb-3"></i>
                  <h6>No history available</h6>
                  <p className="text-muted">Supply chain data is being recorded...</p>
                </div>
              ) : (
                <div className="timeline">
                  {supplyChainHistory.map((step, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <Card className="border-0 shadow-sm">
                        <Card.Body className="p-3">
                          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-2">
                                <i className={`bi ${getStepIcon(step.action)} me-2 text-${getStatusColor(step.action)}`}></i>
                                <h6 className="mb-0 fw-bold">{step.action}</h6>
                                <Badge 
                                  bg={getStatusColor(step.action)} 
                                  className="ms-2"
                                >
                                  {step.role}
                                </Badge>
                              </div>
                              
                              <div className="row g-2 small text-muted">
                                <div className="col-sm-6">
                                  <i className="bi bi-geo-alt me-1"></i>
                                  {step.location}
                                </div>
                                <div className="col-sm-6">
                                  <i className="bi bi-calendar me-1"></i>
                                  {formatDate(step.timestamp)}
                                </div>
                                <div className="col-12">
                                  <i className="bi bi-wallet2 me-1"></i>
                                  <code className="small">{step.address}</code>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row className="mt-4">
        <Col>
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <Button as={Link} to="/track-product" variant="outline-secondary">
              <i className="bi bi-arrow-left me-1"></i>
              Back to Search
            </Button>
            <Button 
              variant="success"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-1"></i>
              Print Report
            </Button>
            <Button 
              variant="primary"
              onClick={() => navigator.share?.({ 
                title: product.name, 
                url: window.location.href 
              }) || navigator.clipboard.writeText(window.location.href)}
            >
              <i className="bi bi-share me-1"></i>
              Share
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SupplyChainView;
