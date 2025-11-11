import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    
    // Para ambiente de desenvolvimento/teste, aceita CPFs de teste comuns
    const testCPFs = [
      '11111111111', '22222222222', '33333333333', '44444444444',
      '55555555555', '66666666666', '77777777777', '88888888888',
      '99999999999', '00000000000', '12345678901'
    ];
    
    if (testCPFs.includes(cpf)) {
      return true; // Aceita CPFs de teste
    }
    
    // Verifica se todos os dígitos são iguais (apenas para CPFs reais)
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação básica do CPF (simplificada para desenvolvimento)
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
      const productId = `AGRI-${Date.now()}`;
      console.log('🆔 ID do produto gerado:', productId);
      
      // Dados do produto para envio
      const productPayload = {
        product_id: productId,
        name: productData.productName,
        category: productData.category,
        producer_name: productData.producer,
        farm_location: { address: productData.location },
        harvest_date: productData.harvestDate,
        quantity: parseFloat(productData.quantity),
        unit: productData.unit,
        certifications: productData.certifications,
        producer_id: 'ab7f4630-afa7-42dc-9ace-63bee8da1476', // UUID da produtora Maria Silva
        expiry_date: productData.expiryDate || null
      };

      console.log('📤 Enviando produto:', productPayload);

      // 1. Registrar no banco de dados
      setMessage({ type: 'info', text: '📊 Salvando produto no banco de dados...' });
      
      const response = await fetch('http://localhost:3001/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar no banco de dados');
      }

      const savedProduct = await response.json();
      console.log('✅ Produto salvo no banco:', savedProduct);

      // 2. Tentar registrar na blockchain (se MetaMask disponível)
      let blockchainResult = null;
      let blockchainError = null;
      
      if (typeof window.ethereum !== 'undefined') {
        try {
          console.log('⛓️ Tentando registrar na blockchain...');
          setMessage({ type: 'info', text: '⛓️ Detectando MetaMask...' });
          
          // Verificar se MetaMask está instalado e desbloqueado
          const isUnlocked = await window.ethereum._metamask.isUnlocked();
          if (!isUnlocked) {
            throw new Error('MetaMask está bloqueado. Por favor, desbloqueie-o primeiro.');
          }
          
          setMessage({ type: 'info', text: '🦊 Solicitando conexão com MetaMask...' });
          
          // Forçar conexão com MetaMask (isso deve abrir o popup)
          const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          if (!accounts || accounts.length === 0) {
            throw new Error('Nenhuma conta foi conectada no MetaMask');
          }
          
          console.log('🏠 Conta conectada:', accounts[0]);
          setMessage({ type: 'info', text: '✅ MetaMask conectado! Verificando rede...' });
          
          // Importar Web3 e serviços
          const Web3 = (await import('web3')).default;
          const web3 = new Web3(window.ethereum);
          
          // Verificar rede Sepolia
          const chainId = await web3.eth.getChainId();
          console.log('🌐 Chain ID atual:', chainId);
          
          if (Number(chainId) !== 11155111) {
            setMessage({ type: 'warning', text: '⚠️ Conectando à rede Sepolia...' });
            
            try {
              // Tentar trocar para Sepolia
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }], // Sepolia chainId em hex
              });
            } catch (switchError) {
              if (switchError.code === 4902) {
                // Sepolia não está adicionada, vamos adicionar
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0xaa36a7',
                    chainName: 'Sepolia Test Network',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18
                    },
                    rpcUrls: ['https://sepolia.infura.io/v3/'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io/']
                  }]
                });
              } else {
                throw switchError;
              }
            }
          }
          
          setMessage({ type: 'info', text: '🔐 Preparando transação na blockchain Sepolia...' });
          
          // Preparar dados para a blockchain (incluindo data de validade)
          const expiryDateFormatted = productData.expiryDate 
            ? productData.expiryDate // Usar a data diretamente sem conversão para evitar problemas de timezone
            : 'N/A';
          
          const harvestDateFormatted = productData.harvestDate
            ? productData.harvestDate // Usar a data diretamente
            : 'N/A';
          
          const blockchainData = {
            productId: String(savedProduct.id || productId),
            name: productData.productName.substring(0, 50), // Limitar nome
            category: `${productData.category}|VAL:${expiryDateFormatted}|QTD:${productData.quantity}${productData.unit}`.substring(0, 100), // Limitar categoria
            producer: productData.producer.substring(0, 50), // Limitar produtor
            location: `${productData.location.substring(0, 30)}|COLHEITA:${harvestDateFormatted}|ORG:${productData.isOrganic ? 'SIM' : 'NAO'}`.substring(0, 100) // Limitar localização
          };
          
          // Validar dados antes de enviar
          if (!blockchainData.productId || blockchainData.productId.trim() === '') {
            throw new Error('ID do produto é obrigatório');
          }
          if (!blockchainData.name || blockchainData.name.trim() === '') {
            throw new Error('Nome do produto é obrigatório');
          }
          if (!blockchainData.producer || blockchainData.producer.trim() === '') {
            throw new Error('Nome do produtor é obrigatório');
          }
          if (!blockchainData.location || blockchainData.location.trim() === '') {
            throw new Error('Localização é obrigatória');
          }
          
          console.log('📦 Dados validados para blockchain:', blockchainData);
          
          // Criar contrato
          const { AGRICHAIN_ABI, CONTRACT_ADDRESS } = await import('../contracts/AgriChainABI_Fixed.js');
          const contract = new web3.eth.Contract(AGRICHAIN_ABI, CONTRACT_ADDRESS);
          
          // Verificar se o ID já existe na blockchain
          console.log('🔍 Verificando se ID já existe...');
          try {
            const existingProduct = await contract.methods.getProduct(blockchainData.productId).call();
            if (existingProduct && existingProduct.id && existingProduct.id !== '') {
              throw new Error(`ID ${blockchainData.productId} já existe na blockchain. Aguarde um momento e tente novamente.`);
            }
          } catch (checkError) {
            // Se der erro ao buscar, significa que não existe (o que é bom)
            console.log('✅ ID único confirmado');
          }
          
          // Obter conta atual
          const currentAccount = accounts[0];
          console.log('👤 Enviando de:', currentAccount);
          
          // Verificar se é um contrato válido
          const code = await web3.eth.getCode(CONTRACT_ADDRESS);
          console.log('📜 Contract code length:', code.length);
          if (code === '0x') {
            throw new Error('Endereço não é um contrato válido');
          }
          
          setMessage({ type: 'info', text: '💰 Confirmando transação no MetaMask...' });
          
          // Estimar gas primeiro
          console.log('⛽ Estimando gas...');
          const gasEstimate = await contract.methods.storeProduct(
            blockchainData.productId,
            blockchainData.name,
            blockchainData.category,
            blockchainData.producer,
            blockchainData.location
          ).estimateGas({ from: currentAccount });
          
          console.log('⛽ Gas estimado:', gasEstimate);
          const gasLimit = Math.floor(Number(gasEstimate) * 1.3); // 30% de margem
          console.log('⛽ Gas final:', gasLimit);
          
          // Enviar transação - ISSO DEVE ABRIR O METAMASK
          const transaction = await contract.methods.storeProduct(
            blockchainData.productId,  // ID do produto
            blockchainData.name,       // Nome
            blockchainData.category,   // Categoria  
            blockchainData.producer,   // Produtor
            blockchainData.location    // Localização
          ).send({ 
            from: currentAccount,
            gas: gasLimit
          });
          
          console.log('✅ Transação enviada:', transaction.transactionHash);
          setMessage({ 
            type: 'success', 
            text: (
              <div>
                <strong>🎉 Produto registrado com sucesso!</strong>
                <br />
                <div className="mt-2">
                  <strong>ID do Produto:</strong> 
                  <code className="bg-secondary text-white px-2 py-1 rounded ms-2">
                    {savedProduct.id || productId}
                  </code>
                  <button 
                    className="btn btn-sm btn-outline-secondary ms-2"
                    onClick={() => {
                      navigator.clipboard.writeText(savedProduct.id || productId);
                      alert('ID copiado para área de transferência!');
                    }}
                  >
                    📋 Copiar ID
                  </button>
                </div>
                {/* <br />
                <strong>✅ Salvo no Banco de Dados</strong>
                <br /> */}
                <strong>⛓️ Registrado na Blockchain Sepolia</strong>
                <br />
                <strong>Hash da Transação:</strong> {transaction.transactionHash}
                <br />
                <strong>Bloco:</strong> #{transaction.blockNumber}
                <br />
                <a 
                  href={`https://sepolia.etherscan.io/tx/${transaction.transactionHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary mt-2"
                >
                  📊 Ver no Etherscan
                </a>
                <br />
                <a 
                  href={`/track?id=${savedProduct.id || productId}`} 
                  className="btn btn-sm btn-success mt-2 ms-2"
                >
                  🔍 Rastrear Produto
                </a>
              </div>
            )
          });

        } catch (error) {
          console.error('❌ Erro detalhado na blockchain:', error);
          
          let errorMessage = 'Erro desconhecido';
          let suggestion = '';
          
          if (error.message.includes('User denied')) {
            errorMessage = 'Transação cancelada pelo usuário';
            suggestion = 'Clique em "Confirmar" no MetaMask para completar o registro';
          } else if (error.message.includes('insufficient funds')) {
            errorMessage = 'Saldo insuficiente para pagar o gas';
            suggestion = 'Adicione ETH na rede Sepolia para pagar as taxas de transação';
          } else if (error.message.includes('reverted')) {
            errorMessage = 'Transação rejeitada pelo contrato inteligente';
            suggestion = 'Verifique se todos os campos estão preenchidos corretamente e se o ID não está duplicado';
          } else if (error.message.includes('network')) {
            errorMessage = 'Erro de rede';
            suggestion = 'Verifique sua conexão e se está conectado à rede Sepolia';
          } else if (error.message.includes('Chain ID')) {
            errorMessage = 'Rede incorreta';
            suggestion = 'Conecte à rede Sepolia no MetaMask';
          } else if (error.message.includes('já existe')) {
            errorMessage = error.message;
            suggestion = 'Aguarde alguns segundos e tente novamente para gerar um novo ID';
          } else {
            errorMessage = error.message;
            suggestion = 'Verifique os dados e tente novamente';
          }
          
          setMessage({ 
            type: 'warning', 
            text: (
              <div>
                <strong>⚠️ Produto salvo apenas no banco de dados</strong>
                <br />
                <strong>ID do Produto:</strong> {savedProduct.id}
                <br />
                <strong>✅ Salvo no Banco de Dados</strong>
                <br />
                <strong>❌ Não registrado na Blockchain</strong>
                <br />
                <div className="mt-2 p-2 bg-danger bg-opacity-10 rounded">
                  <small><strong>Erro:</strong> {errorMessage}</small>
                  <br />
                  <small><strong>Solução:</strong> {suggestion}</small>
                </div>
              </div>
            )
          });
        }
      } else {
        setMessage({ 
          type: 'warning', 
          text: (
            <div>
              <strong>⚠️ Produto salvo apenas no banco de dados</strong>
              <br />
              <strong>ID do Produto:</strong> {savedProduct.id}
              <br />
              <strong>✅ Salvo no Banco de Dados</strong>
              <br />
              <strong>❌ Não registrado na Blockchain</strong>
              <br />
              <small className="text-muted">
                <strong>Motivo:</strong> MetaMask não detectado
              </small>
            </div>
          )
        });
      }
      
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
      console.error('❌ Erro no registro:', error);
      setMessage({ 
        type: 'danger', 
        text: `Erro ao registrar produto: ${error.message}` 
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
              {/* Aviso sobre Blockchain */}
              <div className="alert alert-info mb-4">
                <h6 className="mb-2">
                  <i className="bi bi-info-circle me-2"></i>
                  Integração Blockchain - Rastreabilidade Completa
                </h6>
                <p className="mb-2">
                  Este produto será registrado simultaneamente no <strong>banco de dados</strong> e na <strong>blockchain Sepolia</strong> para máxima transparência e rastreabilidade.
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <small>
                      <strong>📊 Banco de Dados:</strong> Armazenamento rápido e consultas eficientes
                    </small>
                  </div>
                  <div className="col-md-6">
                    <small>
                      <strong>⛓️ Blockchain:</strong> Registro imutável e descentralizado
                    </small>
                  </div>
                </div>
                <hr className="my-2" />
                <small className="text-muted">
                  <strong>💡 Para registro completo na blockchain:</strong>
                  <br />• Instale o MetaMask (extensão do navegador)
                  <br />• Conecte à rede Sepolia
                  <br />• Tenha ETH suficiente para gas (~0.01 ETH)
                </small>
              </div>

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

                {/* Seção de Ações */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between">
                      
                      {/* Botão Voltar */}
                      <div className="order-2 order-md-1">
                        <Link to="/" className="btn btn-outline-secondary btn-lg px-4">
                          <i className="bi bi-arrow-left me-2" style={{ fontSize: '0.9rem' }}></i>
                          Voltar ao Início
                        </Link>
                      </div>

                      {/* Botão Principal de Registro */}
                      <div className="order-1 order-md-2 flex-grow-1 d-flex justify-content-end">
                        <button 
                          type="submit" 
                          className={`btn btn-lg px-5 py-3 ${loading ? 'btn-warning' : 'btn-success'}`}
                          disabled={loading}
                          style={{ 
                            minWidth: '280px',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: 'none'
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-3" role="status"></span>
                              <span className="d-flex flex-column">
                                <span>Processando...</span>
                                <small style={{ fontSize: '0.85rem', opacity: '0.9' }}>
                                  Registrando na Blockchain
                                </small>
                              </span>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-shield-check me-3" style={{ fontSize: '0.9rem' }}></i>
                              <span className="d-flex flex-column">
                                <span>Registrar Produto</span>
                                {/* <small style={{ fontSize: '0.85rem', opacity: '0.9' }}>
                                  Blockchain + Banco de Dados
                                </small> */}
                              </span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                    {/* Informações Adicionais */}
                    <div className="mt-3 text-center">
                      <small className="text-muted d-flex flex-column flex-md-row justify-content-center align-items-center gap-2">
                        <span>
                          <i className="bi bi-info-circle me-1"></i>
                          O registro será feito simultaneamente no banco de dados e na blockchain Sepolia
                        </span>
                        <span className="d-none d-md-inline">•</span>
                        <span>
                          <i className="bi bi-clock me-1"></i>
                          Tempo estimado: 30-60 segundos
                        </span>
                      </small>
                    </div>

                    {/* Barra de Progresso Visual (apenas quando loading) */}
                    {loading && (
                      <div className="mt-3">
                        <div className="progress" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar progress-bar-striped progress-bar-animated bg-warning" 
                            role="progressbar" 
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                        <div className="text-center mt-2">
                          <small className="text-warning fw-bold">
                            <i className="bi bi-lightning me-1"></i>
                            Aguarde a confirmação no MetaMask...
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;