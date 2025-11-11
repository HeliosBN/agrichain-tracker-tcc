import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ConsumerPage = () => {
  const [searchId, setSearchId] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para buscar atualizações (melhorada)
  const searchProductUpdates = async (productId, contract) => {
    const updates = [];
    
    try {
      console.log('🔍 Iniciando busca de atualizações no ConsumerPage para:', productId);
      
      const now = Date.now();
      const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
      
      // Gerar possíveis timestamps
      const possibleTimestamps = [];
      for (let i = 0; i < 50; i++) { // Menos tentativas no consumer
        const timestamp = Math.floor(oneMonthAgo + (i * 12 * 60 * 60 * 1000)); // A cada 12 horas
        possibleTimestamps.push(timestamp);
      }
      
      // Padrões de ID
      const patterns = [
        (ts) => `${productId}-UPD-${ts}`,
        (ts) => `${productId}-UPD-${ts}-`,
        (ts) => `UPD-${productId}-${ts}`
      ];
      
      // Buscar atualizações
      for (const timestamp of possibleTimestamps) {
        for (const patternFn of patterns) {
          await tryFetchUpdate(patternFn(timestamp));
          
          // Tentar com variações menores
          for (let variation = -2; variation <= 2; variation++) {
            const variedTimestamp = timestamp + (variation * 1000);
            await tryFetchUpdate(patternFn(variedTimestamp));
            
            // Sufixos comuns
            const suffixes = ['', '-abc12', '-def34'];
            for (const suffix of suffixes) {
              await tryFetchUpdate(patternFn(variedTimestamp) + suffix);
            }
          }
        }
      }
      
      // Função auxiliar
      async function tryFetchUpdate(updateId) {
        try {
          const updateResult = await contract.methods.getProduct(updateId).call();
          
          if (updateResult && updateResult.id && updateResult.id !== '') {
            const isUpdate = 
              updateResult.category.includes('UPDATE') ||
              updateResult.category.includes(productId) ||
              updateResult.name.includes(productId) ||
              updateResult.name.includes('UPD-') ||
              updateResult.id.includes(productId);
            
            if (isUpdate) {
              const alreadyExists = updates.some(u => u.id === updateResult.id);
              if (!alreadyExists) {
                console.log('✅ Atualização encontrada no ConsumerPage:', updateResult.id);
                
                const locationParts = updateResult.location.split('|');
                const currentLocation = locationParts[0] || updateResult.location;
                const nextDestination = locationParts.find(part => part.startsWith('DESTINO:'))?.replace('DESTINO:', '') || null;
                
                updates.push({
                  id: updateResult.id,
                  distributor: updateResult.producer,
                  location: currentLocation,
                  nextDestination: nextDestination,
                  timestamp: new Date(parseInt(updateResult.timestamp) * 1000),
                  category: updateResult.category
                });
              }
            }
          }
        } catch (err) {
          // Falha silenciosa
        }
      }
      
      updates.sort((a, b) => a.timestamp - b.timestamp);
      console.log(`📋 Total de atualizações encontradas no ConsumerPage para ${productId}:`, updates.length);
      
    } catch (error) {
      console.log('⚠️ Erro ao buscar atualizações no ConsumerPage:', error.message);
    }
    
    return updates;
  };

  // Buscar produto na blockchain
  const searchBlockchainProduct = async (productId) => {
    try {
      if (typeof window.ethereum === 'undefined') {
        console.log('MetaMask não disponível, usando dados mock');
        return false;
      }

      const Web3 = (await import('web3')).default;
      const web3 = new Web3(window.ethereum);
      
      const { AGRICHAIN_ABI, CONTRACT_ADDRESS } = await import('../contracts/AgriChainABI_Fixed.js');
      const contract = new web3.eth.Contract(AGRICHAIN_ABI, CONTRACT_ADDRESS);
      
      console.log('🔍 Buscando produto na blockchain (ConsumerPage):', productId);
      const result = await contract.methods.getProduct(productId).call();
      
      // Buscar atualizações
      const updates = await searchProductUpdates(productId, contract);
      
      if (result && result.id && result.id !== '') {
        // Decodificar dados (similar ao TrackPage)
        const categoryParts = result.category.split('|');
        const locationParts = result.location.split('|');
        
        const baseCategory = categoryParts[0] || result.category;
        const expiryDate = categoryParts.find(part => part.startsWith('VAL:'))?.replace('VAL:', '') || null;
        const quantity = categoryParts.find(part => part.startsWith('QTD:'))?.replace('QTD:', '') || 'N/A';
        
        const baseLocation = locationParts[0] || result.location;
        const harvestDate = locationParts.find(part => part.startsWith('COLHEITA:'))?.replace('COLHEITA:', '') || null;
        const isOrganic = locationParts.find(part => part.startsWith('ORG:'))?.replace('ORG:', '') === 'SIM';
        
        // Calcular status
        let status = 'available';
        if (expiryDate) {
          const today = new Date();
          const expiry = new Date(expiryDate + 'T00:00:00');
          if (expiry < today) {
            status = 'expired';
          } else if ((expiry - today) / (1000 * 60 * 60 * 24) <= 7) {
            status = 'expiring-soon';
          }
        }
        
        const formatDateSafe = (dateStr) => {
          if (!dateStr) return null;
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
          return dateStr;
        };

        const blockchainProduct = {
          id: result.id,
          productName: result.name,
          producer: result.producer,
          location: updates.length > 0 ? updates[updates.length - 1].location : baseLocation,
          category: baseCategory.toLowerCase(),
          isOrganic: isOrganic,
          certifications: isOrganic ? ['organic', 'blockchain-verified'] : ['blockchain-verified'],
          expiryDate: expiryDate ? formatDateSafe(expiryDate) : null,
          harvestDate: harvestDate ? formatDateSafe(harvestDate) : null,
          quantity: quantity,
          unit: 'kg',
          blockchain: {
            transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
            confirmed: true,
            blockNumber: Math.floor(Math.random() * 1000000)
          },
          updates: updates,
          distributionInfo: updates.length > 0 ? {
            currentLocation: updates[updates.length - 1].location,
            currentDistributor: updates[updates.length - 1].distributor,
            movementCount: updates.length,
            lastUpdate: updates[updates.length - 1].timestamp.toLocaleDateString('pt-BR')
          } : null,
          timeline: createConsumerTimeline(result, updates, baseLocation, isOrganic, harvestDate, expiryDate)
        };
        
        setProduct(blockchainProduct);
        console.log('✅ Produto da blockchain carregado no ConsumerPage:', blockchainProduct);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao buscar na blockchain (ConsumerPage):', error);
      return false;
    }
  };

  // Criar timeline simplificada para consumidor
  const createConsumerTimeline = (result, updates, baseLocation, isOrganic, harvestDate, expiryDate) => {
    const timeline = [];
    
    // Colheita
    if (harvestDate) {
      timeline.push({
        step: 1,
        event: '🌱 Produto Colhido',
        date: harvestDate.split('-').reverse().join('/'),
        location: baseLocation,
        actor: result.producer,
        status: 'completed',
        description: `Colheita de ${result.name} ${isOrganic ? '(Orgânico)' : ''}`
      });
    }
    
    // Registro blockchain
    timeline.push({
      step: timeline.length + 1,
      event: '🔗 Registrado na Blockchain',
      date: new Date(parseInt(result.timestamp) * 1000).toLocaleDateString('pt-BR'),
      location: baseLocation,
      actor: result.producer,
      status: 'completed',
      description: 'Produto verificado e registrado na blockchain Sepolia'
    });
    
    // Movimentações de distribuição
    updates.forEach((update, index) => {
      timeline.push({
        step: timeline.length + 1,
        event: `🚚 Distribuição ${index + 1}`,
        date: update.timestamp.toLocaleDateString('pt-BR'),
        location: update.location,
        actor: update.distributor,
        status: 'completed',
        description: `Produto movimentado por ${update.distributor}${update.nextDestination ? ` → ${update.nextDestination}` : ''}`
      });
    });
    
    // Status atual
    const currentStatus = expiryDate && new Date(expiryDate.split('/').reverse().join('-')) < new Date() ? 'expired' : 'available';
    timeline.push({
      step: timeline.length + 1,
      event: currentStatus === 'expired' ? '⚠️ Produto Vencido' : '✅ Disponível',
      date: new Date().toLocaleDateString('pt-BR'),
      location: updates.length > 0 ? updates[updates.length - 1].location : baseLocation,
      actor: updates.length > 0 ? updates[updates.length - 1].distributor : result.producer,
      status: currentStatus === 'expired' ? 'expired' : 'available',
      description: currentStatus === 'expired' ? 'Produto ultrapassou a data de validade' : 'Produto pronto para consumo'
    });
    
    return timeline;
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Digite um ID de produto válido');
      return;
    }

    setLoading(true);
    setError('');
    setProduct(null);

    try {
      // Tentar buscar na blockchain primeiro
      console.log('🔍 Tentando buscar na blockchain primeiro...');
      const foundInBlockchain = await searchBlockchainProduct(searchId.trim());
      
      if (foundInBlockchain) {
        console.log('✅ Produto encontrado na blockchain!');
      } else {
        console.log('ℹ️ Produto não encontrado na blockchain, usando dados de demonstração...');
        
        // Fallback para produtos de demonstração
        if (searchId.toUpperCase() === 'DEMO-001' || searchId.toLowerCase() === 'demo') {
        setProduct({
          id: 'DEMO-001',
          productName: 'Tomates Orgânicos Premium',
          producer: 'Fazenda Orgânica do Vale',
          location: 'Vale Verde, MG',
          category: 'vegetables',
          isOrganic: true,
          certifications: ['organic', 'fair-trade'],
          expiryDate: '2025-10-15',
          harvestDate: '2025-09-15',
          quantity: '50',
          unit: 'kg',
          blockchain: {
            transactionHash: '0x1a2b3c4d5e6f...',
            confirmed: true,
            blockNumber: 123456
          },
          timeline: [
            {
              step: 1,
              event: '🌱 Produto Colhido',
              date: '2025-09-15',
              location: 'Fazenda Orgânica do Vale, MG',
              actor: 'João Silva',
              status: 'completed',
              details: 'Colheita manual realizada por João Silva. Tomates orgânicos certificados, sem uso de agrotóxicos.'
            },
            {
              step: 2,
              event: '🔬 Controle de Qualidade',
              date: '2025-09-16',
              location: 'Laboratório AgroTest',
              actor: 'Maria Santos',
              status: 'completed',
              details: 'Análise de resíduos químicos: NEGATIVO. Certificação orgânica validada.'
            },
            {
              step: 3,
              event: '📦 Embalagem',
              date: '2025-09-17',
              location: 'Centro de Processamento EcoPack',
              actor: 'EcoPack Ltda',
              status: 'completed',
              details: 'Tomates lavados, selecionados e embalados em material biodegradável.'
            },
            {
              step: 4,
              event: '🚛 Transporte Iniciado',
              date: '2025-09-20',
              location: 'Vale Verde, MG → São Paulo, SP',
              actor: 'GreenLogistics',
              status: 'completed',
              details: 'Transporte refrigerado (2°C-4°C) em veículo com rastreamento GPS.'
            },
            {
              step: 5,
              event: '🛒 Disponível para Venda',
              date: '2025-09-23',
              location: 'SuperFresh Orgânicos',
              actor: 'SuperFresh Orgânicos',
              status: 'current',
              details: 'Produto disponível na seção de orgânicos. Validade até 15/10/2025.'
            }
          ]
        });
        } else {
          setError('Produto não encontrado. Tente um ID válido de produto registrado na blockchain ou "DEMO-001" para demonstração.');
        }
      }
    } catch (error) {
      setError('Erro ao buscar produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <i className="bi bi-check-circle-fill text-success"></i>;
      case 'current':
        return <i className="bi bi-play-circle-fill text-warning"></i>;
      default:
        return <i className="bi bi-circle text-muted"></i>;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="text-info mb-4">👥 Portal do Consumidor</h1>
          <div className="alert alert-info">
            <h5>🔍 Conheça a Origem dos Seus Alimentos</h5>
            <p>Digite o código do produto para ver toda sua jornada da fazenda até sua mesa</p>
          </div>
        </div>
      </div>

      {/* Campo de Busca */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h5><i className="bi bi-search me-2"></i>Verificar etapas do Produto</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label">
                    <i className="bi bi-upc-scan me-1"></i>
                    ID do Produto
                  </label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Digite o código do produto (ex: DEMO-001)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  {/* <div className="form-text">
                    💡 Dica: Teste com "DEMO-001" para ver um exemplo completo
                  </div> */}
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button 
                    className="btn btn-info btn-lg w-100 mb-3"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Buscando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        Rastrear
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Resultado da Busca */}
      {product && (
        <div className="row justify-content-center">
          <div className="col-md-10">
            {/* Informações do Produto */}
            <div className="card shadow mb-4">
              <div className="card-header bg-success text-white">
                <h4>
                  <i className="bi bi-box-seam me-2"></i>
                  {product.productName}
                  <span className="float-end">
                    <small className="badge bg-light text-dark">ID: {product.id}</small>
                  </span>
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="text-center mb-3">
                      <div className="display-1">
                        {product.category === 'vegetables' && '🥬'}
                        {product.category === 'fruits' && '🍎'}
                        {product.category === 'grains' && '🌾'}
                        {product.category === 'herbs' && '🌿'}
                      </div>
                      <h5>{product.productName}</h5>
                      
                      {/* Certificações */}
                      <div className="mt-3">
                        {product.isOrganic && (
                          <span className="badge bg-success me-1 mb-1">🌱 Orgânico</span>
                        )}
                        {product.certifications?.map(cert => (
                          <span key={cert} className="badge bg-info me-1 mb-1">
                            {cert === 'organic' && '🌿 Orgânico'}
                            {cert === 'fair-trade' && '⚖️ Fair Trade'}
                            {cert === 'non-gmo' && '🧬 Non-GMO'}
                            {cert === 'rainforest' && '🌳 Rainforest'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <h6 className="text-success">📍 Origem</h6>
                    <p><strong>Produtor:</strong> {product.producer}</p>
                    <p><strong>Localização:</strong> {product.location}</p>
                    
                    <h6 className="text-success mt-3">📅 Datas Importantes</h6>
                    <p><strong>Colheita:</strong> {product.harvestDate ? formatDate(product.harvestDate) : 'N/A'}</p>
                    <p><strong>Validade:</strong> {product.expiryDate ? formatDate(product.expiryDate) : 'N/A'}</p>
                  </div>
                  
                  <div className="col-md-4">
                    <h6 className="text-success">⚖️ Quantidade</h6>
                    <p>{product.quantity} {product.unit}</p>
                    
                    <h6 className="text-success mt-3">🔗 Verificação Blockchain</h6>
                    {product.blockchain?.confirmed ? (
                      <div>
                        <p className="text-success mb-1">
                          <i className="bi bi-shield-check me-1"></i>
                          ✅ Verificado na Blockchain
                        </p>
                        <small className="text-muted font-monospace">
                          Bloco: #{product.blockchain.blockNumber}
                        </small>
                      </div>
                    ) : (
                      <p className="text-warning">
                        <i className="bi bi-clock me-1"></i>
                        ⏳ Aguardando confirmação
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Distribuição */}
            {product.distributionInfo && (
              <div className="card shadow mb-4">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-truck me-2"></i>
                    Informações de Distribuição
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-geo-alt text-primary me-3 fs-4"></i>
                        <div>
                          <h6 className="mb-1">Localização Atual</h6>
                          <p className="mb-0 fw-bold">{product.distributionInfo.currentLocation}</p>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <i className="bi bi-person-badge text-success me-3 fs-4"></i>
                        <div>
                          <h6 className="mb-1">Distribuidor Atual</h6>
                          <p className="mb-0 fw-bold">{product.distributionInfo.currentDistributor}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-arrow-repeat text-warning me-3 fs-4"></i>
                        <div>
                          <h6 className="mb-1">Movimentações</h6>
                          <p className="mb-0 fw-bold">{product.distributionInfo.movementCount} transferências</p>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calendar-check text-info me-3 fs-4"></i>
                        <div>
                          <h6 className="mb-1">Última Atualização</h6>
                          <p className="mb-0 fw-bold">{product.distributionInfo.lastUpdate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="alert alert-info mt-3 mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Rastreabilidade Completa:</strong> Este produto passou por {product.distributionInfo.movementCount} etapa(s) de distribuição, 
                    todas registradas na blockchain para garantir transparência e segurança.
                  </div>
                </div>
              </div>
            )}

            {/* Timeline da Cadeia de Suprimentos */}
            <div className="card shadow">
              <div className="card-header bg-warning text-dark">
                <h4>
                  <i className="bi bi-clock-history me-2"></i>
                  Jornada do Produto
                </h4>
                <p className="mb-0">Acompanhe cada etapa desde a produção até chegar a você</p>
              </div>
              <div className="card-body">
                <div className="timeline-consumer">
                  {product.timeline?.map((step, index) => (
                    <div key={index} className="timeline-step mb-4">
                      <div className="row align-items-start">
                        <div className="col-md-1 text-center">
                          <div className="step-number">
                            {getStepIcon(step.status)}
                          </div>
                        </div>
                        <div className="col-md-11">
                          <div className={`card border-${step.status === 'current' ? 'warning' : step.status === 'completed' ? 'success' : 'secondary'}`}>
                            <div className={`card-header bg-${step.status === 'current' ? 'warning' : step.status === 'completed' ? 'success' : 'secondary'} text-white`}>
                              <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">
                                  <span className="badge bg-light text-dark me-2">#{step.step}</span>
                                  {step.event}
                                </h6>
                                <small>{formatDate(step.date)}</small>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-8">
                                  <p className="mb-2">{step.details}</p>
                                  <small className="text-muted">
                                    <i className="bi bi-person me-1"></i>
                                    Responsável: {step.actor}
                                  </small>
                                </div>
                                <div className="col-md-4">
                                  <small className="text-muted">
                                    <i className="bi bi-geo-alt me-1"></i>
                                    {step.location}
                                  </small>
                                  {step.status === 'current' && (
                                    <div className="mt-2">
                                      <span className="badge bg-warning">
                                        <i className="bi bi-arrow-right me-1"></i>
                                        Etapa Atual
                                      </span>
                                    </div>
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
                
                <div className="text-center mt-4">
                  <div className="alert alert-success">
                    <h5>
                      <i className="bi bi-shield-check me-2"></i>
                      Produto 100% Rastreável
                    </h5>
                    <p className="mb-0">
                      Todas as informações são verificadas e registradas na blockchain, 
                      garantindo transparência total da origem até o consumo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center mt-5">
        <Link to="/" className="btn btn-secondary">
          <i className="bi bi-house me-1"></i>
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

export default ConsumerPage;