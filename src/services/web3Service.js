import Web3 from 'web3';
import { AGRICHAIN_ABI, CONTRACT_ADDRESS, isContractConfigured } from '../contracts/AgriChainABI_Optimized.js';

/**
 * Serviço para interação com o smart contract AgriChainTracker
 * Integra com MetaMask e rede Sepolia para rastreamento blockchain
 */
class Web3Service {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
  }

  /**
   * Inicializar o serviço com Web3 e conta
   */
  async initialize(web3Instance, account) {
    try {
      this.web3 = web3Instance;
      this.account = account;
      
      if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '') {
        this.contract = new this.web3.eth.Contract(AGRICHAIN_ABI, CONTRACT_ADDRESS);
        console.log('✅ Web3Service inicializado com contrato:', CONTRACT_ADDRESS);
        return true;
      } else {
        console.warn('⚠️ Endereço do contrato não configurado');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar Web3Service:', error);
      return false;
    }
  }

  /**
   * Verificar se o serviço está pronto para uso
   */
  isReady() {
    return this.web3 && this.contract && this.account;
  }

  /**
   * Gerar ID único para produto
   */
  generateProductId(productData) {
    const timestamp = Date.now();
    const hash = this.web3.utils.keccak256(
      JSON.stringify({
        name: productData.name,
        producer: productData.producer,
        timestamp: timestamp
      })
    ).substring(0, 10);
    
    return `AGRI-${timestamp}-${hash.substring(2)}`;
  }

  /**
   * Registrar produto na blockchain
   */
  async registerProduct(productData) {
    try {
      if (!this.isReady()) {
        throw new Error('Web3Service não está inicializado');
      }

      // Gerar ID único se não fornecido
      const productId = productData.productId || this.generateProductId(productData);
      
      // Converter datas para timestamp
      const harvestDate = Math.floor(new Date(productData.harvestDate).getTime() / 1000);
      const expiryDate = productData.expiryDate 
        ? Math.floor(new Date(productData.expiryDate).getTime() / 1000)
        : 0;

      // Preparar dados para o contrato (versão otimizada)
      const contractParams = [
        productId,
        productData.name || '',
        productData.category || 'others',
        productData.producer || '',
        parseInt(productData.quantity) || 0,
        productData.unit || 'kg',
        JSON.stringify(productData.location || {})
      ];

      console.log('📤 Enviando produto para blockchain:', productId);

      // Estimar gas
      const gasEstimate = await this.contract.methods.registerProduct(...contractParams)
        .estimateGas({ from: this.account });
      
      // Adicionar margem de segurança ao gas
      const gasLimit = Math.floor(gasEstimate * 1.2);

      // Executar transação
      const tx = await this.contract.methods.registerProduct(...contractParams)
        .send({
          from: this.account,
          gas: gasLimit,
        });

      console.log('✅ Produto registrado na blockchain:', tx.transactionHash);

      return {
        success: true,
        productId: productId,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
        gasUsed: tx.gasUsed,
        etherscanUrl: `https://sepolia.etherscan.io/tx/${tx.transactionHash}`
      };

    } catch (error) {
      console.error('❌ Erro ao registrar produto na blockchain:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido',
        details: error
      };
    }
  }

  /**
   * Adicionar evento à cadeia de suprimentos
   */
  async addSupplyChainEvent(eventData) {
    try {
      if (!this.isReady()) {
        throw new Error('Web3Service não está inicializado');
      }

      const contractParams = [
        eventData.productId,
        eventData.eventType || 'update',
        eventData.description || '',
        eventData.actor || '',
        JSON.stringify(eventData.toLocation || eventData.location || {})
      ];

      console.log('📤 Adicionando evento à cadeia:', eventData.productId);

      // Estimar gas
      const gasEstimate = await this.contract.methods.addSupplyChainEvent(...contractParams)
        .estimateGas({ from: this.account });
      
      const gasLimit = Math.floor(gasEstimate * 1.2);

      // Executar transação
      const tx = await this.contract.methods.addSupplyChainEvent(...contractParams)
        .send({
          from: this.account,
          gas: gasLimit,
        });

      console.log('✅ Evento adicionado à blockchain:', tx.transactionHash);

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
        gasUsed: tx.gasUsed,
        etherscanUrl: `https://sepolia.etherscan.io/tx/${tx.transactionHash}`
      };

    } catch (error) {
      console.error('❌ Erro ao adicionar evento na blockchain:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido',
        details: error
      };
    }
  }

  /**
   * Buscar produto da blockchain
   */
  async getProduct(productId) {
    try {
      if (!this.isReady()) {
        throw new Error('Web3Service não está inicializado');
      }

      const exists = await this.contract.methods.doesProductExist(productId).call();
      
      if (!exists) {
        return {
          success: false,
          error: 'Produto não encontrado na blockchain'
        };
      }

      const product = await this.contract.methods.getProduct(productId).call();
      
      // Formatar dados do produto
      const formattedProduct = {
        productId: product.productId,
        name: product.name,
        category: product.category,
        producer: product.producer,
        harvestDate: new Date(parseInt(product.harvestDate) * 1000),
        quantity: parseInt(product.quantity),
        unit: product.unit,
        location: this.parseJSON(product.location),
        registeredBy: product.registeredBy,
        registeredAt: new Date(parseInt(product.registeredAt) * 1000),
        isActive: product.isActive
      };

      return {
        success: true,
        product: formattedProduct
      };

    } catch (error) {
      console.error('❌ Erro ao buscar produto na blockchain:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido'
      };
    }
  }

  /**
   * Buscar eventos de um produto
   */
  async getProductEvents(productId) {
    try {
      if (!this.isReady()) {
        throw new Error('Web3Service não está inicializado');
      }

      const events = await this.contract.methods.getProductEvents(productId).call();
      
      const formattedEvents = events.map(event => ({
        productId: event.productId,
        eventType: event.eventType,
        description: event.description,
        actor: event.actor,
        location: this.parseJSON(event.location),
        timestamp: new Date(parseInt(event.timestamp) * 1000),
        triggeredBy: event.triggeredBy
      }));

      return {
        success: true,
        events: formattedEvents
      };

    } catch (error) {
      console.error('❌ Erro ao buscar eventos na blockchain:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido'
      };
    }
  }

  /**
   * Buscar todos os produtos
   */
  async getAllProducts() {
    try {
      if (!this.isReady()) {
        throw new Error('Web3Service não está inicializado');
      }

      const productIds = await this.contract.methods.getAllProductIds().call();
      const products = [];

      for (const productId of productIds) {
        const result = await this.getProduct(productId);
        if (result.success) {
          products.push(result.product);
        }
      }

      return {
        success: true,
        products: products
      };

    } catch (error) {
      console.error('❌ Erro ao buscar todos os produtos:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido'
      };
    }
  }

  /**
   * Obter estatísticas do contrato
   */
  async getContractStats() {
    try {
      if (!this.isReady()) {
        throw new Error('Web3Service não está inicializado');
      }

      const stats = await this.contract.methods.getStats().call();
      
      return {
        success: true,
        stats: {
          totalProducts: parseInt(stats[0]),
          totalEvents: parseInt(stats[1]),
          totalAuthorizedActors: parseInt(stats[2])
        }
      };

    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido'
      };
    }
  }

  /**
   * Verificar se endereço está autorizado
   */
  async isAuthorized(address = null) {
    try {
      if (!this.isReady()) {
        throw new Error('Web3Service não está inicializado');
      }

      const addressToCheck = address || this.account;
      const authorized = await this.contract.methods.isAuthorized(addressToCheck).call();
      
      return {
        success: true,
        isAuthorized: authorized
      };

    } catch (error) {
      console.error('❌ Erro ao verificar autorização:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido'
      };
    }
  }

  /**
   * Verificar se produto existe na blockchain
   */
  async productExists(productId) {
    try {
      if (!this.isReady()) {
        throw new Error('Web3Service não está inicializado');
      }

      const exists = await this.contract.methods.doesProductExist(productId).call();
      
      return {
        success: true,
        exists: exists
      };

    } catch (error) {
      console.error('❌ Erro ao verificar existência do produto:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido'
      };
    }
  }

  /**
   * Utilitário para parsing seguro de JSON
   */
  parseJSON(jsonString) {
    try {
      return jsonString ? JSON.parse(jsonString) : {};
    } catch (error) {
      console.warn('⚠️ Erro ao fazer parse de JSON:', jsonString);
      return {};
    }
  }

  /**
   * Formatar valor em Wei para Ether
   */
  weiToEth(weiValue) {
    return this.web3 ? this.web3.utils.fromWei(weiValue, 'ether') : '0';
  }

  /**
   * Formatar endereço Ethereum
   */
  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  /**
   * Gerar URL do Etherscan para transação
   */
  getEtherscanTxUrl(txHash) {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }

  /**
   * Gerar URL do Etherscan para endereço
   */
  getEtherscanAddressUrl(address) {
    return `https://sepolia.etherscan.io/address/${address}`;
  }
}

// Instância singleton do serviço
export const web3Service = new Web3Service();
export default web3Service;