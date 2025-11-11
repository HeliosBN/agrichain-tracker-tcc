// ABI do contrato AgriChainSimple deployado na Sepolia
export const AGRICHAIN_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_id",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_category",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_producer",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      }
    ],
    "name": "storeProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_id",
        "type": "string"
      }
    ],
    "name": "getProduct",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "category",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "producer",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "producerAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct AgriChainSimple.Product",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalProducts",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "productId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "producer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ProductStored",
    "type": "event"
  }
];

// Endereço do contrato AgriChainSimple na rede Sepolia (deployado com sucesso!)
export const CONTRACT_ADDRESS = '0xbd06cc29a048c5471bf8ece404d47105336d0ae7';

// Configuração da rede Sepolia
export const SEPOLIA_NETWORK = {
  chainId: '0xaa36a7', // 11155111 em hex
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.infura.io/v3/', 'https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/']
};

// Configurações do contrato
export const CONTRACT_CONFIG = {
  abi: AGRICHAIN_ABI,
  address: CONTRACT_ADDRESS,
  network: SEPOLIA_NETWORK
};

// Verificar se o contrato está configurado
export const isContractConfigured = () => {
  return CONTRACT_ADDRESS && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000' && CONTRACT_ADDRESS.length === 42;
};

// Função para validar endereço Ethereum
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};