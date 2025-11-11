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
  Badge,
  InputGroup
} from 'react-bootstrap';

const ProductUpdate = () => {
  const [formData, setFormData] = useState({
    productId: '',
    distributorName: '',
    distributorCpf: '',
    receivedDate: '',
    forwardedDate: '',
    location: '',
    vehicleInfo: '',
    storageConditions: '',
    qualityNotes: '',
    nextDestination: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validated, setValidated] = useState(false);
  const [productFound, setProductFound] = useState(null);

  // Simular busca de produto por ID
  const searchProduct = async (productId) => {
    if (!productId.trim()) return;
    
    setLoading(true);
    try {
      // Simulação de busca - em produção viria da blockchain/API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProduct = {
        id: productId,
        name: 'Tomates Orgânicos',
        category: 'Vegetables',
        producer: 'Fazenda Verde - João Silva',
        farmLocation: 'Holambra, SP',
        harvestDate: '2024-03-15',
        expiryDate: '2024-04-15',
        quantity: '500',
        unit: 'kg'
      };
      
      setProductFound(mockProduct);
      setError(null);
    } catch (err) {
      setError('Produto não encontrado');
      setProductFound(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCpf = (value) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (digits.length <= 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const handleCpfChange = (e) => {
    const formattedValue = formatCpf(e.target.value);
    setFormData(prev => ({
      ...prev,
      distributorCpf: formattedValue
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

    setLoading(true);
    setError(null);

    try {
      // Simulação de envio para blockchain
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Dados de atualização enviados:', {
        ...formData,
        timestamp: new Date().toISOString(),
        blockchainTxHash: `0x${Math.random().toString(16).substr(2, 8)}`
      });

      setSuccess('Produto atualizado com sucesso na blockchain!');
      setFormData({
        productId: '',
        distributorName: '',
        distributorCpf: '',
        receivedDate: '',
        forwardedDate: '',
        location: '',
        vehicleInfo: '',
        storageConditions: '',
        qualityNotes: '',
        nextDestination: ''
      });
      setProductFound(null);
      setValidated(false);
      
    } catch (error) {
      setError('Erro ao atualizar produto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-warning text-dark">
              <h4 className="mb-0">
                <i className="bi bi-arrow-repeat me-2"></i>
                Atualizar Produto na Cadeia
              </h4>
              <small className="text-muted">
                Para distribuidores e varejistas
              </small>
            </Card.Header>
            
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </Alert>
              )}

              {/* Busca de Produto */}
              <Card className="mb-4 border-primary">
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0">1. Buscar Produto</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>ID do Produto</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="productId"
                        value={formData.productId}
                        onChange={handleInputChange}
                        placeholder="Digite o ID do produto (ex: PROD-2024-001)"
                        disabled={loading}
                      />
                      <Button 
                        variant="primary" 
                        onClick={() => searchProduct(formData.productId)}
                        disabled={loading || !formData.productId.trim()}
                      >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Buscar'}
                      </Button>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Insira o ID do produto para verificar suas informações
                    </Form.Text>
                  </Form.Group>

                  {productFound && (
                    <Alert variant="info">
                      <h6>Produto Encontrado:</h6>
                      <strong>{productFound.name}</strong><br />
                      <Row className="mt-2">
                        <Col md={6}>
                          <small>
                            <strong>Categoria:</strong> {productFound.category}<br />
                            <strong>Produtor:</strong> {productFound.producer}<br />
                            <strong>Quantidade:</strong> {productFound.quantity} {productFound.unit}
                          </small>
                        </Col>
                        <Col md={6}>
                          <small>
                            <strong>Colheita:</strong> {new Date(productFound.harvestDate).toLocaleDateString('pt-BR')}<br />
                            <strong>Validade:</strong> {new Date(productFound.expiryDate).toLocaleDateString('pt-BR')}
                          </small>
                        </Col>
                      </Row>
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              {/* Formulário de Atualização */}
              {productFound && (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Card className="mb-4 border-warning">
                    <Card.Header className="bg-warning text-dark">
                      <h6 className="mb-0">2. Informações do Distribuidor/Varejista</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Nome do Distribuidor/Varejista *</Form.Label>
                            <Form.Control
                              type="text"
                              name="distributorName"
                              value={formData.distributorName}
                              onChange={handleInputChange}
                              placeholder="Nome da empresa ou pessoa"
                              required
                              disabled={loading}
                            />
                            <Form.Control.Feedback type="invalid">
                              Por favor, informe o nome do distribuidor/varejista.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>CPF do Responsável *</Form.Label>
                            <Form.Control
                              type="text"
                              name="distributorCpf"
                              value={formData.distributorCpf}
                              onChange={handleCpfChange}
                              placeholder="000.000.000-00"
                              maxLength={14}
                              required
                              disabled={loading}
                            />
                            <Form.Control.Feedback type="invalid">
                              Por favor, informe um CPF válido.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="mb-4 border-info">
                    <Card.Header className="bg-info text-white">
                      <h6 className="mb-0">3. Informações de Movimentação</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Data de Recebimento *</Form.Label>
                            <Form.Control
                              type="datetime-local"
                              name="receivedDate"
                              value={formData.receivedDate}
                              onChange={handleInputChange}
                              required
                              disabled={loading}
                            />
                            <Form.Control.Feedback type="invalid">
                              Por favor, informe a data de recebimento.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Data de Repasse</Form.Label>
                            <Form.Control
                              type="datetime-local"
                              name="forwardedDate"
                              value={formData.forwardedDate}
                              onChange={handleInputChange}
                              disabled={loading}
                            />
                            <Form.Text className="text-muted">
                              Deixe em branco se ainda não foi repassado
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Localização Atual *</Form.Label>
                            <Form.Control
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              placeholder="Cidade, Estado (ex: São Paulo, SP)"
                              required
                              disabled={loading}
                            />
                            <Form.Control.Feedback type="invalid">
                              Por favor, informe a localização atual.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Próximo Destino</Form.Label>
                            <Form.Control
                              type="text"
                              name="nextDestination"
                              value={formData.nextDestination}
                              onChange={handleInputChange}
                              placeholder="Para onde será enviado"
                              disabled={loading}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="mb-4 border-secondary">
                    <Card.Header className="bg-secondary text-white">
                      <h6 className="mb-0">4. Informações Adicionais</h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Informações do Veículo</Form.Label>
                            <Form.Control
                              type="text"
                              name="vehicleInfo"
                              value={formData.vehicleInfo}
                              onChange={handleInputChange}
                              placeholder="Placa, tipo de veículo"
                              disabled={loading}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Condições de Armazenamento</Form.Label>
                            <Form.Control
                              type="text"
                              name="storageConditions"
                              value={formData.storageConditions}
                              onChange={handleInputChange}
                              placeholder="Refrigerado, temperatura ambiente, etc."
                              disabled={loading}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Observações de Qualidade</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="qualityNotes"
                          value={formData.qualityNotes}
                          onChange={handleInputChange}
                          placeholder="Observações sobre o estado do produto, qualidade, etc."
                          disabled={loading}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>

                  <div className="d-grid gap-2">
                    <Button 
                      type="submit" 
                      variant="warning" 
                      size="lg"
                      disabled={loading}
                      className="text-dark"
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Atualizando na Blockchain...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cloud-upload me-2"></i>
                          Atualizar Produto na Blockchain
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              )}
              
              {!productFound && (
                <Alert variant="info" className="text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  Digite o ID do produto acima para começar a atualização
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductUpdate;