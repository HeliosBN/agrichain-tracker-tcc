import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Removendo o hook problemático e usando estados locais
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeShipments: 0,
    completedDeliveries: 0,
    verifiedSuppliers: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // Mock data for demonstration
    setStats({
      totalProducts: 1247,
      activeShipments: 89,
      completedDeliveries: 1158,
      verifiedSuppliers: 342
    });

    setRecentProducts([
      {
        id: '1001',
        name: 'Organic Tomatoes',
        producer: 'Green Valley Farm',
        status: 'In Transit',
        timestamp: '2025-08-09T10:30:00Z',
        location: 'São Paulo, SP'
      },
      {
        id: '1002',
        name: 'Premium Coffee Beans',
        producer: 'Mountain Peak Coffee',
        status: 'Delivered',
        timestamp: '2025-08-09T08:15:00Z',
        location: 'Rio de Janeiro, RJ'
      },
      {
        id: '1003',
        name: 'Fresh Lettuce',
        producer: 'Sunrise Agriculture',
        status: 'Processed',
        timestamp: '2025-08-09T06:45:00Z',
        location: 'Minas Gerais, MG'
      },
      {
        id: '1004',
        name: 'Organic Corn',
        producer: 'Golden Fields',
        status: 'Harvested',
        timestamp: '2025-08-08T16:20:00Z',
        location: 'Goiás, GO'
      }
    ]);
  }, []);

  const getStatusVariant = (status) => {
    const variants = {
      'Harvested': 'success',
      'Processed': 'primary',
      'In Transit': 'warning',
      'Delivered': 'info',
      'Distributed': 'secondary'
    };
    return variants[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="success" className="mb-3" />
          <h5>Loading Dashboard...</h5>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div>
              <h1 className="h2 mb-2">🌾 Agricultural Supply Chain Dashboard</h1>
              <p className="text-muted mb-3 mb-md-0">
                Real-time tracking and transparency for agricultural products
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button as={Link} to="/register-product" variant="success">
                <i className="bi bi-plus-circle me-1"></i>
                Register Product
              </Button>
              <Button as={Link} to="/track-product" variant="outline-success">
                <i className="bi bi-search me-1"></i>
                Track Product
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Connection Status Alert */}
      {!isConnected && (
        <Row className="mb-4">
          <Col>
            <Card className="border-warning">
              <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="d-flex align-items-center mb-2 mb-md-0">
                  <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                  <span>Wallet not connected. Connect your wallet to access full functionality.</span>
                </div>
                <Button variant="warning" size="sm">
                  Connect Wallet
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4 g-3">
        <Col lg={3} md={6}>
          <Card className="stats-card card-hover h-100">
            <Card.Body className="text-center">
              <div className="stats-icon success mx-auto">
                <i className="bi bi-box-seam"></i>
              </div>
              <h3 className="fw-bold text-success mb-1">{stats.totalProducts.toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Products</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stats-card card-hover h-100">
            <Card.Body className="text-center">
              <div className="stats-icon warning mx-auto">
                <i className="bi bi-truck"></i>
              </div>
              <h3 className="fw-bold text-warning mb-1">{stats.activeShipments}</h3>
              <p className="text-muted mb-0">Active Shipments</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stats-card card-hover h-100">
            <Card.Body className="text-center">
              <div className="stats-icon primary mx-auto">
                <i className="bi bi-check-circle"></i>
              </div>
              <h3 className="fw-bold text-primary mb-1">{stats.completedDeliveries.toLocaleString()}</h3>
              <p className="text-muted mb-0">Completed Deliveries</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stats-card card-hover h-100">
            <Card.Body className="text-center">
              <div className="stats-icon info mx-auto">
                <i className="bi bi-shield-check"></i>
              </div>
              <h3 className="fw-bold text-info mb-1">{stats.verifiedSuppliers}</h3>
              <p className="text-muted mb-0">Verified Suppliers</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity and Quick Actions */}
      <Row className="g-4">
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Recent Products
                </h5>
                <Button as={Link} to="/track-product" variant="outline-success" size="sm">
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th className="d-none d-md-table-cell">Producer</th>
                      <th>Status</th>
                      <th className="d-none d-lg-table-cell">Last Update</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <code className="text-primary">#{product.id}</code>
                        </td>
                        <td>
                          <div>
                            <div className="fw-semibold">{product.name}</div>
                            <small className="text-muted d-md-none">{product.producer}</small>
                          </div>
                        </td>
                        <td className="d-none d-md-table-cell">
                          <small>{product.producer}</small>
                        </td>
                        <td>
                          <Badge bg={getStatusVariant(product.status)}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="d-none d-lg-table-cell">
                          <small className="text-muted">
                            {formatDate(product.timestamp)}
                          </small>
                        </td>
                        <td>
                          <Button
                            as={Link}
                            to={`/supply-chain/${product.id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            <i className="bi bi-eye"></i>
                            <span className="d-none d-xl-inline ms-1">View</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="h-100">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-lightning-charge me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                <Button
                  as={Link}
                  to="/register-product"
                  variant="success"
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Register New Product
                </Button>

                <Button
                  as={Link}
                  to="/track-product"
                  variant="outline-primary"
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-search me-2"></i>
                  Track Existing Product
                </Button>

                <Button
                  as={Link}
                  to="/producer-dashboard"
                  variant="outline-success"
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-person-workspace me-2"></i>
                  Producer Dashboard
                </Button>

                <Button
                  as={Link}
                  to="/distributor-dashboard"
                  variant="outline-warning"
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-truck me-2"></i>
                  Distributor Dashboard
                </Button>

                <Button
                  as={Link}
                  to="/consumer-view"
                  variant="outline-info"
                  className="d-flex align-items-center justify-content-center"
                >
                  <i className="bi bi-person-check me-2"></i>
                  Consumer Portal
                </Button>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <h6 className="text-muted">System Status</h6>
                <div className="d-flex justify-content-center align-items-center">
                  <Badge bg="success" className="me-2">
                    <i className="bi bi-circle-fill"></i>
                  </Badge>
                  <span className="text-success fw-semibold">All Systems Operational</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
