// Script para testar a API do backend
const testAPI = async () => {
  const baseURL = 'http://localhost:3001/api/v1';
  
  console.log('🧪 Testando API do AgriChain Backend...\n');
  
  // Teste 1: Health Check
  try {
    const healthResponse = await fetch(`${baseURL}/../health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
  } catch (error) {
    console.log('❌ Health Check falhou:', error.message);
  }
  
  // Teste 2: Criar usuário produtor
  try {
    const registerResponse = await fetch(`${baseURL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'João Silva Produtor',
        email: 'produtor@agrichain.com',
        password: '123456',
        role: 'producer'
      })
    });
    
    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Usuário Produtor criado:', registerData.user);
    } else {
      console.log('❌ Erro ao criar produtor:', registerData.message);
    }
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message);
  }

  // Teste 3: Criar usuário distribuidor
  try {
    const registerResponse = await fetch(`${baseURL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Maria Distribuidora LTDA',
        email: 'distribuidor@agrichain.com',
        password: '123456',
        role: 'distributor'
      })
    });
    
    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Usuário Distribuidor criado:', registerData.user);
    } else {
      console.log('❌ Erro ao criar distribuidor:', registerData.message);
    }
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message);
  }

  // Teste 4: Criar usuário varejista
  try {
    const registerResponse = await fetch(`${baseURL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'SuperMercado Central',
        email: 'varejista@agrichain.com',
        password: '123456',
        role: 'retailer'
      })
    });
    
    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Usuário Varejista criado:', registerData.user);
    } else {
      console.log('❌ Erro ao criar varejista:', registerData.message);
    }
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message);
  }

  // Teste 5: Criar usuário consumidor
  try {
    const registerResponse = await fetch(`${baseURL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Ana Consumidora',
        email: 'consumidor@agrichain.com',
        password: '123456',
        role: 'consumer'
      })
    });
    
    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Usuário Consumidor criado:', registerData.user);
    } else {
      console.log('❌ Erro ao criar consumidor:', registerData.message);
    }
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message);
  }

  // Teste 6: Login com produtor
  try {
    const loginResponse = await fetch(`${baseURL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'produtor@agrichain.com',
        password: '123456'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login bem-sucedido:', loginData.user);
      console.log('🔑 Token:', loginData.token);
    } else {
      console.log('❌ Erro no login:', loginData.message);
    }
  } catch (error) {
    console.log('❌ Erro na requisição de login:', error.message);
  }

  console.log('\n🎉 Testes concluídos!');
};

// Executar se for Node.js
if (typeof module !== 'undefined' && module.exports) {
  testAPI();
}

// Executar se for browser
if (typeof window !== 'undefined') {
  testAPI();
}