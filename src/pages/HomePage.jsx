import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ user }) => {
  // Define permissões baseadas no role do usuário
  const getPermissions = (userRole) => {
    switch(userRole) {
      case 'producer':
        return {
          canRegister: true,
          canUpdate: false,
          canTrack: true,
          canViewConsumer: true,
          label: 'Produtor'
        };
      case 'distributor':
        return {
          canRegister: false,
          canUpdate: true,
          canTrack: true,
          canViewConsumer: true,
          label: 'Distribuidor'
        };
      case 'retailer':
        return {
          canRegister: false,
          canUpdate: true,
          canTrack: true,
          canViewConsumer: true,
          label: 'Varejista'
        };
      case 'consumer':
        return {
          canRegister: false,
          canUpdate: false,
          canTrack: true,
          canViewConsumer: true,
          label: 'Consumidor'
        };
      default:
        return {
          canRegister: false,
          canUpdate: false,
          canTrack: true,
          canViewConsumer: true,
          label: 'Visitante'
        };
    }
  };

  const permissions = getPermissions(user?.role);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="text-success mb-4">🌾 AgriChain Tracker</h1>
          
          {/* {!user && (
            <div className="alert alert-primary mb-4">
              <h5>🔐 Credenciais para Teste:</h5>
              <div className="row text-start">
                <div className="col-md-6">
                  <p><strong>👨‍🌾 Produtor:</strong><br />
                  Email: maria@producer.com<br />
                  Senha: producer123</p>
                  
                  <p><strong>🚛 Distribuidor:</strong><br />
                  Email: joao@distributor.com<br />
                  Senha: distributor123</p>
                </div>
                <div className="col-md-6">
                  <p><strong>🏪 Varejista:</strong><br />
                  Email: ana@retailer.com<br />
                  Senha: retailer123</p>
                  
                  <p><strong>👤 Consumidor:</strong><br />
                  Email: carlos@consumer.com<br />
                  Senha: consumer123</p>
                </div>
              </div>
            </div>
          )} */}
          
          {user && (
            <div className="alert alert-info mb-4">
              <h5>Bem-vindo, {user.name}!</h5>
              <p className="mb-0">
                <i className="bi bi-person-badge me-1"></i>
                Acesso como: <strong>{permissions.label}</strong>
              </p>
            </div>
          )}
          
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

          <div className="row mt-4 justify-content-center">
            {permissions.canRegister && (
              <div className="col-md-4">
                <Link to="/register" className="btn btn-success w-100 mb-2">
                  📝 Registrar Produto
                </Link>
              </div>
            )}
            
            {permissions.canUpdate && (
              <div className="col-md-4">
                <Link to="/update" className="btn btn-warning w-100 mb-2">
                  ✏️ Atualizar Produto
                </Link>
              </div>
            )}
            
            {permissions.canTrack && (
              <div className="col-md-4">
                <Link to="/track" className="btn btn-primary w-100 mb-2">
                  🔍 Rastrear Produto
                </Link>
              </div>
            )}
            
            {permissions.canViewConsumer && (
              <div className="col-md-4">
                <Link to="/consumer" className="btn btn-info w-100 mb-2">
                  👥 Portal do Consumidor
                </Link>
              </div>
            )}
          </div>

          {!user && (
            <div className="alert alert-warning mt-4">
              <h5>🔒 Faça login para acesso completo</h5>
              <p>Algumas funcionalidades estão disponíveis apenas para usuários autenticados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;