import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, Button, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useSupplyChain } from '../../hooks/useSupplyChain';
import AuthModal from '../Auth/AuthModal';

const NavigationBar = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useSupplyChain();
  const [expanded, setExpanded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const truncateAddress = (address) => {
    if (!address) return 'Not Connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const closeMenu = () => setExpanded(false);

  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Navbar 
      bg="success" 
      variant="dark" 
      expand="lg" 
      fixed="top" 
      expanded={expanded}
      className="shadow-sm"
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <span className="me-2" style={{ fontSize: '1.8rem' }}>🌾</span>
          <span className="d-none d-sm-inline">AgriChain Tracker</span>
          <span className="d-sm-none">AgriChain</span>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
        />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              onClick={closeMenu}
              className={isActiveLink('/')}
            >
              <i className="bi bi-house-fill me-1"></i>
              Início
            </Nav.Link>
            
            {user && (
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle 
                  as={Nav.Link} 
                  id="products-dropdown"
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-box-seam me-1"></i>
                  Produtos
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {user.role === 'producer' && (
                    <Dropdown.Item 
                      as={Link} 
                      to="/register" 
                      onClick={closeMenu}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Registrar Produto
                    </Dropdown.Item>
                  )}
                  
                  {(user.role === 'distributor' || user.role === 'retailer') && (
                    <Dropdown.Item 
                      as={Link} 
                      to="/update" 
                      onClick={closeMenu}
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Atualizar Produto
                    </Dropdown.Item>
                  )}
                  
                  <Dropdown.Item 
                    as={Link} 
                    to="/track" 
                    onClick={closeMenu}
                  >
                    <i className="bi bi-search me-2"></i>
                    Rastrear Produto
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            {user && (
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle 
                  as={Nav.Link} 
                  id="dashboards-dropdown"
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-grid-3x3-gap me-1"></i>
                  Dashboards
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {user.role === 'producer' && (
                    <Dropdown.Item 
                      as={Link} 
                      to="/register" 
                      onClick={closeMenu}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Registrar Produtos
                    </Dropdown.Item>
                  )}
                  
                  {(user.role === 'distributor' || user.role === 'retailer') && (
                    <Dropdown.Item 
                      as={Link} 
                      to="/update" 
                      onClick={closeMenu}
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Atualizar Produtos
                    </Dropdown.Item>
                  )}
                  
                  <Dropdown.Item 
                    as={Link} 
                    to="/track" 
                    onClick={closeMenu}
                  >
                    <i className="bi bi-search me-2"></i>
                    Rastrear Produtos
                  </Dropdown.Item>
                  
                  <Dropdown.Item 
                    as={Link} 
                    to="/consumer" 
                    onClick={closeMenu}
                  >
                    <i className="bi bi-person-check me-2"></i>
                    Portal do Consumidor
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>

          <Nav className="d-flex align-items-center">
            {/* User Authentication */}
            {user ? (
              <Dropdown align="end" className="me-3">
                <Dropdown.Toggle 
                  variant="outline-light" 
                  id="user-dropdown"
                  className="d-flex align-items-center"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  <span className="d-none d-md-inline me-1">
                    {user.name}
                  </span>
                  <span className="d-md-none">
                    Perfil
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item disabled>
                    <div className="text-center">
                      <i className="bi bi-person-circle" style={{ fontSize: '2rem' }}></i>
                      <div className="mt-1">
                        <strong>{user.name}</strong>
                        <br />
                        <small className="text-muted">{user.email}</small>
                        <br />
                        <Badge bg="success" className="mt-1">
                          {user.role === 'producer' && '🌾 Produtor'}
                          {user.role === 'distributor' && '🚛 Distribuidor'}
                          {user.role === 'retailer' && '🏪 Varejista'}
                          {user.role === 'consumer' && '👤 Consumidor'}
                        </Badge>
                      </div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person-gear me-2"></i>
                    Meu Perfil
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-products">
                    <i className="bi bi-box-seam me-2"></i>
                    Meus Produtos
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
                onClick={() => setShowAuthModal(true)}
                className="d-flex align-items-center me-3"
              >
                <i className="bi bi-person-circle me-1"></i>
                <span className="d-none d-sm-inline">Entrar</span>
                <span className="d-sm-none">Login</span>
              </Button>
            )}

            {/* Blockchain Wallet */}
            {isConnected ? (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="outline-light" 
                  id="wallet-dropdown"
                  className="d-flex align-items-center"
                >
                  <Badge bg="success" className="me-2">
                    <i className="bi bi-circle-fill"></i>
                  </Badge>
                  <span className="d-none d-md-inline me-1">
                    {truncateAddress(account)}
                  </span>
                  <span className="d-md-none">
                    Wallet
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item disabled>
                    <small className="text-muted">Connected Address:</small>
                    <br />
                    <code className="small">{account}</code>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={disconnectWallet}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Disconnect
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button 
                variant="outline-light" 
                onClick={connectWallet}
                className="d-flex align-items-center"
              >
                <i className="bi bi-wallet2 me-1"></i>
                <span className="d-none d-sm-inline">Connect Wallet</span>
                <span className="d-sm-none">Connect</span>
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Auth Modal */}
      <AuthModal 
        show={showAuthModal} 
        onHide={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </Navbar>
  );
};

export default NavigationBar;
