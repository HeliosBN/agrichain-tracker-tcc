import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Simple components
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
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-success">
          <div className="container">
            <Link className="navbar-brand" to="/">
              🌾 AgriChain Tracker
            </Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/consumer" element={<ConsumerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
