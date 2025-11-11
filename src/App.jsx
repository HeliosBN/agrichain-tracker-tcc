import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Dropdown, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Importar todos os componentes modulares
import AuthModal from './components/Auth/AuthModal';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import UpdatePage from './pages/UpdatePage';
import TrackPage from './pages/TrackPage';
import ConsumerPage from './pages/ConsumerPage';

// Componente Navbar simplificado integrado
const Navbar = ({ user, onShowLogin, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <a className="navbar-brand" href="/">
          🌾 AgriChain Tracker
        </a>
          
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
                <Dropdown.Item onClick={onLogout} className="text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sair
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button 
              variant="outline-light" 
              onClick={onShowLogin}
            >
              <i className="bi bi-person-circle me-2"></i>
              Entrar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

function AppContent() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Verificar se há usuário logado ao carregar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    
    // Redirecionamento baseado no role do usuário
    switch (userData.role) {
      case 'producer':
        // Produtores vão para registro de produtos
        navigate('/register');
        break;
      case 'distributor':
      case 'retailer':
        // Distribuidores e varejistas vão para atualização de produtos
        navigate('/update');
        break;
      case 'consumer':
        // Consumidores vão para o portal/rastreamento
        navigate('/consumer');
        break;
      default:
        // Fallback para a página inicial
        navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="App">
      <Navbar 
        user={user} 
        onShowLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />
        
      <div style={{ paddingTop: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/update" element={<UpdatePage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/consumer" element={<ConsumerPage />} />
        </Routes>
      </div>

      <AuthModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;