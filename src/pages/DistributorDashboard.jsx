import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Badge,
  Form,
  InputGroup,
  Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DistributorDashboard = () => {
  const [activeShipments, setActiveShipments] = useState([]);
  const [deliveredShipments, setDeliveredShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock data for distributor shipments
    setActiveShipments([
      {
        id: '1001',
        productName: 'Organic Tomatoes',
        producer: 'Green Valley Farm',
        destination: 'SuperMarket ABC',
        status: 'In Transit',
        estimatedDelivery: '2025-08-12',
        quantity: '500 kg',
        location: 'Highway BR-101, km 45',
        temperature: '4°C'
      },
      {
        id: '1003',
        productName: 'Fresh Lettuce',
        producer: 'Sunrise Agriculture',
        destination: 'Restaurant XYZ',
        status: 'At Distributor',
        estimatedDelivery: '2025-08-11',
        quantity: '200 kg',
        location: 'Distribution Center SP',
        temperature: '2°C'
      },
      {
        id: '1007',
        productName: 'Organic Apples',
        producer: 'Mountain Orchard',
        destination: 'Grocery Store 123',
        status: 'Loading',
        estimatedDelivery: '2025-08-13',
        quantity: '300 kg',
        location: 'Distribution Center SP',
        temperature: '1°C'
      }
    ]);

    setDeliveredShipments([
      {
        id: '1002',
        productName: 'Premium Coffee Beans',
        producer: 'Mountain Peak Coffee',
        destination: 'Coffee Shop Chain',
        status: 'Delivered',
        deliveryDate: '2025-08-09',
        quantity: '100 kg',
        rating: 5
      },
      {
        id: '1004',
        productName: 'Organic Corn',
        producer: 'Golden Fields',
        destination: 'Food Processing Plant',
        status: 'Delivered',
        deliveryDate: '2025-08-08',
        quantity: '800 kg',
        rating: 4
      }
    ]);
  }, []);

  const getStatusVariant = (status) => {
    const variants = {
      'Loading': 'info',
      'At Distributor': 'primary',
      'In Transit': 'warning',
      'Delivered': 'success',
      'Delayed': 'danger'
    };
    return variants[status] || 'secondary';
  };

  const getTemperatureColor = (temp) => {
    const tempValue = parseInt(temp);
    if (tempValue <= 2) return 'primary';
    if (tempValue <= 4) return 'success';
    if (tempValue <= 8) return 'warning';
    return 'danger';
  };

  const filteredShipments = activeShipments.filter(shipment => {
    const matchesSearch = shipment.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.id.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || shipment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
      ></i>
    ));
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
            <div>
              <h2>
                <i className="bi bi-truck me-2"></i>
                Distributor Dashboard
              </h2>
              <p className="text-muted mb-3 mb-md-0">
                Monitor and manage product distribution and logistics
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col lg={3} md={6}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-icon warning mx-auto">
                <i className="bi bi-truck"></i>
              </div>
              <h4 className="fw-bold text-warning mb-1">{activeShipments.length}</h4>
              <p className="text-muted mb-0">Active Shipments</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={3} md={6}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-icon success mx-auto">
                <i className="bi bi-check-circle"></i>
              </div>
              <h4 className="fw-bold text-success mb-1">{deliveredShipments.length}</h4>
              <p className="text-muted mb-0">Delivered Today</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-icon primary mx-auto">
                <i className="bi bi-thermometer-half"></i>
              </div>
              <h4 className="fw-bold text-primary mb-1">2°C</h4>
              <p className="text-muted mb-0">Avg Temperature</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-icon info mx-auto">
                <i className="bi bi-clock"></i>
              </div>
              <h4 className="fw-bold text-info mb-1">98%</h4>
              <p className="text-muted mb-0">On-Time Delivery</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Active Shipments */}
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                <i className="bi bi-truck me-2"></i>
                Active Shipments
              </h5>
            </Col>
            <Col md="auto">
              <Row className="g-2">
                <Col xs="auto">
                  <InputGroup size="sm">
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search shipments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col xs="auto">
                  <Form.Select
                    size="sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Loading">Loading</option>
                    <option value="At Distributor">At Distributor</option>
                    <option value="In Transit">In Transit</option>
                  </Form.Select>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Shipment ID</th>
                  <th>Product</th>
                  <th className="d-none d-md-table-cell">Producer</th>
                  <th className="d-none d-lg-table-cell">Destination</th>
                  <th>Status</th>
                  <th className="d-none d-xl-table-cell">Temperature</th>
                  <th className="d-none d-lg-table-cell">ETA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>
                      <code className="text-primary">#{shipment.id}</code>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">{shipment.productName}</div>
                        <small className="text-muted">{shipment.quantity}</small>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <small>{shipment.producer}</small>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <small>{shipment.destination}</small>
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(shipment.status)}>
                        {shipment.status}
                      </Badge>
                    </td>
                    <td className="d-none d-xl-table-cell">
                      <Badge bg={getTemperatureColor(shipment.temperature)}>
                        {shipment.temperature}
                      </Badge>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <small>{new Date(shipment.estimatedDelivery).toLocaleDateString('pt-BR')}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          as={Link}
                          to={`/supply-chain/${shipment.id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          <i className="bi bi-eye"></i>
                          <span className="d-none d-xl-inline ms-1">Track</span>
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => alert('Update delivery status')}
                        >
                          <i className="bi bi-pencil"></i>
                          <span className="d-none d-xl-inline ms-1">Update</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          
          {filteredShipments.length === 0 && (
            <div className="text-center py-4">
              <i className="bi bi-search display-4 text-muted mb-3"></i>
              <h6>No shipments found</h6>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Recent Deliveries */}
      <Card>
        <Card.Header className="bg-white">
          <h5 className="mb-0">
            <i className="bi bi-check-circle me-2"></i>
            Recent Deliveries
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Delivery ID</th>
                  <th>Product</th>
                  <th className="d-none d-md-table-cell">Producer</th>
                  <th className="d-none d-lg-table-cell">Destination</th>
                  <th>Delivery Date</th>
                  <th className="d-none d-xl-table-cell">Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveredShipments.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>
                      <code className="text-success">#{delivery.id}</code>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">{delivery.productName}</div>
                        <small className="text-muted">{delivery.quantity}</small>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <small>{delivery.producer}</small>
                    </td>
                    <td className="d-none d-lg-table-cell">
                      <small>{delivery.destination}</small>
                    </td>
                    <td>
                      <small>{new Date(delivery.deliveryDate).toLocaleDateString('pt-BR')}</small>
                    </td>
                    <td className="d-none d-xl-table-cell">
                      <div className="d-flex align-items-center">
                        {renderStars(delivery.rating)}
                        <small className="ms-1 text-muted">({delivery.rating}/5)</small>
                      </div>
                    </td>
                    <td>
                      <Button
                        as={Link}
                        to={`/supply-chain/${delivery.id}`}
                        variant="outline-secondary"
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

      {/* Temperature Alert */}
      <Alert variant="info" className="mt-4">
        <div className="d-flex align-items-center">
          <i className="bi bi-thermometer-half me-2"></i>
          <div>
            <strong>Temperature Monitoring Active</strong>
            <div className="small">All shipments are being monitored for optimal temperature conditions. Critical alerts will be sent immediately.</div>
          </div>
        </div>
      </Alert>
    </Container>
  );
};

export default DistributorDashboard;
