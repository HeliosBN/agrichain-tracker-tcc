import React, { useState } from 'react';
import { Navbar, Nav, Container, Dropdown, Button, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useSupplyChain } from '../../hooks/useSupplyChain';

const NavigationBar = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useSupplyChain();
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

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
              Dashboard
            </Nav.Link>
            
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle 
                as={Nav.Link} 
                id="products-dropdown"
                className="d-flex align-items-center"
              >
                <i className="bi bi-box-seam me-1"></i>
                Products
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item 
                  as={Link} 
                  to="/register-product" 
                  onClick={closeMenu}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Register Product
                </Dropdown.Item>
                <Dropdown.Item 
                  as={Link} 
                  to="/track-product" 
                  onClick={closeMenu}
                >
                  <i className="bi bi-search me-2"></i>
                  Track Product
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

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
                <Dropdown.Item 
                  as={Link} 
                  to="/producer-dashboard" 
                  onClick={closeMenu}
                >
                  <i className="bi bi-person-workspace me-2"></i>
                  Producer
                </Dropdown.Item>
                <Dropdown.Item 
                  as={Link} 
                  to="/distributor-dashboard" 
                  onClick={closeMenu}
                >
                  <i className="bi bi-truck me-2"></i>
                  Distributor
                </Dropdown.Item>
                <Dropdown.Item 
                  as={Link} 
                  to="/consumer-view" 
                  onClick={closeMenu}
                >
                  <i className="bi bi-person-check me-2"></i>
                  Consumer
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

          <Nav className="d-flex align-items-center">
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
    </Navbar>
  );
};

export default NavigationBar;
