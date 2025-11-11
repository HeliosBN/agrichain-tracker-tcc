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
  Modal
} from 'react-bootstrap';
import { useSupplyChain } from '../../hooks/useSupplyChain';
import MetaMaskConnect from '../Web3/MetaMaskConnect';
import web3Service from '../../services/web3Service';

const ProductRegistration = () => {
  const { registerProduct, loading, error, isConnected } = useSupplyChain();
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables',
    producer: '',
    farmLocation: '',
    harvestDate: '',
    quantity: '',
    unit: 'kg',
    certifications: [],
    description: '',
    treatments: '',
    batchNumber: '',
    qualityGrade: 'A',
    expiryDate: ''
  });
  const [success, setSuccess] = useState(null);
  const [validated, setValidated] = useState(false);
  const [web3Connection, setWeb3Connection] = useState({
    isConnected: false,
    isCorrectNetwork: false,
    account: null,
    web3: null,
    isAuthorized: false
  });
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  const categories = [
    { value: 'vegetables', label: 'Vegetais' },
    { value: 'fruits', label: 'Frutas' },
    { value: 'grains', label: 'Grãos' },
    { value: 'dairy', label: 'Laticínios' },
    { value: 'meat', label: 'Carnes' },
    { value: 'herbs', label: 'Ervas e Temperos' },
    { value: 'others', label: 'Outros' }
  ];

  const certificationOptions = [
    'organic',
    'fair-trade', 
    'non-gmo',
    'rainforest-alliance',
    'globalgap',
    'sustainable'
  ];

  const qualityGrades = [
    { value: 'A', label: 'A - Premium' },
    { value: 'B', label: 'B - Bom' },
    { value: 'C', label: 'C - Regular' },
    { value: 'premium', label: 'Premium' }
  ];

  const units = [
    { value: 'kg', label: 'Quilogramas (kg)' },
    { value: 'tons', label: 'Toneladas' },
    { value: 'units', label: 'Unidades' },
    { value: 'liters', label: 'Litros' }
  ];

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

    // Verificar conexão Web3
    if (!web3Connection.isConnected || !web3Connection.isCorrectNetwork) {
      alert('Por favor, conecte sua wallet e configure a rede Sepolia primeiro');
      return;
    }

    try {
      setSuccess(null);
      setBlockchainLoading(true);

      // Primeiro, registrar no banco de dados PostgreSQL
      console.log('📝 Registrando produto no banco de dados...');
      const dbResult = await registerProduct({
        ...formData,
        certifications: formData.certifications.join(', '),
        treatments: formData.treatments.split(',').map(t => t.trim()).filter(t => t)
      });

      // Depois, registrar na blockchain
      console.log('⛓️ Registrando produto na blockchain...');
      const blockchainData = {
        name: formData.name,
        category: formData.category,
        producer: formData.producer,
        producerDocument: '', // Pode ser adicionado depois
        harvestDate: formData.harvestDate,
        expiryDate: formData.expiryDate || null,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        location: {
          address: formData.farmLocation,
          coordinates: null // Pode ser adicionado depois
        },
        certifications: formData.certifications,
        batchNumber: formData.batchNumber,
        qualityGrade: formData.qualityGrade,
        ipfsHash: '' // Para futuras implementações com IPFS
      };

      const blockchainResult = await web3Service.registerProduct(blockchainData);
      
      if (blockchainResult.success) {
        setTransactionResult({
          type: 'success',
          productId: blockchainResult.productId,
          transactionHash: blockchainResult.transactionHash,
          blockNumber: blockchainResult.blockNumber,
          gasUsed: blockchainResult.gasUsed,
          etherscanUrl: blockchainResult.etherscanUrl,
          dbResult: dbResult
        });
        
        setSuccess({
          productId: blockchainResult.productId,
          transactionHash: blockchainResult.transactionHash,
          message: 'Produto registrado com sucesso no banco de dados e na blockchain!'
        });

        // Reset form
        setFormData({
          name: '',
          category: 'vegetables',
          producer: '',
          farmLocation: '',
          harvestDate: '',
          quantity: '',
          unit: 'kg',
          certifications: [],
          description: '',
          treatments: '',
          batchNumber: '',
          qualityGrade: 'A',
          expiryDate: ''
        });
        setValidated(false);
        setShowTransactionModal(true);
      } else {
        // Se falhou na blockchain, ainda mostramos sucesso do DB mas com aviso
        setTransactionResult({
          type: 'partial',
          error: blockchainResult.error,
          dbResult: dbResult
        });
        setShowTransactionModal(true);
      }

    } catch (err) {
      console.error('Registration failed:', err);
      setTransactionResult({
        type: 'error',
        error: err.message,
        dbResult: null
      });
      setShowTransactionModal(true);
    } finally {
      setBlockchainLoading(false);
    }
  };

  const handleWeb3ConnectionChange = (connectionData) => {
    setWeb3Connection(connectionData);
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          {/* MetaMask Connection Card */}
          <div className="mb-4">
            <MetaMaskConnect onConnectionChange={handleWeb3ConnectionChange} />
          </div>

          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <h4 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Registrar Novo Produto
              </h4>
              <small>Adicione um produto agrícola ao banco de dados e blockchain</small>
            </Card.Header>
            <Card.Body className="p-4">
              {/* Connection Status Alert */}
              {!web3Connection.isConnected && (
                <Alert variant="warning" className="mb-4">
                  <Alert.Heading className="h6">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Conexão Blockchain Necessária
                  </Alert.Heading>
                  Por favor, conecte sua wallet MetaMask e configure a rede Sepolia para registrar produtos na blockchain.
                </Alert>
              )}

              {web3Connection.isConnected && !web3Connection.isCorrectNetwork && (
                <Alert variant="warning" className="mb-4">
                  <Alert.Heading className="h6">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Rede Incorreta
                  </Alert.Heading>
                  Por favor, mude para a rede Sepolia Testnet.
                </Alert>
              )}

              {error && (
                <Alert variant="danger" className="mb-4">
                  <Alert.Heading className="h6">Falha no Registro</Alert.Heading>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-4">
                  <Alert.Heading className="h6">
                    <i className="bi bi-check-circle me-2"></i>
                    {success.message || 'Produto Registrado com Sucesso!'}
                  </Alert.Heading>
                  <p className="mb-2">
                    <strong>ID do Produto:</strong> <code>{success.productId}</code>
                  </p>
                  {success.transactionHash && (
                    <p className="mb-0">
                      <strong>Hash da Transação:</strong>{' '}
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${success.transactionHash}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        <code>{success.transactionHash.substring(0, 10)}...</code>
                        <i className="bi bi-external-link ms-1"></i>
                      </a>
                    </p>
                  )}
                </Alert>
              )}
                    
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="g-3">
                  {/* Product Name */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nome do Produto *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="ex: Tomates Orgânicos"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor, forneça o nome do produto.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Category */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Categoria *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Por favor, selecione uma categoria.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Producer */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Produtor/Fazenda *</Form.Label>
                      <Form.Control
                        type="text"
                        name="producer"
                        value={formData.producer}
                        onChange={handleInputChange}
                        placeholder="ex: Fazenda Vale Verde"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor, forneça o nome do produtor.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Farm Location */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Localização da Fazenda *</Form.Label>
                      <Form.Control
                        type="text"
                        name="farmLocation"
                        value={formData.farmLocation}
                        onChange={handleInputChange}
                        placeholder="ex: São Paulo, SP, Brasil"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor, forneça a localização da fazenda.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Harvest Date */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Data da Colheita *</Form.Label>
                      <Form.Control
                        type="date"
                        name="harvestDate"
                        value={formData.harvestDate}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor, forneça a data da colheita.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Expiry Date */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Data de Validade</Form.Label>
                      <Form.Control
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Form.Text className="text-muted">
                        Opcional: data de validade do produto
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  {/* Quantity and Unit */}
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Quantidade *</Form.Label>
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
                        Por favor, forneça a quantidade.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Unidade</Form.Label>
                      <Form.Select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                      >
                        {units.map(unit => (
                          <option key={unit.value} value={unit.value}>
                            {unit.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Quality Grade */}
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Grau de Qualidade</Form.Label>
                      <Form.Select
                        name="qualityGrade"
                        value={formData.qualityGrade}
                        onChange={handleInputChange}
                      >
                        {qualityGrades.map(grade => (
                          <option key={grade.value} value={grade.value}>
                            {grade.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Batch Number */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Número do Lote</Form.Label>
                      <Form.Control
                        type="text"
                        name="batchNumber"
                        value={formData.batchNumber}
                        onChange={handleInputChange}
                        placeholder="ex: LT2024001"
                      />
                      <Form.Text className="text-muted">
                        Opcional: número do lote para rastreamento
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  {/* Certifications */}
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Certificações</Form.Label>
                      <div className="mt-2">
                        {certificationOptions.map(certification => (
                          <Form.Check
                            key={certification}
                            inline
                            type="checkbox"
                            id={`cert-${certification}`}
                            label={certification.toUpperCase()}
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
                      <Form.Label>Tratamentos Utilizados</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="treatments"
                        value={formData.treatments}
                        onChange={handleInputChange}
                        placeholder="Liste pesticidas, fertilizantes ou tratamentos utilizados (separados por vírgula)"
                      />
                      <Form.Text className="text-muted">
                        Opcional: liste tratamentos, pesticidas ou fertilizantes usados
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  {/* Description */}
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Descrição Adicional</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Informações adicionais sobre o produto..."
                      />
                    </Form.Group>
                  </Col>

                  {/* Selected Certifications Display */}
                  {formData.certifications.length > 0 && (
                    <Col xs={12}>
                      <div>
                        <small className="text-muted">Certificações selecionadas:</small>
                        <div className="mt-1">
                          {formData.certifications.map(cert => (
                            <Badge key={cert} bg="success" className="me-2">
                              {cert.toUpperCase()}
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
                        disabled={loading || blockchainLoading || !web3Connection.isConnected || !web3Connection.isCorrectNetwork}
                      >
                        {(loading || blockchainLoading) ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              className="me-2"
                            />
                            {blockchainLoading ? 'Registrando na Blockchain...' : 'Registrando no Banco...'}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-shield-check me-2"></i>
                            Registrar Produto
                          </>
                        )}
                      </Button>
                    </div>
                    <Form.Text className="text-muted text-center d-block mt-2">
                      Esta ação criará um registro imutável na blockchain
                    </Form.Text>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* Transaction Result Modal */}
          <Modal show={showTransactionModal} onHide={() => setShowTransactionModal(false)} centered size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                {transactionResult?.type === 'success' && (
                  <>
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Registro Concluído
                  </>
                )}
                {transactionResult?.type === 'partial' && (
                  <>
                    <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                    Registro Parcial
                  </>
                )}
                {transactionResult?.type === 'error' && (
                  <>
                    <i className="bi bi-x-circle text-danger me-2"></i>
                    Erro no Registro
                  </>
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {transactionResult?.type === 'success' && (
                <div>
                  <Alert variant="success">
                    <h6>✅ Sucesso Completo!</h6>
                    <p>O produto foi registrado com sucesso tanto no banco de dados quanto na blockchain.</p>
                  </Alert>
                  
                  <div className="row g-3">
                    <div className="col-12">
                      <strong>ID do Produto:</strong>
                      <div className="font-monospace">{transactionResult.productId}</div>
                    </div>
                    <div className="col-12">
                      <strong>Hash da Transação:</strong>
                      <div className="font-monospace small text-break">{transactionResult.transactionHash}</div>
                      <a 
                        href={transactionResult.etherscanUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm mt-2"
                      >
                        <i className="bi bi-external-link me-1"></i>
                        Ver no Etherscan
                      </a>
                    </div>
                    <div className="col-6">
                      <strong>Bloco:</strong>
                      <div>{transactionResult.blockNumber}</div>
                    </div>
                    <div className="col-6">
                      <strong>Gas Usado:</strong>
                      <div>{transactionResult.gasUsed}</div>
                    </div>
                  </div>
                </div>
              )}

              {transactionResult?.type === 'partial' && (
                <div>
                  <Alert variant="warning">
                    <h6>⚠️ Registro Parcial</h6>
                    <p>O produto foi salvo no banco de dados, mas houve erro na blockchain:</p>
                    <small>{transactionResult.error}</small>
                  </Alert>
                </div>
              )}

              {transactionResult?.type === 'error' && (
                <div>
                  <Alert variant="danger">
                    <h6>❌ Erro no Registro</h6>
                    <p>Ocorreu um erro durante o registro:</p>
                    <small>{transactionResult.error}</small>
                  </Alert>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowTransactionModal(false)}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductRegistration;
