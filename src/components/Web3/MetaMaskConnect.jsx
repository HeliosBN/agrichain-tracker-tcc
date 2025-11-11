import React, { useEffect, useState } from 'react';
import { Button, Card, Alert, Badge, Spinner, Modal } from 'react-bootstrap';
import useWeb3 from '../../hooks/useWeb3';
import web3Service from '../../services/web3Service';

const MetaMaskConnect = ({ onConnectionChange }) => {
  const {
    web3,
    currentAccount,
    isConnecting,
    isConnected,
    isCorrectNetwork,
    balance,
    error,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    formatAddress,
    getAddressUrl
  } = useWeb3();

  const [showDetails, setShowDetails] = useState(false);
  const [contractStats, setContractStats] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // Notificar componente pai sobre mudanças na conexão
  useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange({
        isConnected,
        isCorrectNetwork,
        account: currentAccount,
        web3,
        isAuthorized
      });
    }
  }, [isConnected, isCorrectNetwork, currentAccount, web3, isAuthorized, onConnectionChange]);

  // Inicializar Web3Service quando conectado
  useEffect(() => {
    const initializeService = async () => {
      if (web3 && currentAccount && isCorrectNetwork) {
        const initialized = await web3Service.initialize(web3, currentAccount);
        if (initialized) {
          // Verificar autorização
          setCheckingAuth(true);
          const authResult = await web3Service.isAuthorized();
          if (authResult.success) {
            setIsAuthorized(authResult.isAuthorized);
          }
          setCheckingAuth(false);

          // Obter estatísticas do contrato
          const statsResult = await web3Service.getContractStats();
          if (statsResult.success) {
            setContractStats(statsResult.stats);
          }
        }
      }
    };

    initializeService();
  }, [web3, currentAccount, isCorrectNetwork]);

  const handleConnect = async () => {
    const connected = await connectWallet();
    if (connected && !isCorrectNetwork) {
      // Auto-switch para Sepolia se conectou mas não está na rede correta
      await switchToSepolia();
    }
  };

  const NetworkStatus = () => {
    if (!isConnected) return null;

    return (
      <div className="d-flex align-items-center gap-2 mb-2">
        <Badge bg={isCorrectNetwork ? 'success' : 'warning'}>
          {isCorrectNetwork ? (
            <>
              <i className="bi bi-check-circle me-1"></i>
              Sepolia Testnet
            </>
          ) : (
            <>
              <i className="bi bi-exclamation-triangle me-1"></i>
              Rede Incorreta
            </>
          )}
        </Badge>
        
        {isAuthorized && (
          <Badge bg="success">
            <i className="bi bi-shield-check me-1"></i>
            Autorizado
          </Badge>
        )}
        
        {checkingAuth && (
          <Badge bg="secondary">
            <Spinner size="sm" /> Verificando...
          </Badge>
        )}
      </div>
    );
  };

  const ConnectionDetails = () => (
    <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-info-circle me-2"></i>
          Detalhes da Conexão
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3">
          <div className="col-12">
            <strong>Endereço da Wallet:</strong>
            <div className="font-monospace small text-break">
              {currentAccount}
            </div>
            <a 
              href={getAddressUrl(currentAccount)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-link btn-sm p-0"
            >
              <i className="bi bi-external-link"></i> Ver no Etherscan
            </a>
          </div>
          
          <div className="col-6">
            <strong>Saldo:</strong>
            <div>{balance} ETH</div>
          </div>
          
          <div className="col-6">
            <strong>Rede:</strong>
            <div>{isCorrectNetwork ? 'Sepolia' : 'Outra'}</div>
          </div>
          
          {contractStats && (
            <>
              <div className="col-12">
                <hr />
                <strong>Estatísticas do Contrato:</strong>
              </div>
              <div className="col-4">
                <div className="text-center">
                  <div className="h4 text-primary">{contractStats.totalProducts}</div>
                  <small>Produtos</small>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center">
                  <div className="h4 text-success">{contractStats.totalEvents}</div>
                  <small>Eventos</small>
                </div>
              </div>
              <div className="col-4">
                <div className="text-center">
                  <div className="h4 text-info">{contractStats.totalAuthorizedActors}</div>
                  <small>Autorizados</small>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDetails(false)}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (!window.ethereum) {
    return (
      <Alert variant="warning" className="d-flex align-items-center">
        <i className="bi bi-exclamation-triangle me-2"></i>
        <div>
          <strong>MetaMask não encontrado!</strong>
          <div className="small">
            Por favor, instale o MetaMask para usar a integração blockchain.
            <br />
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-sm btn-warning mt-2"
            >
              <i className="bi bi-download me-1"></i>
              Instalar MetaMask
            </a>
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="card-title mb-1">
              <i className="bi bi-wallet2 me-2"></i>
              Blockchain Connection
            </h6>
            <NetworkStatus />
          </div>
          <div className="text-end">
            {isConnected && (
              <small className="text-muted">
                {formatAddress(currentAccount)}
              </small>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="small mb-3">
            <i className="bi bi-exclamation-circle me-1"></i>
            {error}
          </Alert>
        )}

        <div className="d-flex gap-2 flex-wrap">
          {!isConnected ? (
            <Button 
              variant="primary" 
              onClick={handleConnect}
              disabled={isConnecting}
              className="d-flex align-items-center"
            >
              {isConnecting ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Conectando...
                </>
              ) : (
                <>
                  <i className="bi bi-wallet2 me-2"></i>
                  Conectar MetaMask
                </>
              )}
            </Button>
          ) : (
            <>
              {!isCorrectNetwork && (
                <Button 
                  variant="warning" 
                  size="sm"
                  onClick={switchToSepolia}
                >
                  <i className="bi bi-arrow-repeat me-1"></i>
                  Trocar para Sepolia
                </Button>
              )}
              
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => setShowDetails(true)}
              >
                <i className="bi bi-info-circle me-1"></i>
                Detalhes
              </Button>
              
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={disconnectWallet}
              >
                <i className="bi bi-power me-1"></i>
                Desconectar
              </Button>
            </>
          )}
        </div>

        {isConnected && isCorrectNetwork && balance && (
          <div className="mt-3 p-2 bg-light rounded">
            <small className="text-muted">
              <i className="bi bi-currency-bitcoin me-1"></i>
              Saldo: <strong>{balance} ETH</strong>
              {parseFloat(balance) < 0.01 && (
                <div className="text-warning mt-1">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Saldo baixo. <a 
                    href="https://sepoliafaucet.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Obter ETH teste
                  </a>
                </div>
              )}
            </small>
          </div>
        )}

        <ConnectionDetails />
      </Card.Body>
    </Card>
  );
};

export default MetaMaskConnect;