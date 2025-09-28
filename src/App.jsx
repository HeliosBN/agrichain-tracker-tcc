import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Modal, Form, Button, Nav, Alert, Spinner, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Simple Login Modal Component
const LoginModal = ({ show, onHide, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'producer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simular login por enquanto
      const userData = {
        name: formData.email.split('@')[0],
        email: formData.email,
        role: 'producer'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      onLoginSuccess(userData);
      onHide();
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'producer' });
    } catch (error) {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      // Simular registro por enquanto
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      onLoginSuccess(userData);
      onHide();
      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'producer' });
    } catch (error) {
      setError('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>
          <i className="bi bi-person-circle me-2"></i>
          {activeTab === 'login' ? 'Entrar na Conta' : 'Criar Conta'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Tabs */}
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'login'} 
              onClick={() => setActiveTab('login')}
            >
              Login
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'register'} 
              onClick={() => setActiveTab('register')}
            >
              Registrar
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite sua senha"
                required
                disabled={loading}
              />
            </Form.Group>

            <Button 
              variant="success" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="João Silva"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Usuário</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="producer">🌾 Produtor</option>
                <option value="distributor">🚛 Distribuidor</option>
                <option value="retailer">🏪 Varejista</option>
                <option value="consumer">👤 Consumidor</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
                minLength={6}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirmar Senha</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Digite a senha novamente"
                required
                disabled={loading}
              />
            </Form.Group>

            <Button 
              variant="success" 
              type="submit" 
              className="w-100"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};
const HomePage = () => (
  <div className="container mt-5">
    <div className="row">
      <div className="col-12 text-center">
        <h1 className="text-success mb-4">🌾 AgriChain Tracker</h1>
        <div className="alert alert-success">
          <h4>Agricultural Supply Chain Blockchain Tracker</h4>
          
        </div>
        
        <div className="row g-3 mt-4">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="text-success">1,247</h3>
                <p className="text-muted">Total Products</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="text-warning">89</h3>
                <p className="text-muted">Active Shipments</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="text-primary">1,158</h3>
                <p className="text-muted">Completed</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="text-info">342</h3>
                <p className="text-muted">Suppliers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-4">
            <Link to="/register" className="btn btn-success w-100 mb-2">
              📝 Registrar Produto
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/track" className="btn btn-primary w-100 mb-2">
              🔍 Rastrear Produto
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/consumer" className="btn btn-info w-100 mb-2">
              👥 Portal do Consumidor
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RegisterPage = () => {
  const [productData, setProductData] = useState({
    productName: '',
    producer: '',
    producerCpf: '',
    location: '',
    category: 'vegetables',
    isOrganic: false,
    expiryDate: '',
    harvestDate: '',
    quantity: '',
    unit: 'kg',
    certifications: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCertificationChange = (certification) => {
    setProductData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(cert => cert !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const validateCPF = (cpf) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação básica do CPF (simplificada)
    return true;
  };

  const validateForm = () => {
    if (!productData.productName || !productData.producer || !productData.producerCpf) {
      setMessage({ type: 'danger', text: 'Nome do produto, produtor e CPF são obrigatórios' });
      return false;
    }

    if (!validateCPF(productData.producerCpf)) {
      setMessage({ type: 'danger', text: 'CPF inválido' });
      return false;
    }

    if (productData.isOrganic && !productData.certifications.includes('organic')) {
      setMessage({ type: 'warning', text: 'Produto orgânico deve ter certificação correspondente' });
      return false;
    }

    if (productData.expiryDate && new Date(productData.expiryDate) <= new Date()) {
      setMessage({ type: 'danger', text: 'Data de validade deve ser no futuro' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulação de registro (futuramente conectar com backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const productId = `AGRI-${Date.now()}`;
      setMessage({ 
        type: 'success', 
        text: `Produto registrado com sucesso! ID: ${productId}` 
      });
      
      // Reset form
      setProductData({
        productName: '',
        producer: '',
        producerCpf: '',
        location: '',
        category: 'vegetables',
        isOrganic: false,
        expiryDate: '',
        harvestDate: '',
        quantity: '',
        unit: 'kg',
        certifications: []
      });

    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: 'Erro ao registrar produto. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value) => {
    const cpf = value.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e) => {
    const formattedCPF = formatCPF(e.target.value);
    setProductData(prev => ({
      ...prev,
      producerCpf: formattedCPF
    }));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h4><i className="bi bi-plus-circle me-2"></i>📝 Registro de Produtos Agrícolas</h4>
            </div>
            <div className="card-body">
              {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                  {message.text}
                  <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Informações Básicas */}
                  <div className="col-md-6">
                    <h5 className="text-success mb-3">
                      <i className="bi bi-info-circle me-2"></i>Informações Básicas
                    </h5>
                    
                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-tag me-1"></i>Nome do Produto *
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="productName"
                        value={productData.productName}
                        onChange={handleInputChange}
                        placeholder="Ex: Tomates Orgânicos, Alface Crespa, etc."
                        required 
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-list me-1"></i>Categoria
                      </label>
                      <select 
                        className="form-select"
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                      >
                        <option value="vegetables">🥬 Vegetais</option>
                        <option value="fruits">🍎 Frutas</option>
                        <option value="grains">🌾 Grãos</option>
                        <option value="herbs">🌿 Ervas</option>
                        <option value="others">📦 Outros</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-calendar-event me-1"></i>Data de Validade *
                      </label>
                      <input 
                        type="date" 
                        className="form-control" 
                        name="expiryDate"
                        value={productData.expiryDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required 
                      />
                      <div className="form-text">Data até quando o produto pode ser consumido</div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-calendar-check me-1"></i>Data da Colheita
                      </label>
                      <input 
                        type="date" 
                        className="form-control" 
                        name="harvestDate"
                        value={productData.harvestDate}
                        onChange={handleInputChange}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="row">
                      <div className="col-8">
                        <label className="form-label">
                          <i className="bi bi-boxes me-1"></i>Quantidade
                        </label>
                        <input 
                          type="number" 
                          className="form-control" 
                          name="quantity"
                          value={productData.quantity}
                          onChange={handleInputChange}
                          placeholder="100"
                          min="0.1"
                          step="0.1"
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label">Unidade</label>
                        <select 
                          className="form-select"
                          name="unit"
                          value={productData.unit}
                          onChange={handleInputChange}
                        >
                          <option value="kg">Kg</option>
                          <option value="g">Gramas</option>
                          <option value="tons">Toneladas</option>
                          <option value="units">Unidades</option>
                          <option value="liters">Litros</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Produtor */}
                  <div className="col-md-6">
                    <h5 className="text-success mb-3">
                      <i className="bi bi-person-badge me-2"></i>Informações do Produtor
                    </h5>
                    
                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-building me-1"></i>Nome do Produtor/Fazenda *
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="producer"
                        value={productData.producer}
                        onChange={handleInputChange}
                        placeholder="Ex: Fazenda Vale Verde, João Silva, etc."
                        required 
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-card-text me-1"></i>CPF do Produtor *
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="producerCpf"
                        value={productData.producerCpf}
                        onChange={handleCPFChange}
                        placeholder="000.000.000-00"
                        maxLength="14"
                        required 
                      />
                      <div className="form-text">Necessário para validar certificações orgânicas</div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-geo-alt me-1"></i>Localização
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="location"
                        value={productData.location}
                        onChange={handleInputChange}
                        placeholder="Cidade, Estado, País"
                      />
                    </div>

                    {/* Certificações */}
                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-patch-check me-1"></i>Certificações
                      </label>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          name="isOrganic"
                          checked={productData.isOrganic}
                          onChange={handleInputChange}
                          id="isOrganic"
                        />
                        <label className="form-check-label" htmlFor="isOrganic">
                          🌱 Produto Orgânico
                        </label>
                      </div>
                      
                      <div className="mt-2">
                        <small className="text-muted">Certificações adicionais:</small>
                        <div className="d-flex flex-wrap gap-2 mt-1">
                          {['organic', 'fair-trade', 'non-gmo', 'rainforest'].map(cert => (
                            <div key={cert} className="form-check form-check-inline">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id={cert}
                                checked={productData.certifications.includes(cert)}
                                onChange={() => handleCertificationChange(cert)}
                              />
                              <label className="form-check-label" htmlFor={cert}>
                                {cert === 'organic' && '🌿 Orgânico'}
                                {cert === 'fair-trade' && '⚖️ Fair Trade'}
                                {cert === 'non-gmo' && '🧬 Non-GMO'}
                                {cert === 'rainforest' && '🌳 Rainforest'}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <Link to="/" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-1"></i>Voltar
                  </Link>
                  
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-check me-2"></i>
                        Registrar na Blockchain
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackPage = () => {
  const [searchId, setSearchId] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sistema de produtos similares ao ConsumerPage
  const mockProducts = {
    'P001': {
      id: 'P001',
      name: 'Tomates Orgânicos Premium',
      category: 'Vegetais',
      producer: 'João Silva',
      location: 'São Paulo, SP',
      expiryDate: '2024-12-20',
      status: 'Em Distribuição',
      certifications: ['Orgânico', 'Rastreável'],
      createdAt: '2024-11-15',
      timeline: [
        {
          step: 'Colheita',
          date: '2024-11-15',
          time: '06:30',
          location: 'Fazenda São João - São Paulo, SP',
          responsible: 'João Silva',
          status: 'Concluído',
          description: 'Colheita manual seletiva dos tomates maduros'
        },
        {
          step: 'Seleção e Embalagem',
          date: '2024-11-15',
          time: '10:15',
          location: 'Centro de Processamento - São Paulo, SP',
          responsible: 'Maria Santos',
          status: 'Concluído',
          description: 'Seleção por qualidade e embalagem em caixas'
        },
        {
          step: 'Transporte para Distribuição',
          date: '2024-11-16',
          time: '08:00',
          location: 'Centro de Distribuição - São Paulo, SP',
          responsible: 'Transportes ABC',
          status: 'Em Andamento',
          description: 'Transporte refrigerado para centro de distribuição'
        }
      ]
    },
    'P002': {
      id: 'P002',
      name: 'Alface Orgânica',
      category: 'Vegetais',
      producer: 'Maria Ferreira',
      location: 'Minas Gerais, MG',
      expiryDate: '2024-12-10',
      status: 'Entregue',
      certifications: ['Orgânico', 'Fair Trade'],
      createdAt: '2024-11-10',
      timeline: [
        {
          step: 'Plantio',
          date: '2024-10-15',
          time: '07:00',
          location: 'Fazenda Verde - Minas Gerais, MG',
          responsible: 'Maria Ferreira',
          status: 'Concluído',
          description: 'Plantio das mudas em sistema orgânico'
        },
        {
          step: 'Colheita',
          date: '2024-11-10',
          time: '06:00',
          location: 'Fazenda Verde - Minas Gerais, MG',
          responsible: 'Maria Ferreira',
          status: 'Concluído',
          description: 'Colheita manual no ponto ideal de consumo'
        },
        {
          step: 'Processamento',
          date: '2024-11-10',
          time: '09:30',
          location: 'Centro de Processamento - Minas Gerais, MG',
          responsible: 'Pedro Costa',
          status: 'Concluído',
          description: 'Lavagem, higienização e embalagem'
        },
        {
          step: 'Distribuição',
          date: '2024-11-11',
          time: '14:00',
          location: 'Supermercado Central - Belo Horizonte, MG',
          responsible: 'Distribuidora MG',
          status: 'Concluído',
          description: 'Entrega no ponto de venda final'
        }
      ]
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Digite um ID de produto válido');
      return;
    }

    setLoading(true);
    setError('');
    setProduct(null);

    try {
      // Simular busca
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const foundProduct = mockProducts[searchId.toUpperCase()];
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('Produto não encontrado. Tente com P001 ou P002');
      }
    } catch (err) {
      setError('Erro ao buscar produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'concluído': return 'success';
      case 'em andamento': return 'primary';
      case 'pendente': return 'warning';
      case 'entregue': return 'success';
      case 'em distribuição': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-search me-2"></i>Rastreamento Avançado de Produtos
              </h4>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-8">
                  <label className="form-label fw-bold">
                    <i className="bi bi-upc-scan me-1"></i>ID do Produto
                  </label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Digite o código do produto (ex: P001, P002)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button 
                    className="btn btn-primary btn-lg w-100 me-2" 
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Buscando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>Buscar
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}

              {!product && !loading && !error && (
                <div className="text-center py-5">
                  <i className="bi bi-box-seam text-muted" style={{fontSize: '5rem'}}></i>
                  <h5 className="text-muted mt-3">Digite o ID do produto para rastreamento</h5>
                  <p className="text-muted">Produtos disponíveis para teste: <code>P001</code>, <code>P002</code></p>
                </div>
              )}

              {product && (
                <div className="mt-4">
                  {/* Informações Básicas do Produto */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card border-success">
                        <div className="card-header bg-success text-white">
                          <h6 className="mb-0"><i className="bi bi-info-circle me-2"></i>Informações do Produto</h6>
                        </div>
                        <div className="card-body">
                          <h4 className="text-success mb-3">{product.name}</h4>
                          <div className="row g-2">
                            <div className="col-6">
                              <small className="text-muted d-block">ID do Produto</small>
                              <strong>{product.id}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Categoria</small>
                              <strong>{product.category}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Produtor</small>
                              <strong>{product.producer}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Status</small>
                              <span className={`badge bg-${getStatusBadgeColor(product.status)}`}>
                                {product.status}
                              </span>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Validade</small>
                              <strong>{new Date(product.expiryDate).toLocaleDateString('pt-BR')}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Registrado em</small>
                              <strong>{new Date(product.createdAt).toLocaleDateString('pt-BR')}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-info">
                        <div className="card-header bg-info text-white">
                          <h6 className="mb-0"><i className="bi bi-award me-2"></i>Certificações</h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            {product.certifications.map((cert, index) => (
                              <span key={index} className="badge bg-success me-2 mb-1">
                                <i className="bi bi-patch-check me-1"></i>{cert}
                              </span>
                            ))}
                          </div>
                          <div className="d-flex align-items-center text-success">
                            <i className="bi bi-shield-check me-2"></i>
                            <small>Produto verificado e certificado</small>
                          </div>
                          <div className="d-flex align-items-center text-info mt-1">
                            <i className="bi bi-geo-alt me-2"></i>
                            <small>{product.location}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline de Rastreamento */}
                  <div className="card border-primary">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-clock-history me-2"></i>Histórico Completo da Cadeia de Suprimentos
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="timeline">
                        {product.timeline.map((event, index) => (
                          <div key={index} className="timeline-item mb-4 position-relative">
                            {index < product.timeline.length - 1 && (
                              <div className="timeline-line position-absolute" style={{
                                left: '25px',
                                top: '60px',
                                width: '3px',
                                height: '80px',
                                background: 'linear-gradient(to bottom, #0d6efd, #6c757d)',
                                zIndex: 1
                              }}></div>
                            )}
                            <div className="d-flex align-items-start">
                              <div className={`timeline-marker bg-${getStatusBadgeColor(event.status)} rounded-circle d-flex align-items-center justify-content-center me-4 position-relative shadow`} style={{width: '50px', height: '50px', zIndex: 2}}>
                                <span className="text-white fw-bold">{index + 1}</span>
                              </div>
                              <div className="flex-grow-1">
                                <div className="card border-primary shadow-sm">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                      <div className="flex-grow-1">
                                        <h5 className="card-title text-primary mb-2 d-flex align-items-center">
                                          <i className="bi bi-arrow-right-circle me-2"></i>
                                          {event.step}
                                        </h5>
                                        <p className="card-text text-dark mb-3">{event.description}</p>
                                        
                                        <div className="row g-2 mb-2">
                                          <div className="col-lg-4 col-md-6">
                                            <small className="text-muted d-flex align-items-center">
                                              <i className="bi bi-geo-alt me-1 text-danger"></i>
                                              <strong>Local:</strong>&nbsp;{event.location}
                                            </small>
                                          </div>
                                          <div className="col-lg-4 col-md-6">
                                            <small className="text-muted d-flex align-items-center">
                                              <i className="bi bi-calendar3 me-1 text-info"></i>
                                              <strong>Data:</strong>&nbsp;{new Date(event.date).toLocaleDateString('pt-BR')}
                                            </small>
                                          </div>
                                          <div className="col-lg-4 col-md-6">
                                            <small className="text-muted d-flex align-items-center">
                                              <i className="bi bi-clock me-1 text-warning"></i>
                                              <strong>Horário:</strong>&nbsp;{event.time}
                                            </small>
                                          </div>
                                        </div>
                                        
                                        {event.responsible && (
                                          <div className="border-top pt-2">
                                            <small className="text-muted d-flex align-items-center">
                                              <i className="bi bi-person-badge me-1"></i>
                                              <strong>Responsável:</strong>&nbsp;{event.responsible}
                                            </small>
                                          </div>
                                        )}
                                      </div>
                                      <div className="d-flex flex-column align-items-end ms-3">
                                        <span className={`badge bg-${getStatusBadgeColor(event.status)} mb-2`}>
                                          {event.status}
                                        </span>
                                        {index === 0 && (
                                          <span className="badge bg-warning text-dark">
                                            <i className="bi bi-star me-1"></i>Mais Recente
                                          </span>
                                        )}
                                        {index === product.timeline.length - 1 && (
                                          <span className="badge bg-secondary">
                                            <i className="bi bi-flag me-1"></i>Origem
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary btn-lg">
                  <i className="bi bi-arrow-left me-2"></i>Voltar ao Início
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConsumerPage = () => {
  const [searchId, setSearchId] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Digite um ID de produto válido');
      return;
    }

    setLoading(true);
    setError('');
    setProduct(null);

    try {
      // Simular busca na blockchain
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Buscar produto no localStorage (simulação)
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const foundProduct = products.find(p => p.id === searchId.trim());
      
      if (foundProduct) {
        // Simular dados completos do produto com timeline
        const productWithTimeline = {
          ...foundProduct,
          timeline: [
            {
              step: 1,
              event: '🌱 Produto Colhido',
              date: foundProduct.harvestDate || '2025-09-15',
              location: foundProduct.location || 'Fazenda Vale Verde',
              actor: foundProduct.producer,
              status: 'completed',
              details: `Colheita realizada por ${foundProduct.producer}. Produto ${foundProduct.isOrganic ? 'orgânico' : 'convencional'}.`
            },
            {
              step: 2,
              event: '📦 Produto Processado',
              date: '2025-09-16',
              location: 'Centro de Processamento',
              actor: 'ProcessCorp',
              status: 'completed',
              details: 'Produto lavado, selecionado e embalado seguindo padrões de qualidade.'
            },
            {
              step: 3,
              event: '🚛 Em Transporte',
              date: '2025-09-20',
              location: 'Rodovia SP-100',
              actor: 'LogTrans',
              status: 'completed',
              details: 'Transporte refrigerado mantendo temperatura entre 2°C e 4°C.'
            },
            {
              step: 4,
              event: '🏪 Chegada ao Varejista',
              date: '2025-09-22',
              location: 'SuperMercado Central',
              actor: 'SuperMercado Central',
              status: 'completed',
              details: 'Produto recebido e armazenado adequadamente.'
            },
            {
              step: 5,
              event: '🛒 Disponível para Venda',
              date: '2025-09-23',
              location: 'SuperMercado Central',
              actor: 'SuperMercado Central',
              status: 'current',
              details: 'Produto disponível nas prateleiras para o consumidor.'
            }
          ]
        };
        setProduct(productWithTimeline);
      } else {
        // Produto de exemplo para demonstração
        if (searchId.toUpperCase() === 'DEMO-001' || searchId.toLowerCase() === 'demo') {
          setProduct({
            id: 'DEMO-001',
            productName: 'Tomates Orgânicos Premium',
            producer: 'Fazenda Orgânica do Vale',
            producerCpf: '123.456.789-01',
            location: 'Vale Verde, MG',
            category: 'vegetables',
            isOrganic: true,
            certifications: ['organic', 'fair-trade'],
            expiryDate: '2025-10-15',
            harvestDate: '2025-09-15',
            quantity: '50',
            unit: 'kg',
            blockchain: {
              transactionHash: '0x1a2b3c4d5e6f...',
              confirmed: true,
              blockNumber: 123456
            },
            timeline: [
              {
                step: 1,
                event: '🌱 Produto Colhido',
                date: '2025-09-15',
                location: 'Fazenda Orgânica do Vale, MG',
                actor: 'João Silva',
                status: 'completed',
                details: 'Colheita manual realizada por João Silva. Tomates orgânicos certificados, sem uso de agrotóxicos.'
              },
              {
                step: 2,
                event: '🔬 Controle de Qualidade',
                date: '2025-09-16',
                location: 'Laboratório AgroTest',
                actor: 'Maria Santos',
                status: 'completed',
                details: 'Análise de resíduos químicos: NEGATIVO. Certificação orgânica validada.'
              },
              {
                step: 3,
                event: '📦 Embalagem',
                date: '2025-09-17',
                location: 'Centro de Processamento EcoPack',
                actor: 'EcoPack Ltda',
                status: 'completed',
                details: 'Tomates lavados, selecionados e embalados em material biodegradável.'
              },
              {
                step: 4,
                event: '🚛 Transporte Iniciado',
                date: '2025-09-20',
                location: 'Vale Verde, MG → São Paulo, SP',
                actor: 'GreenLogistics',
                status: 'completed',
                details: 'Transporte refrigerado (2°C-4°C) em veículo com rastreamento GPS.'
              },
              {
                step: 5,
                event: '📍 Chegada ao Centro de Distribuição',
                date: '2025-09-21',
                location: 'Centro de Distribuição SP',
                actor: 'GreenLogistics',
                status: 'completed',
                details: 'Produto inspecionado e aprovado para distribuição aos varejistas.'
              },
              {
                step: 6,
                event: '🏪 Entrega ao Varejista',
                date: '2025-09-22',
                location: 'SuperFresh Orgânicos',
                actor: 'SuperFresh Orgânicos',
                status: 'completed',
                details: 'Produto recebido e armazenado em área refrigerada do supermercado.'
              },
              {
                step: 7,
                event: '🛒 Disponível para Venda',
                date: '2025-09-23',
                location: 'SuperFresh Orgânicos',
                actor: 'SuperFresh Orgânicos',
                status: 'current',
                details: 'Produto disponível na seção de orgânicos. Validade até 15/10/2025.'
              }
            ]
          });
        } else {
          setError('Produto não encontrado. Tente "DEMO-001" para ver um exemplo ou registre um novo produto.');
        }
      }
    } catch (error) {
      setError('Erro ao buscar produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <i className="bi bi-check-circle-fill text-success"></i>;
      case 'current':
        return <i className="bi bi-play-circle-fill text-warning"></i>;
      default:
        return <i className="bi bi-circle text-muted"></i>;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="text-info mb-4">👥 Portal do Consumidor</h1>
          <div className="alert alert-info">
            <h5>🔍 Conheça a Origem dos Seus Alimentos</h5>
            <p>Digite o código do produto para ver toda sua jornada da fazenda até sua mesa</p>
          </div>
        </div>
      </div>

      {/* Campo de Busca */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h5><i className="bi bi-search me-2"></i>Rastrear Produto</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label">
                    <i className="bi bi-upc-scan me-1"></i>
                    ID do Produto ou QR Code
                  </label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Digite o código do produto (ex: AGRI-123456789-ABC12)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  {/* <div className="form-text">
                    💡 Dica: Teste com "DEMO-001" para ver um exemplo completo
                  </div> */}
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button 
                    className="btn btn-info btn-lg w-100 mb-3"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Buscando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        Rastrear
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Resultado da Busca */}
      {product && (
        <div className="row justify-content-center">
          <div className="col-md-10">
            {/* Informações do Produto */}
            <div className="card shadow mb-4">
              <div className="card-header bg-success text-white">
                <h4>
                  <i className="bi bi-box-seam me-2"></i>
                  {product.productName}
                  <span className="float-end">
                    <small className="badge bg-light text-dark">ID: {product.id}</small>
                  </span>
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center mb-3">
                      <div className="display-1">
                        {product.category === 'vegetables' && '🥬'}
                        {product.category === 'fruits' && '🍎'}
                        {product.category === 'grains' && '🌾'}
                        {product.category === 'herbs' && '🌿'}
                      </div>
                      <h5>{product.productName}</h5>
                      
                      {/* Certificações */}
                      <div className="mt-3">
                        {product.isOrganic && (
                          <span className="badge bg-success me-1 mb-1">🌱 Orgânico</span>
                        )}
                        {product.certifications?.map(cert => (
                          <span key={cert} className="badge bg-info me-1 mb-1">
                            {cert === 'organic' && '🌿 Orgânico'}
                            {cert === 'fair-trade' && '⚖️ Fair Trade'}
                            {cert === 'non-gmo' && '🧬 Non-GMO'}
                            {cert === 'rainforest' && '🌳 Rainforest'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <h6 className="text-success">📍 Origem</h6>
                    <p><strong>Produtor:</strong> {product.producer}</p>
                    <p><strong>Localização:</strong> {product.location}</p>
                    
                    <h6 className="text-success mt-3">📅 Datas Importantes</h6>
                    <p><strong>Colheita:</strong> {product.harvestDate ? formatDate(product.harvestDate) : 'N/A'}</p>
                    <p><strong>Validade:</strong> {product.expiryDate ? formatDate(product.expiryDate) : 'N/A'}</p>
                  </div>
                  
                  <div className="col-md-4">
                    <h6 className="text-success">⚖️ Quantidade</h6>
                    <p>{product.quantity} {product.unit}</p>
                    
                    <h6 className="text-success mt-3">🔗 Verificação Blockchain</h6>
                    {product.blockchain?.confirmed ? (
                      <div>
                        <p className="text-success mb-1">
                          <i className="bi bi-shield-check me-1"></i>
                          ✅ Verificado na Blockchain
                        </p>
                        <small className="text-muted font-monospace">
                          Bloco: #{product.blockchain.blockNumber}
                        </small>
                      </div>
                    ) : (
                      <p className="text-warning">
                        <i className="bi bi-clock me-1"></i>
                        ⏳ Aguardando confirmação
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline da Cadeia de Suprimentos */}
            <div className="card shadow">
              <div className="card-header bg-warning text-dark">
                <h4>
                  <i className="bi bi-clock-history me-2"></i>
                  Jornada do Produto
                </h4>
                <p className="mb-0">Acompanhe cada etapa desde a produção até chegar a você</p>
              </div>
              <div className="card-body">
                <div className="timeline-consumer">
                  {product.timeline?.map((step, index) => (
                    <div key={index} className="timeline-step mb-4">
                      <div className="row align-items-start">
                        <div className="col-md-1 text-center">
                          <div className="step-number">
                            {getStepIcon(step.status)}
                            <div className="step-line"></div>
                          </div>
                        </div>
                        <div className="col-md-11">
                          <div className={`card border-${step.status === 'current' ? 'warning' : step.status === 'completed' ? 'success' : 'secondary'}`}>
                            <div className={`card-header bg-${step.status === 'current' ? 'warning' : step.status === 'completed' ? 'success' : 'secondary'} text-white`}>
                              <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">
                                  <span className="badge bg-light text-dark me-2">#{step.step}</span>
                                  {step.event}
                                </h6>
                                <small>{formatDate(step.date)}</small>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-8">
                                  <p className="mb-2">{step.details}</p>
                                  <small className="text-muted">
                                    <i className="bi bi-person me-1"></i>
                                    Responsável: {step.actor}
                                  </small>
                                </div>
                                <div className="col-md-4">
                                  <small className="text-muted">
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {step.location}
                                  </small>
                                  {step.status === 'current' && (
                                    <div className="mt-2">
                                      <span className="badge bg-warning">
                                        <i className="bi bi-arrow-right me-1"></i>
                                        Etapa Atual
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-4">
                  <div className="alert alert-success">
                    <h5>
                      <i className="bi bi-shield-check me-2"></i>
                      Produto 100% Rastreável
                    </h5>
                    <p className="mb-0">
                      Todas as informações são verificadas e registradas na blockchain, 
                      garantindo transparência total da origem até o consumo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Produtos de Exemplo
      {!product && !loading && (
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="text-center mb-4">📦 Produtos em Destaque</h3>
            <div className="row">
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center">
                    <div className="display-4">🍅</div>
                    <h5 className="mt-2">Tomates Orgânicos</h5>
                    <p className="text-muted">Fazenda Vale Verde</p>
                    <span className="badge bg-success mb-2">100% Orgânico</span>
                    <br />
                    <button 
                      className="btn btn-outline-info btn-sm"
                      onClick={() => {
                        setSearchId('DEMO-001');
                        handleSearch();
                      }}
                    >
                      <i className="bi bi-search me-1"></i>
                      Ver Rastreamento
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center">
                    <div className="display-4">☕</div>
                    <h5 className="mt-2">Café Premium</h5>
                    <p className="text-muted">Montanha do Café</p>
                    <span className="badge bg-warning">Fair Trade</span>
                    <br />
                    <button className="btn btn-outline-info btn-sm" disabled>
                      <i className="bi bi-search me-1"></i>
                      Em Breve
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body text-center">
                    <div className="display-4">🥬</div>
                    <h5 className="mt-2">Alface Fresca</h5>
                    <p className="text-muted">Agricultura Sustentável</p>
                    <span className="badge bg-success">Orgânico</span>
                    <br />
                    <button className="btn btn-outline-info btn-sm" disabled>
                      <i className="bi bi-search me-1"></i>
                      Em Breve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
      
      
      <div className="text-center mt-5">
        <Link to="/" className="btn btn-secondary">
          <i className="bi bi-house me-1"></i>
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);

  // Verificar se há usuário logado ao carregar
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
          <div className="container">
            <Link className="navbar-brand" to="/">
              🌾 AgriChain Tracker
            </Link>
            
            <div className="d-flex align-items-center">
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                    <i className="bi bi-person-circle me-2"></i>
                    {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item disabled>
                      <strong>{user.name}</strong>
                      <br />
                      <small className="text-muted">{user.email}</small>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Sair
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button 
                  variant="outline-light" 
                  onClick={() => setShowLoginModal(true)}
                >
                  <i className="bi bi-person-circle me-2"></i>
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </nav>
        
        <div style={{ paddingTop: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/consumer" element={<ConsumerPage />} />
          </Routes>
        </div>

        <LoginModal 
          show={showLoginModal} 
          onHide={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    </Router>
  );
}

export default App;
