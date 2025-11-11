import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TrackPage = () => {
  const [searchId, setSearchId] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [blockchainData, setBlockchainData] = useState(null);
  const [loadingStep, setLoadingStep] = useState('');

  // Função para buscar atualizações de um produto específico
  const searchProductUpdates = async (productId, contract) => {
    const updates = [];
    
    try {
      console.log('🔍 Iniciando busca de atualizações para:', productId);
      
      // Verificar cache local primeiro
      const cacheKey = `updates_${productId}`;
      const cachedUpdates = localStorage.getItem(cacheKey);
      if (cachedUpdates) {
        console.log('📦 Usando atualizações do cache local');
        const parsed = JSON.parse(cachedUpdates);
        // Verificar se o cache não é muito antigo (30 minutos)
        if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
          return parsed.updates.map(u => ({
            ...u,
            timestamp: new Date(u.timestamp)
          }));
        }
      }
      
      // Busca mais focada e rápida
      const now = Date.now();
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000); // Buscar apenas última semana
      
      // Limitar tentativas para evitar carregamento infinito
      const maxAttempts = 20; // Reduzido de 100 para 20
      const timeStep = 6 * 60 * 60 * 1000; // 6 horas
      
      // Padrões mais específicos baseados no UpdatePage
      const patterns = [
        (ts) => `${productId}-UPD-${ts}`,
        (ts) => `UPD-${productId}-${ts}`
      ];
      
      // Busca otimizada
      let attempts = 0;
      for (let i = 0; i < maxAttempts && attempts < 50; i++) {
        const timestamp = Math.floor(oneWeekAgo + (i * timeStep));
        
        for (const patternFn of patterns) {
          if (attempts >= 50) break; // Limite absoluto de tentativas
          
          const updateId = patternFn(timestamp);
          attempts++;
          
          try {
            const updateResult = await contract.methods.getProduct(updateId).call();
            
            if (updateResult && updateResult.id && updateResult.id !== '') {
              // Verificar se é realmente uma atualização deste produto
              const isUpdate = 
                updateResult.category.includes('UPDATE') ||
                updateResult.category.includes(productId) ||
                updateResult.name.includes(productId) ||
                updateResult.id.includes(productId);
              
              if (isUpdate) {
                // Verificar se já foi adicionada (evitar duplicatas)
                const alreadyExists = updates.some(u => u.id === updateResult.id);
                if (!alreadyExists) {
                  console.log('✅ Atualização encontrada:', updateResult.id);
                  
                  // Decodificar dados da atualização
                  const locationParts = updateResult.location.split('|');
                  const currentLocation = locationParts[0] || updateResult.location;
                  const nextDestination = locationParts.find(part => part.startsWith('DESTINO:'))?.replace('DESTINO:', '') || null;
                  
                  updates.push({
                    id: updateResult.id,
                    distributor: updateResult.producer,
                    location: currentLocation,
                    nextDestination: nextDestination,
                    timestamp: new Date(parseInt(updateResult.timestamp) * 1000),
                    category: updateResult.category,
                    fullData: updateResult
                  });
                }
              }
            }
          } catch (err) {
            // Falha silenciosa - continuar tentando
          }
        }
      }
      
      // Ordenar por timestamp
      updates.sort((a, b) => a.timestamp - b.timestamp);
      console.log(`📋 Total de atualizações encontradas para ${productId}:`, updates.length);
      
      // Salvar no cache local para otimizar próximas buscas
      if (updates.length > 0) {
        const cacheData = {
          timestamp: Date.now(),
          updates: updates.map(u => ({
            ...u,
            timestamp: u.timestamp.getTime()
          }))
        };
        localStorage.setItem(`updates_${productId}`, JSON.stringify(cacheData));
        console.log('💾 Atualizações salvas no cache local');
      }
      
    } catch (error) {
      console.log('⚠️ Erro ao buscar atualizações:', error.message);
    }
    
    return updates;
  };

  // Função para criar timeline completa incluindo atualizações
  const createCompleteTimeline = async (result, updates, baseLocation, isOrganic, formatDateSafe, expiryDate, status) => {
    const timeline = [];
    
    // 1. Colheita (evento inicial)
    const harvestDate = result.location.split('|').find(part => part.startsWith('COLHEITA:'))?.replace('COLHEITA:', '') || 'N/A';
    timeline.push({
      step: 'Colheita',
      date: formatDateSafe(harvestDate),
      time: '06:00',
      location: baseLocation,
      responsible: result.producer,
      status: 'Concluído',
      description: `Colheita de ${result.name} - ${isOrganic ? 'Produto Orgânico' : 'Produto Convencional'}`,
      type: 'harvest'
    });
    
    // 2. Registro na Blockchain
    timeline.push({
      step: 'Registro na Blockchain',
      date: new Date(parseInt(result.timestamp) * 1000).toLocaleDateString('pt-BR'),
      time: new Date(parseInt(result.timestamp) * 1000).toLocaleTimeString('pt-BR'),
      location: baseLocation,
      responsible: result.producer,
      status: 'Concluído',
      description: `Produto registrado no contrato inteligente na rede Sepolia - Validade: ${formatDateSafe(expiryDate)}`,
      type: 'blockchain'
    });
    
    // 3. Adicionar atualizações de distribuição
    updates.forEach((update, index) => {
      timeline.push({
        step: `Distribuição ${index + 1}`,
        date: update.timestamp.toLocaleDateString('pt-BR'),
        time: update.timestamp.toLocaleTimeString('pt-BR'),
        location: update.location,
        responsible: update.distributor,
        status: 'Concluído',
        description: `🚚 Produto movimentado por ${update.distributor}${update.nextDestination ? ` - Destino: ${update.nextDestination}` : ''}`,
        type: 'distribution',
        nextDestination: update.nextDestination
      });
    });
    
    // 4. Status atual
    timeline.push({
      step: status === 'Vencido' ? 'Produto Vencido' : 'Disponível para Distribuição',
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR'),
      location: updates.length > 0 ? updates[updates.length - 1].location : baseLocation,
      responsible: updates.length > 0 ? updates[updates.length - 1].distributor : result.producer,
      status: status === 'Vencido' ? 'Vencido' : 'Disponível',
      description: status === 'Vencido' 
        ? `⚠️ Produto ultrapassou a data de validade (${formatDateSafe(expiryDate)})`
        : `Produto pronto para distribuição e venda - Válido até ${formatDateSafe(expiryDate)}`,
      type: 'current'
    });
    
    return timeline;
  };

  // Função para buscar produto na blockchain e suas atualizações
  const searchBlockchainProduct = async (productId) => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask não está instalado');
      }

      setLoadingStep('Conectando ao Web3...');
      const Web3 = (await import('web3')).default;
      const web3 = new Web3(window.ethereum);
      
      const { AGRICHAIN_ABI, CONTRACT_ADDRESS } = await import('../contracts/AgriChainABI_Fixed.js');
      const contract = new web3.eth.Contract(AGRICHAIN_ABI, CONTRACT_ADDRESS);
      
      console.log('🔍 Buscando produto na blockchain:', productId);
      setLoadingStep('Buscando dados do produto...');
      
      // Adicionar timeout para a busca
      const searchTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na busca')), 15000) // 15 segundos
      );
      
      const searchProduct = contract.methods.getProduct(productId).call();
      
      const result = await Promise.race([searchProduct, searchTimeout]);
      
      if (result && result.id && result.id !== '') {
        console.log('✅ Produto encontrado, buscando atualizações...');
        setLoadingStep('Buscando atualizações de distribuição...');
        
        // Buscar atualizações com timeout menor
        const updatesTimeout = new Promise((resolve) => 
          setTimeout(() => resolve([]), 10000) // 10 segundos máximo para atualizações
        );
        
        const updatesSearch = searchProductUpdates(productId, contract);
        const updates = await Promise.race([updatesSearch, updatesTimeout]);
        
        setLoadingStep('Processando dados...');
        
        // Decodificar informações extras dos campos
        const categoryParts = result.category.split('|');
        const locationParts = result.location.split('|');
        
        const baseCategory = categoryParts[0] || result.category;
        const expiryDate = categoryParts.find(part => part.startsWith('VAL:'))?.replace('VAL:', '') || 'N/A';
        const quantity = categoryParts.find(part => part.startsWith('QTD:'))?.replace('QTD:', '') || 'N/A';
        
        const baseLocation = locationParts[0] || result.location;
        const harvestDate = locationParts.find(part => part.startsWith('COLHEITA:'))?.replace('COLHEITA:', '') || 'N/A';
        const isOrganic = locationParts.find(part => part.startsWith('ORG:'))?.replace('ORG:', '') === 'SIM';
        
        // Calcular status baseado na data de validade
        let status = 'Disponível';
        if (expiryDate !== 'N/A') {
          const today = new Date();
          const expiry = new Date(expiryDate + 'T00:00:00');
          if (expiry < today) {
            status = 'Vencido';
          } else if ((expiry - today) / (1000 * 60 * 60 * 24) <= 7) {
            status = 'Próximo ao Vencimento';
          }
        }
        
        // Função para converter data sem problemas de timezone
        const formatDateSafe = (dateStr) => {
          if (!dateStr || dateStr === 'N/A') return 'N/A';
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
          return dateStr;
        };
        
        setLoadingStep('Finalizando...');
        
        const blockchainProduct = {
          id: result.id,
          name: result.name,
          category: baseCategory,
          producer: result.producer,
          location: baseLocation,
          producerAddress: result.producerAddress,
          timestamp: new Date(parseInt(result.timestamp) * 1000).toLocaleString('pt-BR'),
          expiryDate: formatDateSafe(expiryDate),
          harvestDate: formatDateSafe(harvestDate),
          quantity: quantity,
          isOrganic: isOrganic,
          status: status,
          // Criar timeline baseado nos dados da blockchain e atualizações
          timeline: await createCompleteTimeline(result, updates || [], baseLocation, isOrganic, formatDateSafe, expiryDate, status),
          certifications: isOrganic ? ['Rastreado na Blockchain', 'Verificado', 'Orgânico'] : ['Rastreado na Blockchain', 'Verificado'],
          createdAt: new Date(parseInt(result.timestamp) * 1000).toLocaleDateString('pt-BR')
        };
        
        setBlockchainData(blockchainProduct);
        setProduct(blockchainProduct);
        console.log('✅ Produto encontrado na blockchain:', blockchainProduct);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao buscar na blockchain:', error);
      if (error.message === 'Timeout na busca') {
        setError('Busca demorou muito. Tente novamente ou verifique sua conexão.');
      }
      setBlockchainData(null);
      return false;
    }
  };

  // Sistema de produtos similares ao ConsumerPage
  const mockProducts = {
    'PROD-2024-001': {
      id: 'PROD-2024-001',
      name: 'Tomates Orgânicos',
      category: 'Vegetables',
      producer: 'Fazenda Verde - João Silva',
      location: 'Holambra, SP',
      harvestDate: '2024-03-15',
      expiryDate: '2024-04-15',
      status: 'Vencido',
      certifications: ['Orgânico', 'Rastreável'],
      quantity: '500 kg',
      createdAt: '2024-03-15',
      timeline: [
        {
          step: 'Colheita',
          date: '2024-03-15',
          time: '06:30',
          location: 'Fazenda Verde - Holambra, SP',
          responsible: 'João Silva',
          status: 'Concluído',
          description: 'Colheita manual dos tomates orgânicos'
        },
        {
          step: 'Processamento',
          date: '2024-03-15',
          time: '14:00',
          location: 'Centro de Processamento - Holambra, SP',
          responsible: 'Equipe Verde',
          status: 'Concluído',
          description: 'Lavagem, seleção e embalagem'
        }
      ]
    },
    'PROD-2024-002': {
      id: 'PROD-2024-002',
      name: 'Alface Hidropônica',
      category: 'Vegetables',
      producer: 'AgroTech - Maria Santos',
      location: 'Americana, SP',
      harvestDate: '2024-10-05',
      expiryDate: '2024-10-25',
      status: 'Em Distribuição',
      certifications: ['Hidropônico', 'Livre de Agrotóxicos'],
      quantity: '200 unidades',
      createdAt: '2024-10-05',
      timeline: [
        {
          step: 'Colheita',
          date: '2024-10-05',
          time: '07:00',
          location: 'Estufa AgroTech - Americana, SP',
          responsible: 'Maria Santos',
          status: 'Concluído',
          description: 'Colheita da alface hidropônica'
        },
        {
          step: 'Distribuição',
          date: '2024-10-06',
          time: '09:00',
          location: 'Centro de Distribuição - São Paulo, SP',
          responsible: 'LogiTrans',
          status: 'Em Andamento',
          description: 'Transporte refrigerado para varejistas'
        }
      ]
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Digite um ID de produto válido');
      return;
    }

    setLoading(true);
    setLoadingStep('Conectando à blockchain...');
    setError('');
    setProduct(null);
    setBlockchainData(null);

    try {
      // 1. Primeiro tenta buscar na blockchain (prioridade)
      console.log('🔍 Buscando produto:', searchId);
      setLoadingStep('Buscando produto na blockchain...');
      const foundInBlockchain = await searchBlockchainProduct(searchId);
      
      if (foundInBlockchain) {
        console.log('✅ Produto encontrado na blockchain!');
        setLoadingStep('Produto encontrado!');
        return; // Se encontrou na blockchain, não precisa buscar em outros lugares
      }
      
      // 2. Se não encontrou na blockchain, buscar nos produtos mock para demonstração
      setLoadingStep('Buscando em dados simulados...');
      const foundProduct = mockProducts[searchId.toUpperCase()];
      if (foundProduct) {
        setProduct(foundProduct);
        console.log('✅ Produto encontrado na simulação!');
        setLoadingStep('Produto encontrado na simulação!');
      } else {
        setError(`Produto "${searchId}" não encontrado. 
        
💡 Dicas:
- Verifique se o ID está correto (ex: AGRI-1729006123456)
- Use IDs de produtos registrados na blockchain
- Para teste, tente: PROD-2024-001 ou PROD-2024-002`);
      }
      
    } catch (err) {
      console.error('Erro na busca:', err);
      setError('Erro ao buscar produto. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'concluído': return 'success';
      case 'em andamento': return 'primary';
      case 'pendente': return 'warning';
      case 'entregue': return 'success';
      case 'em distribuição': return 'info';
      case 'disponível': return 'success';
      case 'vencido': return 'danger';
      case 'próximo ao vencimento': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-search me-2"></i>Rastreamento Avançado de Produtos
              </h4>
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-8">
                  <label className="form-label fw-bold">
                    <i className="bi bi-upc-scan me-1"></i>ID do Produto
                  </label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Digite o código do produto (ex: PROD-2024-001)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button 
                    className="btn btn-primary btn-lg w-100 me-2" 
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {loadingStep || 'Buscando...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>Buscar
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}

              {!product && !loading && !error && (
                <div className="text-center py-5">
                  <i className="bi bi-box-seam text-muted" style={{fontSize: '5rem'}}></i>
                  <h5 className="text-muted mt-3">Digite o ID do produto para rastreamento</h5>
                  <p className="text-muted mb-3">
                    Produtos na blockchain terão IDs como: <code>AGRI-1729006123456</code>
                  </p>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSearchId('PROD-2024-001')}
                    >
                      🥕 Teste: Tomates Orgânicos
                    </button>
                    <button 
                      className="btn btn-outline-success btn-sm"
                      onClick={() => setSearchId('PROD-2024-002')}
                    >
                      🥬 Teste: Alface Hidropônica
                    </button>
                    {product && (
                      <button 
                        className="btn btn-outline-warning btn-sm"
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const Web3 = (await import('web3')).default;
                            const web3 = new Web3(window.ethereum);
                            const { AGRICHAIN_ABI, CONTRACT_ADDRESS } = await import('../contracts/AgriChainABI_Fixed.js');
                            const contract = new web3.eth.Contract(AGRICHAIN_ABI, CONTRACT_ADDRESS);
                            const updates = await searchProductUpdates(product.id, contract);
                            console.log('🔍 Busca forçada de atualizações:', updates);
                            alert(`Encontradas ${updates.length} atualizações. Verifique o console para detalhes.`);
                          } catch (error) {
                            console.error('Erro na busca:', error);
                            alert('Erro na busca: ' + error.message);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        disabled={loading}
                      >
                        🔍 Debug: Buscar Atualizações
                      </button>
                    )}
                  </div>
                  <p className="text-muted mt-3 small">
                    💡 Para produtos reais registrados na blockchain, use o ID gerado no registro
                  </p>
                </div>
              )}

              {product && (
                <div className="mt-4">
                  {/* Banner especial para produtos da blockchain */}
                  {blockchainData && (
                    <div className="alert alert-success border-2 border-success mb-4">
                      <h6 className="alert-heading">
                        <i className="bi bi-shield-check me-2"></i>
                        ⛓️ Produto Autenticado na Blockchain Sepolia
                      </h6>
                      <div className="row g-3 mt-2">
                        <div className="col-md-4">
                          <small className="text-muted d-block">ID na Blockchain</small>
                          <code className="text-success">{blockchainData.id}</code>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted d-block">Endereço do Produtor</small>
                          <code className="text-primary">{blockchainData.producerAddress.substring(0, 10)}...</code>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted d-block">Registro</small>
                          <small>{blockchainData.timestamp}</small>
                        </div>
                      </div>
                      <hr className="my-3" />
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check2-circle text-success me-2"></i>
                        <small className="text-success mb-0">
                          <strong>Autenticidade Verificada:</strong> Este produto foi registrado na blockchain e sua origem pode ser verificada de forma transparente e imutável.
                        </small>
                      </div>
                    </div>
                  )}

                  {/* Informações Básicas do Produto */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card border-success">
                        <div className="card-header bg-success text-white">
                          <h6 className="mb-0"><i className="bi bi-info-circle me-2"></i>Informações do Produto</h6>
                        </div>
                        <div className="card-body">
                          <h4 className="text-success mb-3">
                            {product.name}
                            {product.isOrganic && <span className="badge bg-success ms-2">🌿 Orgânico</span>}
                          </h4>
                          <div className="row g-2">
                            <div className="col-6">
                              <small className="text-muted d-block">ID do Produto</small>
                              <strong>{product.id}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Categoria</small>
                              <strong>{product.category}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Produtor</small>
                              <strong>{product.producer}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Status</small>
                              <span className={`badge bg-${getStatusBadgeColor(product.status)}`}>
                                {product.status}
                              </span>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Validade</small>
                              <strong className={product.expiryDate === 'N/A' ? 'text-muted' : (product.status === 'Vencido' ? 'text-danger' : product.status === 'Próximo ao Vencimento' ? 'text-warning' : 'text-success')}>
                                {product.expiryDate === 'N/A' ? 'Não informada' : product.expiryDate}
                                {product.status === 'Vencido' && ' ⚠️'}
                                {product.status === 'Próximo ao Vencimento' && ' ⏰'}
                              </strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Data da Colheita</small>
                              <strong>{product.harvestDate === 'N/A' ? 'Não informada' : product.harvestDate}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Quantidade</small>
                              <strong>{product.quantity}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Registrado em</small>
                              <strong>{product.createdAt}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card border-info">
                        <div className="card-header bg-info text-white">
                          <h6 className="mb-0"><i className="bi bi-award me-2"></i>Certificações</h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            {product.certifications.map((cert, index) => (
                              <span key={index} className="badge bg-success me-2 mb-1">
                                <i className="bi bi-patch-check me-1"></i>{cert}
                              </span>
                            ))}
                            {/* Indicador de atualizações */}
                            {product.timeline.filter(event => event.type === 'distribution').length > 0 && (
                              <span className="badge bg-warning text-dark me-2 mb-1">
                                <i className="bi bi-truck me-1"></i>
                                {product.timeline.filter(event => event.type === 'distribution').length} Atualizações
                              </span>
                            )}
                          </div>
                          <div className="d-flex align-items-center text-success">
                            <i className="bi bi-shield-check me-2"></i>
                            <small>Produto verificado e certificado</small>
                          </div>
                          <div className="d-flex align-items-center text-info mt-1">
                            <i className="bi bi-geo-alt me-2"></i>
                            <small>{product.location}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estatísticas de Distribuição */}
                  {product.timeline.filter(event => event.type === 'distribution').length > 0 && (
                    <div className="card border-warning mb-4">
                      <div className="card-header bg-warning text-dark">
                        <h6 className="mb-0">
                          <i className="bi bi-truck me-2"></i>
                          Estatísticas de Distribuição
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-3">
                            <div className="text-center">
                              <div className="h3 text-primary mb-1">
                                {product.timeline.filter(event => event.type === 'distribution').length}
                              </div>
                              <small className="text-muted">Movimentações</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center">
                              <div className="h3 text-success mb-1">
                                {[...new Set(product.timeline.filter(event => event.type === 'distribution').map(event => event.responsible))].length}
                              </div>
                              <small className="text-muted">Distribuidores</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center">
                              <div className="h3 text-info mb-1">
                                {[...new Set(product.timeline.filter(event => event.type === 'distribution').map(event => event.location))].length}
                              </div>
                              <small className="text-muted">Localizações</small>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="text-center">
                              <div className="h3 text-warning mb-1">
                                {Math.ceil((Date.now() - new Date(product.timeline.find(event => event.type === 'blockchain').date.split('/').reverse().join('-')).getTime()) / (1000 * 60 * 60 * 24))}
                              </div>
                              <small className="text-muted">Dias em Trânsito</small>
                            </div>
                          </div>
                        </div>
                        
                        <hr className="my-3" />
                        
                        <div className="row">
                          <div className="col-md-6">
                            <h6 className="text-primary mb-2">🏪 Localização Atual</h6>
                            <p className="mb-1">
                              <strong>
                                {product.timeline.filter(event => event.type === 'distribution').length > 0 
                                  ? product.timeline.filter(event => event.type === 'distribution').slice(-1)[0].location
                                  : product.location
                                }
                              </strong>
                            </p>
                            <small className="text-muted">
                              Última atualização: {product.timeline.filter(event => event.type === 'distribution').length > 0 
                                ? product.timeline.filter(event => event.type === 'distribution').slice(-1)[0].date
                                : 'Localização original'
                              }
                            </small>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-success mb-2">👤 Responsável Atual</h6>
                            <p className="mb-1">
                              <strong>
                                {product.timeline.filter(event => event.type === 'distribution').length > 0 
                                  ? product.timeline.filter(event => event.type === 'distribution').slice(-1)[0].responsible
                                  : product.producer
                                }
                              </strong>
                            </p>
                            <small className="text-muted">
                              {product.timeline.filter(event => event.type === 'distribution').length > 0 
                                ? 'Distribuidor'
                                : 'Produtor Original'
                              }
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline de Rastreamento */}
                  <div className="card border-primary">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-clock-history me-2"></i>Histórico Completo da Cadeia de Suprimentos
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="timeline">
                        {product.timeline.map((event, index) => (
                          <div key={index} className="timeline-item mb-4 position-relative">
                            <div className="d-flex align-items-start">
                              <div className={`timeline-marker bg-${getStatusBadgeColor(event.status)} rounded-circle d-flex align-items-center justify-content-center me-4 position-relative shadow`} style={{width: '50px', height: '50px', zIndex: 2}}>
                                <span className="text-white fw-bold">{index + 1}</span>
                              </div>
                              <div className="flex-grow-1">
                                <div className="card border-primary shadow-sm">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                      <div className="flex-grow-1">
                                        <h5 className="card-title text-primary mb-2 d-flex align-items-center">
                                          <i className="bi bi-arrow-right-circle me-2"></i>
                                          {event.step}
                                        </h5>
                                        <p className="card-text text-dark mb-3">{event.description}</p>
                                        
                                        <div className="row g-2 mb-2">
                                          <div className="col-lg-4 col-md-6">
                                            <small className="text-muted d-flex align-items-center">
                                              <i className="bi bi-geo-alt me-1 text-danger"></i>
                                              <strong>Local:</strong>&nbsp;{event.location}
                                            </small>
                                          </div>
                                          <div className="col-lg-4 col-md-6">
                                            <small className="text-muted d-flex align-items-center">
                                              <i className="bi bi-calendar3 me-1 text-info"></i>
                                              <strong>Data:</strong>&nbsp;{new Date(event.date).toLocaleDateString('pt-BR')}
                                            </small>
                                          </div>
                                          <div className="col-lg-4 col-md-6">
                                            <small className="text-muted d-flex align-items-center">
                                              <i className="bi bi-clock me-1 text-warning"></i>
                                              <strong>Horário:</strong>&nbsp;{event.time}
                                            </small>
                                          </div>
                                        </div>
                                        
                                        {event.responsible && (
                                          <div className="border-top pt-2">
                                            <small className="text-muted d-flex align-items-center">
                                              <i className="bi bi-person-badge me-1"></i>
                                              <strong>Responsável:</strong>&nbsp;{event.responsible}
                                            </small>
                                          </div>
                                        )}
                                        
                                        {/* Informações específicas para distribuição */}
                                        {event.type === 'distribution' && (
                                          <div className="border-top pt-2 mt-2">
                                            <div className="row g-2">
                                              <div className="col-12">
                                                <small className="text-success d-flex align-items-center">
                                                  <i className="bi bi-truck me-1"></i>
                                                  <strong>Movimentação Logística</strong>
                                                </small>
                                              </div>
                                              {event.nextDestination && (
                                                <div className="col-12">
                                                  <small className="text-info d-flex align-items-center">
                                                    <i className="bi bi-arrow-right me-1"></i>
                                                    <strong>Próximo Destino:</strong>&nbsp;{event.nextDestination}
                                                  </small>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Badge especial para blockchain */}
                                        {event.type === 'blockchain' && (
                                          <div className="border-top pt-2 mt-2">
                                            <span className="badge bg-success">
                                              <i className="bi bi-shield-check me-1"></i>
                                              Registrado na Blockchain
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="d-flex flex-column align-items-end ms-3">
                                        <span className={`badge bg-${getStatusBadgeColor(event.status)} mb-2`}>
                                          {event.status}
                                        </span>
                                        {index === 0 && (
                                          <span className="badge bg-warning text-dark">
                                            <i className="bi bi-star me-1"></i>Mais Recente
                                          </span>
                                        )}
                                        {index === product.timeline.length - 1 && (
                                          <span className="badge bg-secondary">
                                            <i className="bi bi-flag me-1"></i>Origem
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <Link to="/" className="btn btn-secondary btn-lg">
                  <i className="bi bi-arrow-left me-2"></i>Voltar ao Início
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackPage;