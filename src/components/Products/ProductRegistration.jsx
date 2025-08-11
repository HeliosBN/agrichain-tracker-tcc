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
  Badge
} from 'react-bootstrap';
import { useSupplyChain } from '../../hooks/useSupplyChain';

const ProductRegistration = () => {
  const { registerProduct, loading, error, isConnected } = useSupplyChain();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    producer: '',
    farmLocation: '',
    harvestDate: '',
    quantity: '',
    unit: 'kg',
    certifications: [],
    description: '',
    treatments: ''
  });
  const [success, setSuccess] = useState(null);
  const [validated, setValidated] = useState(false);

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Legumes',
    'Dairy',
    'Meat',
    'Herbs & Spices',
    'Other'
  ];

  const certificationOptions = [
    'Organic',
    'Fair Trade',
    'Non-GMO',
    'Rainforest Alliance',
    'GLOBALGAP',
    'Sustainable'
  ];

  const units = ['kg', 'tons', 'boxes', 'bags', 'pieces'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCertificationChange = (certification) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(cert => cert !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setSuccess(null);
      const result = await registerProduct({
        ...formData,
        certifications: formData.certifications.join(', '),
        treatments: formData.treatments.split(',').map(t => t.trim()).filter(t => t)
      });

      setSuccess({
        productId: result.productId,
        transactionHash: result.transactionHash
      });

      // Reset form
      setFormData({
        name: '',
        category: '',
        producer: '',
        farmLocation: '',
        harvestDate: '',
        quantity: '',
        unit: 'kg',
        certifications: [],
        description: '',
        treatments: ''
      });
      setValidated(false);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Register New Product
              </h4>
              <small>Add a new agricultural product to the blockchain</small>
            </Card.Header>
            <Card.Body className="p-4">
              {!isConnected && (
                <Alert variant="warning" className="mb-4">
                  <Alert.Heading className="h6">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Wallet Connection Required
                  </Alert.Heading>
                  Please connect your wallet to register products on the blockchain.
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="mb-4">
                  <Alert.Heading className="h6">Registration Failed</Alert.Heading>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-4">
                  <Alert.Heading className="h6">
                    <i className="bi bi-check-circle me-2"></i>
                    Product Successfully Registered!
                  </Alert.Heading>
                  <p className="mb-2">
                    <strong>Product ID:</strong> <code>{success.productId}</code>
                  </p>
                  <p className="mb-0">
                    <strong>Transaction Hash:</strong>
                    <br />
                    <small className="font-monospace">{success.transactionHash}</small>
                  </p>
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="g-3">
                  {/* Product Name */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Product Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Organic Tomatoes"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a product name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Category */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select category...</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select a category.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Producer */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Producer/Farm Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="producer"
                        value={formData.producer}
                        onChange={handleInputChange}
                        placeholder="e.g., Green Valley Farm"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide the producer name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Farm Location */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Farm Location *</Form.Label>
                      <Form.Control
                        type="text"
                        name="farmLocation"
                        value={formData.farmLocation}
                        onChange={handleInputChange}
                        placeholder="e.g., São Paulo, SP, Brazil"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide the farm location.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Harvest Date */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Harvest Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="harvestDate"
                        value={formData.harvestDate}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide the harvest date.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Quantity and Unit */}
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Quantity *</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide the quantity.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Unit</Form.Label>
                      <Form.Select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Certifications */}
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Certifications</Form.Label>
                      <div className="mt-2">
                        {certificationOptions.map(certification => (
                          <Form.Check
                            key={certification}
                            inline
                            type="checkbox"
                            id={`cert-${certification}`}
                            label={certification}
                            checked={formData.certifications.includes(certification)}
                            onChange={() => handleCertificationChange(certification)}
                            className="me-3 mb-2"
                          />
                        ))}
                      </div>
                    </Form.Group>
                  </Col>

                  {/* Treatments */}
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Treatments Used</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="treatments"
                        value={formData.treatments}
                        onChange={handleInputChange}
                        placeholder="List any pesticides, fertilizers, or treatments used (comma-separated)"
                      />
                      <Form.Text className="text-muted">
                        Optional: List treatments, pesticides, or fertilizers used during cultivation
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  {/* Description */}
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Additional Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Any additional information about the product..."
                      />
                    </Form.Group>
                  </Col>

                  {/* Selected Certifications Display */}
                  {formData.certifications.length > 0 && (
                    <Col xs={12}>
                      <div>
                        <small className="text-muted">Selected certifications:</small>
                        <div className="mt-1">
                          {formData.certifications.map(cert => (
                            <Badge key={cert} bg="success" className="me-2">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Col>
                  )}

                  {/* Submit Button */}
                  <Col xs={12} className="pt-3">
                    <div className="d-grid">
                      <Button
                        type="submit"
                        variant="success"
                        size="lg"
                        disabled={loading || !isConnected}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              className="me-2"
                            />
                            Registering on Blockchain...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Register Product
                          </>
                        )}
                      </Button>
                    </div>
                    <Form.Text className="text-muted text-center d-block mt-2">
                      This action will create an immutable record on the blockchain
                    </Form.Text>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductRegistration;
