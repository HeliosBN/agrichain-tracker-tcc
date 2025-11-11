// Script de teste para verificar atualizações na blockchain
// Execute com: node test-updates.js

const Web3 = require('web3');

// Configuração
const CONTRACT_ADDRESS = '0xbd06cc29a048c5471bf8ece404d47105336d0ae7';
const AGRICHAIN_ABI = [
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
  }
];

async function testUpdatesSearch(productId) {
  try {
    console.log(`\n🔍 Testando busca de atualizações para: ${productId}`);
    
    // Conectar à rede Sepolia
    const web3 = new Web3('https://sepolia.infura.io/v3/YOUR_INFURA_KEY');
    const contract = new web3.eth.Contract(AGRICHAIN_ABI, CONTRACT_ADDRESS);
    
    const updates = [];
    const now = Date.now();
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    console.log('📅 Buscando atualizações dos últimos 30 dias...');
    
    // Testar diferentes padrões
    const testIds = [];
    for (let i = 0; i < 20; i++) {
      const timestamp = Math.floor(oneMonthAgo + (i * 36 * 60 * 60 * 1000)); // A cada 36 horas
      testIds.push(`${productId}-UPD-${timestamp}`);
      testIds.push(`${productId}-UPD-${timestamp}-abc12`);
      testIds.push(`${productId}-UPD-${timestamp}-def34`);
    }
    
    console.log(`📋 Testando ${testIds.length} possíveis IDs de atualização...`);
    
    for (const testId of testIds) {
      try {
        const result = await contract.methods.getProduct(testId).call();
        
        if (result && result.id && result.id !== '') {
          console.log(`✅ Atualização encontrada: ${result.id}`);
          console.log(`   - Nome: ${result.name}`);
          console.log(`   - Categoria: ${result.category}`);
          console.log(`   - Produtor: ${result.producer}`);
          console.log(`   - Localização: ${result.location}`);
          console.log(`   - Timestamp: ${new Date(parseInt(result.timestamp) * 1000).toLocaleString('pt-BR')}`);
          
          updates.push(result);
        }
      } catch (err) {
        // Falha silenciosa
      }
    }
    
    console.log(`\n📊 Total de atualizações encontradas: ${updates.length}`);
    
    if (updates.length === 0) {
      console.log('❌ Nenhuma atualização encontrada. Verifique se:');
      console.log('   1. O produto foi registrado na blockchain');
      console.log('   2. Atualizações foram criadas via UpdatePage');
      console.log('   3. O ID do produto está correto');
    }
    
    return updates;
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    return [];
  }
}

// Testar com IDs comuns
async function runTests() {
  const testProducts = [
    'PROD-2024-001',
    'PROD-2024-002',
    'AGRI-1729006123456', // Exemplo de ID da blockchain
  ];
  
  for (const productId of testProducts) {
    await testUpdatesSearch(productId);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests().then(() => {
    console.log('\n✅ Teste concluído');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Erro no teste:', error);
    process.exit(1);
  });
}

module.exports = { testUpdatesSearch };