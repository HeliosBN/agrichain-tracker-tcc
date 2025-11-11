import React, { useState } from 'react';

const UpdatePage = () => {
  const [formData, setFormData] = useState({
    productId: '',
    distributorName: '',
    distributorCpf: '',
    receivedDate: '',
    forwardedDate: '',
    currentLocation: '',
    nextDestination: '',
    vehicleInfo: '',
    storageConditions: '',
    qualityNotes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validated, setValidated] = useState(false);
  const [productFound, setProductFound] = useState(null);
  const [searching, setSearching] = useState(false);
  const [fromBlockchain, setFromBlockchain] = useState(false);
  const [metaMaskConnected, setMetaMaskConnected] = useState(false);

  // Testar conexão MetaMask
  const testMetaMaskConnection = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask não está instalado');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('Nenhuma conta conectada');
      }

      const Web3 = (await import('web3')).default;
      const web3 = new Web3(window.ethereum);
      const chainId = await web3.eth.getChainId();
      
      if (Number(chainId) !== 11155111) {
        throw new Error(`Rede incorreta. Conecte à Sepolia (atual: ${chainId})`);
      }

      setMetaMaskConnected(true);
      setError(null);
      setSuccess(`✅ MetaMask conectado! Conta: ${accounts[0].substring(0,6)}...${accounts[0].substring(38)}`);
      
    } catch (error) {
      setMetaMaskConnected(false);
      setError('Erro de conexão MetaMask: ' + error.message);
    }
  };

  // Buscar produto na blockchain
  const searchProduct = async (productId) => {
    if (!productId.trim()) return;
    
    setSearching(true);
    setError(null);
    setProductFound(null);
    
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask não está instalado');
      }

      const Web3 = (await import('web3')).default;
      const web3 = new Web3(window.ethereum);
      
      const { AGRICHAIN_ABI, CONTRACT_ADDRESS } = await import('../contracts/AgriChainABI_Fixed.js');
      const contract = new web3.eth.Contract(AGRICHAIN_ABI, CONTRACT_ADDRESS);
      
      console.log('🔍 Buscando produto na blockchain:', productId);
      const result = await contract.methods.getProduct(productId).call();
      
      if (result && result.id && result.id !== '') {
        // Decodificar informações dos campos
        const categoryParts = result.category.split('|');
        const locationParts = result.location.split('|');
        
        const baseCategory = categoryParts[0] || result.category;
        const expiryDate = categoryParts.find(part => part.startsWith('VAL:'))?.replace('VAL:', '') || 'N/A';
        const quantity = categoryParts.find(part => part.startsWith('QTD:'))?.replace('QTD:', '') || 'N/A';
        
        const baseLocation = locationParts[0] || result.location;
        const harvestDate = locationParts.find(part => part.startsWith('COLHEITA:'))?.replace('COLHEITA:', '') || 'N/A';
        const isOrganic = locationParts.find(part => part.startsWith('ORG:'))?.replace('ORG:', '') === 'SIM';
        
        const product = {
          id: result.id,
          name: result.name,
          category: baseCategory,
          producer: result.producer,
          location: baseLocation,
          expiryDate: expiryDate,
          harvestDate: harvestDate,
          quantity: quantity,
          isOrganic: isOrganic,
          timestamp: new Date(parseInt(result.timestamp) * 1000).toLocaleString('pt-BR')
        };
        
        setProductFound(product);
        setFromBlockchain(true);
        console.log('✅ Produto encontrado na blockchain:', product);
      } else {
        setError('Produto não encontrado na blockchain. Verifique o ID.');
        setFromBlockchain(false);
      }
      
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      setError('Erro ao buscar produto: ' + err.message);
    } finally {
      setSearching(false);
    }
  };

  // Registrar atualização na blockchain
  const registerUpdateInBlockchain = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask não está instalado. Por favor, instale o MetaMask.');
      }

      console.log('🔗 Conectando ao MetaMask...');
      
      // Conectar ao MetaMask com request explícito
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('Nenhuma conta conectada no MetaMask');
      }
      
      console.log('✅ Conectado à conta:', accounts[0]);
      
      const Web3 = (await import('web3')).default;
      const web3 = new Web3(window.ethereum);
      
      // Verificar rede Sepolia com melhor tratamento
      const chainId = await web3.eth.getChainId();
      console.log('🌐 Chain ID atual:', chainId);
      
      if (Number(chainId) !== 11155111) {
        throw new Error(`Rede incorreta. Por favor, conecte à rede Sepolia (Chain ID: 11155111). Rede atual: ${chainId}`);
      }

      const { AGRICHAIN_ABI, CONTRACT_ADDRESS } = await import('../contracts/AgriChainABI_Fixed.js');
      const contract = new web3.eth.Contract(AGRICHAIN_ABI, CONTRACT_ADDRESS);
      
      // Criar ID único para a atualização com timestamp mais preciso
      const updateId = `${formData.productId}-UPD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      // Verificar se o ID já existe (prevenção de duplicatas)
      try {
        const existingProduct = await contract.methods.getProduct(updateId).call();
        if (existingProduct && existingProduct.id) {
          throw new Error('ID de atualização já existe. Tente novamente.');
        }
      } catch (existingError) {
        // Se der erro ao buscar, significa que não existe (o que é bom)
        console.log('✅ ID único confirmado:', updateId);
      }
      
      // Preparar dados da atualização para a blockchain (mais compactos)
      const updateData = {
        id: updateId,
        name: `UPD-${productFound.name.substring(0, 20)}`,
        category: `UPDATE-${formData.productId}`,
        producer: formData.distributorName.substring(0, 30),
        location: `${formData.location.substring(0, 30)}|${formData.nextDestination ? formData.nextDestination.substring(0, 20) : 'N/A'}`
      };
      
      console.log('📦 Registrando atualização na blockchain:', updateData);
      
      // Validar dados antes de enviar
      if (!updateData.id || !updateData.name || !updateData.category || !updateData.producer || !updateData.location) {
        throw new Error('Dados incompletos para registro na blockchain');
      }
      
      // Estimar gas primeiro
      const gasEstimate = await contract.methods.storeProduct(
        updateData.id,
        updateData.name,
        updateData.category,
        updateData.producer,
        updateData.location
      ).estimateGas({ from: accounts[0] });
      
      console.log('Gas estimado:', gasEstimate);
      
      // Converter BigInt para Number e calcular gas com margem
      const gasLimit = Math.floor(Number(gasEstimate) * 1.2);
      
      // Enviar transação com gas estimado + margem
      const transaction = await contract.methods.storeProduct(
        updateData.id,
        updateData.name,
        updateData.category,
        updateData.producer,
        updateData.location
      ).send({ 
        from: accounts[0],
        gas: gasLimit
      });
      
      console.log('✅ Atualização registrada na blockchain:', transaction.transactionHash);
      return {
        success: true,
        transactionHash: transaction.transactionHash,
        blockNumber: transaction.blockNumber,
        updateId: updateId
      };
      
    } catch (error) {
      console.error('❌ Erro ao registrar atualização na blockchain:', error);
      throw error;
    }
  };

  // Função original para buscar produto (mock) - mantida como fallback
  const searchProductMock = async (productId) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts = {
        'PROD-2024-001': {
          id: 'PROD-2024-001',
          name: 'Tomates Cherry',
          category: 'Vegetables',
          producer: 'Fazenda Solar - João Silva',
          farmLocation: 'Campinas, SP',
          harvestDate: '2024-10-01',
          expiryDate: '2024-10-20',
          quantity: '500',
          unit: 'kg'
        },
        'PROD-2024-002': {
          id: 'PROD-2024-002',
          name: 'Alface Hidropônica',
          category: 'Vegetables',
          producer: 'AgroTech - Maria Santos',
          farmLocation: 'Americana, SP',
          harvestDate: '2024-10-05',
          expiryDate: '2024-10-25',
          quantity: '200',
          unit: 'unidades'
        },
        'PROD-2024-003': {
          id: 'PROD-2024-003',
          name: 'Morangos Premium',
          category: 'Fruits',
          producer: 'Sítio Doce Vida - Carlos Oliveira',
          farmLocation: 'Atibaia, SP',
          harvestDate: '2024-10-08',
          expiryDate: '2024-10-30',
          quantity: '150',
          unit: 'kg'
        },
        'PROD-2024-004': {
          id: 'PROD-2024-004',
          name: 'Feijão Orgânico',
          category: 'Grains',
          producer: 'Fazenda Sustentável - Ana Costa',
          farmLocation: 'Ribeirão Preto, SP',
          harvestDate: '2024-09-15',
          expiryDate: '2025-09-15',
          quantity: '1000',
          unit: 'kg'
        }
      };
      
      const product = mockProducts[productId.toUpperCase()];
      
      if (product) {
        setProductFound(product);
        setFromBlockchain(false);
        setError(null);
        
        // Auto-preencher alguns campos baseados no produto encontrado
        const currentDate = new Date().toISOString().slice(0, 16);
        setFormData(prev => ({
          ...prev,
          receivedDate: currentDate,
          location: 'Centro de Distribuição - São Paulo, SP'
        }));
      } else {
        throw new Error('Produto não encontrado');
      }
      
    } catch (err) {
      setError('Produto não encontrado. Tente: PROD-2024-001, PROD-2024-002, PROD-2024-003, ou PROD-2024-004');
      setProductFound(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCpf = (value) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (digits.length <= 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const handleCpfChange = (e) => {
    const formattedValue = formatCpf(e.target.value);
    setFormData(prev => ({
      ...prev,
      distributorCpf: formattedValue
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

    setLoading(true);
    setError(null);

    try {
      // Validar apenas campos essenciais antes de enviar para blockchain
      if (!formData.distributorName.trim()) {
        throw new Error('Nome do distribuidor é obrigatório');
      }
      if (!formData.location.trim()) {
        throw new Error('Localização atual é obrigatória');
      }
      if (!productFound) {
        throw new Error('Produto não encontrado');
      }
      
      // Registrar atualização na blockchain
      console.log('🔗 Registrando atualização na blockchain...');
      const blockchainResult = await registerUpdateInBlockchain();
      
      console.log('Dados de atualização enviados:', {
        ...formData,
        productInfo: productFound,
        timestamp: new Date().toISOString(),
        blockchainTxHash: blockchainResult.transactionHash,
        updateId: blockchainResult.updateId
      });

      setSuccess(`✅ Produto atualizado com sucesso na blockchain!
      📝 Transação: ${blockchainResult.transactionHash}
      🆔 Update ID: ${blockchainResult.updateId}
      📦 Bloco: ${blockchainResult.blockNumber}
      🕐 Data: ${new Date().toLocaleString('pt-BR')}
      📦 Produto: ${productFound.name} (${formData.productId})`);
      setFormData({
        productId: '',
        distributorName: '',
        distributorCpf: '',
        receivedDate: '',
        forwardedDate: '',
        location: '',
        vehicleInfo: '',
        storageConditions: '',
        qualityNotes: '',
        nextDestination: ''
      });
      setProductFound(null);
      setValidated(false);
      
    } catch (error) {
      console.error('❌ Erro completo:', error);
      
      let errorMessage = 'Erro ao atualizar produto: ';
      
      if (error.message.includes('User denied')) {
        errorMessage += 'Transação cancelada pelo usuário';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage += 'Saldo insuficiente para pagar o gas';
      } else if (error.message.includes('reverted')) {
        errorMessage += 'Transação rejeitada pelo contrato. Verifique os dados.';
      } else if (error.message.includes('network')) {
        errorMessage += 'Erro de rede. Verifique sua conexão.';
      } else if (error.message.includes('BigInt')) {
        errorMessage += 'Erro de conversão de dados. Tente novamente.';
      } else if (error.message.includes('MetaMask')) {
        errorMessage += 'Problema com MetaMask. Verifique se está instalado e desbloqueado.';
      } else if (error.message.includes('Chain ID')) {
        errorMessage += 'Rede incorreta. Conecte à rede Sepolia no MetaMask.';
      } else if (error.message.includes('Nenhuma conta')) {
        errorMessage += 'Nenhuma conta conectada. Conecte uma conta no MetaMask.';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-warning text-dark">
              <h4 className="mb-0">
                <i className="bi bi-arrow-repeat me-2"></i>
                Atualizar Produto na Cadeia
                <span className="badge bg-success ms-2">
                  <i className="bi bi-shield-check me-1"></i>
                  Blockchain
                </span>
              </h4>
              <small className="text-muted">
                Para distribuidores e varejistas - Registro na blockchain Sepolia
              </small>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}
              
              {success && (
                <div className="alert alert-success alert-dismissible" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setSuccess(null)}
                  ></button>
                </div>
              )}

              {/* Teste de Conexão MetaMask */}
              <div className="card mb-4 border-info">
                <div className="card-header bg-info text-white">
                  <h6 className="mb-0">
                    <i className="bi bi-shield-check me-2"></i>
                    Conexão Blockchain
                  </h6>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        Teste a conexão com MetaMask e rede Sepolia antes de começar
                      </small>
                    </div>
                    <button 
                      className={`btn ${metaMaskConnected ? 'btn-success' : 'btn-outline-info'}`}
                      onClick={testMetaMaskConnection}
                      disabled={loading}
                    >
                      {metaMaskConnected ? (
                        <>
                          <i className="bi bi-check-circle me-1"></i>
                          Conectado
                        </>
                      ) : (
                        <>
                          <i className="bi bi-wallet2 me-1"></i>
                          Testar MetaMask
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Busca de Produto */}
              <div className="card mb-4 border-primary">
                <div className="card-header bg-primary text-white">
                  <h6 className="mb-0">1. Buscar Produto</h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">ID do Produto</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        name="productId"
                        value={formData.productId}
                        onChange={handleInputChange}
                        placeholder="Digite o ID do produto (ex: PROD-2024-001)"
                        disabled={loading}
                      />
                      <button 
                        className="btn btn-primary"
                        type="button"
                        onClick={() => searchProduct(formData.productId)}
                        disabled={loading || !formData.productId.trim()}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                          'Buscar'
                        )}
                      </button>
                    </div>
                    <div className="form-text">
                      Insira o ID do produto para verificar suas informações na blockchain
                      <br />
                      <small className="text-success">
                        <i className="bi bi-shield-check me-1"></i>
                        <strong>Busca prioritária:</strong> Blockchain Sepolia (dados reais)
                      </small>
                      <br />
                      <small className="text-primary">
                        <strong>IDs para teste (fallback):</strong> PROD-2024-001, PROD-2024-002, PROD-2024-003, PROD-2024-004
                      </small>
                    </div>
                  </div>

                  {productFound && (
                    <div className={`alert ${fromBlockchain ? 'alert-success' : 'alert-info'}`}>
                      <div className="d-flex justify-content-between align-items-start">
                        <h6>
                          Produto Encontrado:
                          {fromBlockchain ? (
                            <span className="badge bg-success ms-2">
                              <i className="bi bi-shield-check me-1"></i>
                              Blockchain
                            </span>
                          ) : (
                            <span className="badge bg-secondary ms-2">
                              <i className="bi bi-database me-1"></i>
                              Mock Data
                            </span>
                          )}
                        </h6>
                      </div>
                      <strong>{productFound.name}</strong><br />
                      <div className="row mt-2">
                        <div className="col-md-6">
                          <small>
                            <strong>Categoria:</strong> {productFound.category}<br />
                            <strong>Produtor:</strong> {productFound.producer}<br />
                            <strong>Quantidade:</strong> {productFound.quantity} {productFound.unit}
                          </small>
                        </div>
                        <div className="col-md-6">
                          <small>
                            <strong>Colheita:</strong> {productFound.harvestDate ? new Date(productFound.harvestDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'N/A'}<br />
                            <strong>Validade:</strong> {productFound.expiryDate ? new Date(productFound.expiryDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'N/A'}
                          </small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Formulário de Atualização */}
              {productFound && (
                <form className={`needs-validation ${validated ? 'was-validated' : ''}`} noValidate onSubmit={handleSubmit}>
                  <div className="card mb-4 border-warning">
                    <div className="card-header bg-warning text-dark">
                      <h6 className="mb-0">2. Informações do Distribuidor/Varejista</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Nome do Distribuidor/Varejista *</label>
                            <input
                              type="text"
                              className="form-control"
                              name="distributorName"
                              value={formData.distributorName}
                              onChange={handleInputChange}
                              placeholder="Nome da empresa ou pessoa"
                              required
                              disabled={loading}
                            />
                            <div className="invalid-feedback">
                              Por favor, informe o nome do distribuidor/varejista.
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">CPF do Responsável *</label>
                            <input
                              type="text"
                              className="form-control"
                              name="distributorCpf"
                              value={formData.distributorCpf}
                              onChange={handleCpfChange}
                              placeholder="000.000.000-00"
                              maxLength={14}
                              required
                              disabled={loading}
                            />
                            <div className="invalid-feedback">
                              Por favor, informe um CPF válido.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-4 border-info">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">3. Informações de Movimentação</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Data de Recebimento *</label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              name="receivedDate"
                              value={formData.receivedDate}
                              onChange={handleInputChange}
                              required
                              disabled={loading}
                            />
                            <div className="invalid-feedback">
                              Por favor, informe a data de recebimento.
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Data de Repasse</label>
                            <input
                              type="datetime-local"
                              className="form-control"
                              name="forwardedDate"
                              value={formData.forwardedDate}
                              onChange={handleInputChange}
                              disabled={loading}
                            />
                            <div className="form-text">
                              Deixe em branco se ainda não foi repassado
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Localização Atual *</label>
                            <input
                              type="text"
                              className="form-control"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              placeholder="Cidade, Estado (ex: São Paulo, SP)"
                              required
                              disabled={loading}
                            />
                            <div className="invalid-feedback">
                              Por favor, informe a localização atual.
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Próximo Destino</label>
                            <input
                              type="text"
                              className="form-control"
                              name="nextDestination"
                              value={formData.nextDestination}
                              onChange={handleInputChange}
                              placeholder="Para onde será enviado"
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mb-4 border-secondary">
                    <div className="card-header bg-secondary text-white">
                      <h6 className="mb-0">4. Informações Adicionais</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Informações do Veículo</label>
                            <input
                              type="text"
                              className="form-control"
                              name="vehicleInfo"
                              value={formData.vehicleInfo}
                              onChange={handleInputChange}
                              placeholder="Placa, tipo de veículo"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Condições de Armazenamento</label>
                            <input
                              type="text"
                              className="form-control"
                              name="storageConditions"
                              value={formData.storageConditions}
                              onChange={handleInputChange}
                              placeholder="Refrigerado, temperatura ambiente, etc."
                              disabled={loading}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Observações de Qualidade</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          name="qualityNotes"
                          value={formData.qualityNotes}
                          onChange={handleInputChange}
                          placeholder="Observações sobre o estado do produto, qualidade, etc."
                          disabled={loading}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-warning btn-lg text-dark"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Atualizando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cloud-upload me-2"></i>
                          Atualizar Produto
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              {!productFound && (
                <div className="alert alert-info text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  Digite o ID do produto acima para começar a atualização
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;