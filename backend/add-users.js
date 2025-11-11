const axios = require('axios');

// Usuários para adicionar ao banco de dados
const users = [
  {
    name: "Maria Silva",
    email: "maria@producer.com",
    password: "producer123",
    role: "producer"
  },
  {
    name: "João Santos",
    email: "joao@distributor.com", 
    password: "distributor123",
    role: "distributor"
  },
  {
    name: "Ana Costa",
    email: "ana@retailer.com",
    password: "retailer123", 
    role: "retailer"
  },
  {
    name: "Carlos Consumidor",
    email: "carlos@consumer.com",
    password: "consumer123",
    role: "consumer"
  }
];

async function addUsers() {
  console.log('🔧 Adicionando usuários ao banco de dados...\n');
  
  for (const user of users) {
    try {
      console.log(`📝 Criando usuário: ${user.name} (${user.email})`);
      
      const response = await axios.post('http://localhost:3001/api/v1/users/register', {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role
      });
      
      console.log(`✅ Usuário criado: ${user.email} - Role: ${user.role}`);
      console.log(`   ID: ${response.data.user.id}\n`);
      
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('já existe')) {
        console.log(`⚠️  Usuário já existe: ${user.email}\n`);
      } else {
        console.error(`❌ Erro ao criar ${user.email}:`, error.response?.data?.message || error.message);
        console.log('');
      }
    }
  }
  
  // Verificar usuários criados
  try {
    console.log('📊 Verificando usuários no banco...');
    const response = await axios.get('http://localhost:3001/api/debug/data');
    console.log(`\n✅ Total de usuários no banco: ${response.data.summary.total_users}`);
    console.log('\n👥 Usuários cadastrados:');
    response.data.users.forEach(user => {
      console.log(`   • ${user.name} (${user.email}) - ${user.role}`);
    });
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error.message);
  }
}

addUsers();