import React, { useState } from 'react';
import { Modal, Form, Button, Nav, Alert, Spinner } from 'react-bootstrap';

const AuthModal = ({ show, onHide, onLoginSuccess }) => {
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
      const response = await fetch('http://localhost:3001/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        onLoginSuccess(data.data);
        onHide();
        resetForm();
      } else {
        setError(data.message || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro de conexão com o servidor');
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

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        onLoginSuccess(data.data);
        onHide();
        resetForm();
      } else {
        setError(data.message || 'Erro ao criar conta');
      }
    } catch (error) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '', 
      role: 'producer' 
    });
    setError('');
  };

  const handleModalClose = () => {
    resetForm();
    onHide();
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered size="md">
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
              onClick={() => switchTab('login')}
              className="d-flex align-items-center"
            >
              <i className="bi bi-box-arrow-in-right me-1"></i>
              Login
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'register'} 
              onClick={() => switchTab('register')}
              className="d-flex align-items-center"
            >
              <i className="bi bi-person-plus me-1"></i>
              Registrar
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        {activeTab === 'login' && (
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-envelope me-1"></i>
                Email
              </Form.Label>
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
              <Form.Label>
                <i className="bi bi-lock me-1"></i>
                Senha
              </Form.Label>
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

            <div className="d-grid">
              <Button 
                variant="success" 
                type="submit" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Entrar
                  </>
                )}
              </Button>
            </div>
          </Form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-person me-1"></i>
                Nome Completo
              </Form.Label>
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
              <Form.Label>
                <i className="bi bi-envelope me-1"></i>
                Email
              </Form.Label>
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
              <Form.Label>
                <i className="bi bi-person-badge me-1"></i>
                Tipo de Usuário
              </Form.Label>
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
              <Form.Label>
                <i className="bi bi-lock me-1"></i>
                Senha
              </Form.Label>
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
              <Form.Label>
                <i className="bi bi-lock-fill me-1"></i>
                Confirmar Senha
              </Form.Label>
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

            <div className="d-grid">
              <Button 
                variant="success" 
                type="submit" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Criar Conta
                  </>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <small className="text-muted">
          <i className="bi bi-shield-check me-1"></i>
          Seus dados estão seguros e protegidos
        </small>
      </Modal.Footer>
    </Modal>
  );
};

export default AuthModal;
