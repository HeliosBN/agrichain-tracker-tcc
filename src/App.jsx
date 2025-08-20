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

const RegisterPage = () => (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header bg-success text-white">
            <h4>📝 Registro de Produtos</h4>
          </div>
          <div className="card-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Nome do Produto</label>
                <input type="text" className="form-control" placeholder="Ex: Tomates Orgânicos" />
              </div>
              <div className="mb-3">
                <label className="form-label">Produtor</label>
                <input type="text" className="form-control" placeholder="Nome da fazenda" />
              </div>
              <div className="mb-3">
                <label className="form-label">Localização</label>
                <input type="text" className="form-control" placeholder="Cidade, Estado" />
              </div>
              <button type="submit" className="btn btn-success">Registrar na Blockchain</button>
              <Link to="/" className="btn btn-secondary ms-2">Voltar</Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TrackPage = () => (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h4>🔍 Rastreamento de Produtos</h4>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">ID do Produto</label>
              <input type="text" className="form-control" placeholder="Digite o código do produto" />
            </div>
            <button className="btn btn-primary">Buscar Produto</button>
            <Link to="/" className="btn btn-secondary ms-2">Voltar</Link>
            
            <div className="mt-4">
              <div className="alert alert-info">
                <h6>Produto Exemplo: #1001</h6>
                <p><strong>Nome:</strong> Tomates Orgânicos</p>
                <p><strong>Status:</strong> <span className="badge bg-warning">Em Trânsito</span></p>
                <p><strong>Localização:</strong> São Paulo, SP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ConsumerPage = () => (
  <div className="container mt-5">
    <div className="row">
      <div className="col-12 text-center">
        <h1 className="text-info mb-4">👥 Portal do Consumidor</h1>
        <div className="alert alert-info">
          <h5>Conheça a Origem dos Seus Alimentos</h5>
          <p>Escaneie o QR Code ou digite o código do produto para ver toda sua jornada</p>
        </div>
        
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5>🍅 Tomates Orgânicos</h5>
                <p>Fazenda Vale Verde</p>
                <span className="badge bg-success">100% Orgânico</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5>☕ Café Premium</h5>
                <p>Montanha do Café</p>
                <span className="badge bg-warning">Fair Trade</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5>🥬 Alface Fresca</h5>
                <p>Agricultura Sustentável</p>
                <span className="badge bg-success">Orgânico</span>
              </div>
            </div>
          </div>
        </div>
        
        <Link to="/" className="btn btn-secondary mt-4">Voltar ao Início</Link>
      </div>
    </div>
  </div>
);

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
