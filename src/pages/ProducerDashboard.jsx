import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Badge,
  Modal,
  Form,
  Alert
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSupplyChain } from '../hooks/useSupplyChain';

const ProducerDashboard = () => {
  const { isConnected, updateProductStatus, loading } = useSupplyChain();
  const [myProducts, setMyProducts] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    // Mock data for producer's products
    setMyProducts([
      {
        id: '1001',
        name: 'Organic Tomatoes',
        category: 'Vegetables',
        quantity: '500 kg',
        harvestDate: '2025-08-05',
        status: 'Harvested',
        certifications: ['Organic', 'Non-GMO'],
        location: 'Green Valley Farm, SP'
      },
      {
        id: '1005',
        name: 'Fresh Carrots',
        category: 'Vegetables',
        quantity: '300 kg',
        harvestDate: '2025-08-07',
        status: 'Processed',
        certifications: ['Organic'],
        location: 'Processing Center, SP'
      },
      {
        id: '1006',
        name: 'Sweet Corn',
        category: 'Grains',
        quantity: '800 kg',
        harvestDate: '2025-08-03',
        status: 'In Transit',
        certifications: ['Non-GMO'],
        location: 'Distribution Hub, RJ'
      }
    ]);
  }, []);

  const handleUpdateStatus = (product) => {
    setSelectedProduct(product);
    setNewStatus(product.status);
    setLocation(product.location);
    setShowUpdateModal(true);
  };

  const submitStatusUpdate = async () => {
    try {
      await updateProductStatus(selectedProduct.id, newStatus, location);
      
      // Update local state
      setMyProducts(prev => 
        prev.map(product => 
          product.id === selectedProduct.id 
            ? { ...product, status: newStatus, location }
            : product
        )
      );
      
      setShowUpdateModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      'Harvested': 'success',
      'Processed': 'primary',
      'In Transit': 'warning',
      'Delivered': 'info'
    };
    return variants[status] || 'secondary';
  };

  const statusOptions = [
    'Harvested',
    'Processed',
    'In Transit',
    'At Distributor',
    'Delivered'
  ];

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
            <div>
              <h2>
                <i className="bi bi-person-workspace me-2"></i>
                Producer Dashboard
              </h2>
              <p className="text-muted mb-3 mb-md-0">
                Manage your agricultural products and track their journey
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button as={Link} to="/register-product" variant="success">
                <i className="bi bi-plus-circle me-1"></i>
                Add Product
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={3} sm={6}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-icon success mx-auto">
                <i className="bi bi-box-seam"></i>
              </div>
              <h4 className="fw-bold text-success mb-1">{myProducts.length}</h4>
              <p className="text-muted mb-0">Total Products</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-icon warning mx-auto">
                <i className="bi bi-truck"></i>
              </div>
              <h4 className="fw-bold text-warning mb-1">
                {myProducts.filter(p => p.status === 'In Transit').length}
              </h4>
              <p className="text-muted mb-0">In Transit</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-icon info mx-auto">
                <i className="bi bi-check-circle"></i>
              </div>
              <h4 className="fw-bold text-info mb-1">
                {myProducts.filter(p => p.status === 'Delivered').length}
              </h4>
              <p className="text-muted mb-0">Delivered</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6}>
          <Card className="stats-card text-center">
            <Card.Body>
              <div className="stats-icon primary mx-auto">
                <i className="bi bi-award"></i>
              </div>
              <h4 className="fw-bold text-primary mb-1">
                {myProducts.filter(p => p.certifications.includes('Organic')).length}
              </h4>
              <p className="text-muted mb-0">Organic Certified</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Connection Alert */}
      {!isConnected && (
        <Alert variant="warning" className="mb-4">
          <Alert.Heading className="h6">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Wallet Connection Required
          </Alert.Heading>
          Connect your wallet to update product status on the blockchain.
        </Alert>
      )}

      {/* Products Table */}
      <Card>
        <Card.Header className="bg-white">
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            My Products
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th className="d-none d-md-table-cell">Category</th>
                  <th className="d-none d-lg-table-cell">Quantity</th>
                  <th>Status</th>
                  <th className="d-none d-xl-table-cell">Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <code className="text-primary">#{product.id}</code>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold">{product.name}</div>
                        <div className="d-md-none">
                          <small className="text-muted">{product.category}</small>
                        </div>
                        {product.certifications.length > 0 && (
                          <div className="mt-1">
                            {product.certifications.slice(0, 2).map(cert => (
                              <Badge key={cert} bg="success" className="me-1" style={{ fontSize: '0.7rem' }}>
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">
                      {product.category}
                    </td>
                    <td className="d-none d-lg-table-cell">
                      {product.quantity}
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(product.status)}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="d-none d-xl-table-cell">
                      <small>{product.location}</small>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleUpdateStatus(product)}
                          disabled={!isConnected}
                        >
                          <i className="bi bi-pencil"></i>
                          <span className="d-none d-lg-inline ms-1">Update</span>
                        </Button>
                        <Button
                          as={Link}
                          to={`/supply-chain/${product.id}`}
                          variant="outline-secondary"
                          size="sm"
                        >
                          <i className="bi bi-eye"></i>
                          <span className="d-none d-lg-inline ms-1">View</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Update Status Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Product Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="mb-3">
                <h6>{selectedProduct.name}</h6>
                <small className="text-muted">Product ID: #{selectedProduct.id}</small>
              </div>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Current Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter current location"
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={submitStatusUpdate}
            disabled={loading || !newStatus || !location}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProducerDashboard;
