import Web3 from 'web3';

// Configuração
const CONTRACT_ADDRESS = '0xbd06cc29a048c5471bf8ece404d47105336d0ae7';
const CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProduct",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "id", "type": "string" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "category", "type": "string" },
          { "internalType": "string", "name": "producer", "type": "string" },
          { "internalType": "string", "name": "location", "type": "string" },
          { "internalType": "address", "name": "producerAddress", "type": "address" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
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
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

async function listProducts() {
  console.log('📋 Listando produtos da blockchain...\n');
  
  try {
    // Conectar ao Sepolia
    const web3 = new Web3('https://eth-sepolia.public.blastapi.io');
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    
    // Obter total de produtos
    const totalProducts = await contract.methods.getTotalProducts().call();
    console.log(`📊 Total de produtos: ${totalProducts}\n`);
    
    // Tentar buscar produtos por padrões mais específicos
    const commonIds = [
      'AGRI-1729006123456',
      'AGRI-1729006123457', 
      'AGRI-1729006123458',
      'PROD-2024-001',
      'PROD-2024-002',
      'TEST1729006123456',
      'PRODUTO-001',
      'PRODUTO-002'
    ];
    
    const patterns = [];
    
    // Gerar IDs baseados em timestamps recentes
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < 50; i++) {
      const timestamp = Math.floor(oneWeekAgo + (i * 3 * 60 * 60 * 1000)); // A cada 3 horas
      patterns.push(`AGRI-${timestamp}`);
      patterns.push(`TEST${timestamp}`);
      patterns.push(`PROD-${timestamp}`);
    }
    
    // Adicionar IDs comuns também
    patterns.push(...commonIds);
    
    console.log('🔍 Testando padrões de ID...\n');
    
    const foundProducts = [];
    let tested = 0;
    
    for (const id of patterns) {
      if (tested % 10 === 0) {
        console.log(`Testado ${tested}/${patterns.length} IDs...`);
      }
      
      try {
        const product = await contract.methods.getProduct(id).call();
        if (product && product.id && product.id !== '') {
          foundProducts.push(product);
          console.log(`✅ ${id}:`);
          console.log(`   Nome: ${product.name}`);
          console.log(`   Categoria: ${product.category}`);
          console.log(`   Produtor: ${product.producer}`);
          console.log(`   Timestamp: ${new Date(parseInt(product.timestamp) * 1000).toLocaleString('pt-BR')}`);
          console.log('');
          
          if (foundProducts.length >= 5) break; // Parar após encontrar 5 produtos
        }
      } catch (error) {
        // Produto não existe - normal
      }
      
      tested++;
    }
    
    if (foundProducts.length === 0) {
      console.log('❌ Nenhum produto encontrado com IDs comuns');
      console.log('\n💡 Dica: Registre um produto primeiro usando a página de registro');
    } else {
      console.log(`\n✅ Encontrados ${foundProducts.length} produtos!`);
      console.log('\n📝 IDs para teste no rastreamento:');
      foundProducts.forEach(p => console.log(`   - ${p.id}`));
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Executar
listProducts();