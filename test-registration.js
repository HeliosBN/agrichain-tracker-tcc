import Web3 from 'web3';

// Configuração
const CONTRACT_ADDRESS = '0xbd06cc29a048c5471bf8ece404d47105336d0ae7';
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_id", "type": "string" },
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_category", "type": "string" },
      { "internalType": "string", "name": "_producer", "type": "string" },
      { "internalType": "string", "name": "_location", "type": "string" }
    ],
    "name": "storeProduct",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
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

async function testRegistration() {
  console.log('🔍 Testando registro de produtos no contrato...\n');
  
  try {
    // Conectar ao Sepolia via RPC público
    const web3 = new Web3('https://eth-sepolia.public.blastapi.io');
    
    console.log('✅ Conectado ao Sepolia');
    
    // Instanciar contrato
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    
    // Verificar se contrato existe
    const code = await web3.eth.getCode(CONTRACT_ADDRESS);
    if (code === '0x') {
      console.log('❌ Contrato não encontrado no endereço');
      return;
    }
    
    console.log('✅ Contrato encontrado');
    
    // Obter número de produtos
    try {
      const totalProducts = await contract.methods.getTotalProducts().call();
      console.log(`📊 Produtos registrados: ${totalProducts}\n`);
      
    } catch (error) {
      console.log(`❌ Erro ao obter contagem: ${error.message}`);
    }
    
    // Testar estimativa de gas para registro
    console.log('⛽ Testando estimativa de gas...');
    
    // Dados de teste válidos
    const testProduct = {
      id: `TEST${Date.now()}`, // ID único
      name: 'Produto Teste',
      category: 'Categoria Teste',
      producer: 'Produtor Teste',
      location: 'Localização Teste'
    };
    
    try {
      // Estimar gas sem executar
      const gasEstimate = await contract.methods.storeProduct(
        testProduct.id,
        testProduct.name,
        testProduct.category,
        testProduct.producer,
        testProduct.location
      ).estimateGas({ from: '0x0000000000000000000000000000000000000000' });
      
      console.log(`✅ Gas estimado: ${gasEstimate}`);
      
      // Calcular custo atual
      const gasPrice = await web3.eth.getGasPrice();
      const costWei = BigInt(gasEstimate) * BigInt(gasPrice);
      const costEth = web3.utils.fromWei(costWei.toString(), 'ether');
      
      console.log(`💰 Custo estimado: ${parseFloat(costEth).toFixed(6)} ETH`);
      
    } catch (gasError) {
      console.log(`❌ Erro na estimativa de gas: ${gasError.message}`);
      
      // Verificar se é erro de validação
      if (gasError.message.includes('revert')) {
        console.log('⚠️  Possível erro de validação no contrato');
        
        // Testar com dados de tamanhos diferentes
        console.log('\n🧪 Testando tamanhos de dados...');
        
        const testCases = [
          { name: 'Nome Curto', size: 5 },
          { name: 'Nome Médio', size: 20 },
          { name: 'Nome Longo', size: 50 },
          { name: 'Nome Muito Longo', size: 100 }
        ];
        
        for (const testCase of testCases) {
          const longString = 'A'.repeat(testCase.size);
          try {
            await contract.methods.storeProduct(
              testProduct.id,
              longString,
              longString,
              longString,
              longString
            ).estimateGas({ from: '0x0000000000000000000000000000000000000000' });
            
            console.log(`  ✅ ${testCase.name} (${testCase.size} chars): OK`);
          } catch (error) {
            console.log(`  ❌ ${testCase.name} (${testCase.size} chars): ${error.message}`);
          }
        }
      }
    }
    
    console.log('\n✅ Teste concluído');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar teste
testRegistration();