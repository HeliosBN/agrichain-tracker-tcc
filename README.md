# 🌾 AgriChain - Rastreamento Blockchain para Cadeia de Suprimentos Agrícola

## 📋 Visão Geral

O **AgriChain** é uma plataforma completa de rastreamento para a cadeia de suprimentos agrícola, utilizando tecnologia blockchain para garantir transparência, imutabilidade e confiabilidade dos dados. O sistema integra banco de dados PostgreSQL com blockchain Ethereum (rede Sepolia) para criar um sistema híbrido robusto.

## 🚀 Funcionalidades Principais

### 🔐 **Sistema de Autenticação**
- Registro e login de usuários (Produtores, Distribuidores, Varejistas, Consumidores)
- Integração com banco PostgreSQL
- Fallback para sistema mock para demonstrações

### ⛓️ **Integração Blockchain**
- Smart contracts em Solidity na rede Sepolia
- Conexão MetaMask para transações
- Registro imutável de produtos na blockchain
- Rastreamento completo da cadeia de suprimentos
- Verificação via Etherscan

### 📊 **Gestão de Produtos**
- Registro detalhado de produtos agrícolas
- Categorização (vegetais, frutas, grãos, etc.)
- Certificações (orgânico, fair-trade, etc.)
- Dados de qualidade e rastreabilidade

### 🔍 **Visualização e Monitoramento**
- Dashboard responsivo com Bootstrap 5
- Busca de produtos na blockchain
- Timeline de eventos da cadeia
- Estatísticas em tempo real

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18** - Framework principal
- **Vite** - Build tool e dev server
- **Bootstrap 5** - Framework CSS responsivo
- **React Bootstrap** - Componentes React
- **Web3.js** - Interação com blockchain
- **MetaMask** - Conexão com wallet Ethereum

### **Backend**
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **CORS** - Cross-origin requests

### **Blockchain**
- **Solidity ^0.8.19** - Smart contracts
- **Ethereum Sepolia** - Rede de teste
- **MetaMask** - Wallet e provider
- **Etherscan** - Explorer de blockchain

### **Banco de Dados**
- **PostgreSQL 15** - Banco principal
- **Docker** - Containerização
- **PgAdmin** - Interface administrativa

### **DevOps**
- **Docker Compose** - Orquestração de containers
- **Git** - Controle de versão
- **ESLint** - Linting JavaScript

## 📦 Estrutura do Projeto

```
agrichain-tracker-tcc/
├── 📁 backend/
│   ├── 📄 server.js
│   ├── 📁 config/
│   │   └── database.js
│   ├── 📁 models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── SupplyChainEvent.js
│   ├── 📁 routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   └── debugRoutes.js
│   └── 📁 middleware/
├── 📁 src/
│   ├── 📄 App.jsx
│   ├── 📁 components/
│   │   ├── 📁 Auth/
│   │   ├── 📁 Products/
│   │   ├── 📁 SupplyChain/
│   │   └── 📁 Web3/
│   ├── 📁 contracts/
│   │   ├── AgriChainTracker.sol
│   │   └── AgriChainABI.js
│   ├── 📁 hooks/
│   │   ├── useWeb3.js
│   │   └── useSupplyChain.js
│   ├── 📁 services/
│   │   ├── api.js
│   │   └── web3Service.js
│   └── 📁 pages/
├── 📄 docker-compose.yml
├── 📄 BLOCKCHAIN_SETUP.md
└── 📄 README.md
```

## 🚀 Instalação e Configuração

### **1. Pré-requisitos**
```bash
# Node.js 18+
node --version

# Docker e Docker Compose
docker --version
docker-compose --version

# Git
git --version
```

### **2. Clonagem e Setup**
```bash
# Clonar repositório
git clone https://github.com/HeliosBN/agrichain-tracker-tcc.git
cd agrichain-tracker-tcc

# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd backend
npm install
cd ..
```

### **3. Configuração do Banco de Dados**
```bash
# Iniciar containers Docker
docker-compose up -d

# Verificar status
docker-compose ps
```

**Acessos:**
- **PostgreSQL**: `localhost:5432`
- **PgAdmin**: `http://localhost:8080`
  - Email: `admin@agrichain.com`
  - Senha: `admin123`

### **4. Configuração Blockchain**

#### **MetaMask:**
1. Instale: https://metamask.io/download/
2. Configure rede Sepolia:
   - Nome: `Sepolia Test Network`
   - RPC: `https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`
   - Chain ID: `11155111`
   - Símbolo: `ETH`
   - Explorer: `https://sepolia.etherscan.io`

#### **Deploy do Smart Contract:**
1. Abra: https://remix.ethereum.org/
2. Cole o código de `/src/contracts/AgriChainTracker.sol`
3. Compile com Solidity 0.8.19+
4. Deploy na rede Sepolia
5. **COPIE O ENDEREÇO DO CONTRATO**
6. Atualize em `/src/contracts/AgriChainABI.js`:
   ```javascript
   export const CONTRACT_ADDRESS = 'SEU_ENDERECO_AQUI';
   ```

#### **Obter SepoliaETH:**
- https://sepoliafaucet.com/
- https://faucets.chain.link/sepolia

### **5. Execução**

#### **Backend:**
```bash
cd backend
npm start
# Servidor: http://localhost:3001
```

#### **Frontend:**
```bash
npm run dev
# Aplicação: http://localhost:5173
```

## 🎯 Como Usar

### **1. Configuração Inicial**
1. Acesse `http://localhost:5173`
2. Conecte sua wallet MetaMask
3. Mude para a rede Sepolia
4. Garanta que tem SepoliaETH para transações

### **2. Registro de Usuário**
1. Clique em "Entrar" → "Registrar"
2. Preencha os dados
3. Escolha o tipo de usuário (Produtor, Distribuidor, etc.)
4. Dados salvos no PostgreSQL + blockchain

### **3. Registro de Produto**
1. Vá para "Registrar Produto"
2. Preencha informações detalhadas
3. Confirme transação no MetaMask
4. Produto salvo no banco + blockchain

### **4. Rastreamento**
1. Use "Blockchain Tracker"
2. Busque produtos por ID
3. Visualize histórico completo
4. Verifique no Etherscan

## 🔍 Endpoints da API

### **Usuários**
- `POST /api/v1/users/register` - Registrar usuário
- `POST /api/v1/users/login` - Login
- `GET /api/v1/users/profile` - Perfil do usuário

### **Produtos**
- `POST /api/v1/products` - Registrar produto
- `GET /api/v1/products` - Listar produtos
- `GET /api/v1/products/:id` - Buscar produto

### **Debug (Desenvolvimento)**
- `GET /api/debug/users` - Listar usuários
- `GET /api/debug/products` - Listar produtos
- `GET /api/debug/data` - Estatísticas completas

## 🧪 Testes

### **Teste Manual Completo:**
1. **Setup**: Conectar MetaMask + Sepolia
2. **Registro**: Criar conta de produtor
3. **Produto**: Registrar tomates orgânicos
4. **Blockchain**: Confirmar transação
5. **Verificação**: Buscar produto registrado
6. **Etherscan**: Verificar na blockchain

### **Dados de Teste:**
```javascript
// Produto de exemplo
{
  name: "Tomates Orgânicos",
  category: "vegetables",
  producer: "Fazenda Verde",
  farmLocation: "São Paulo, SP",
  quantity: 100,
  unit: "kg",
  certifications: ["organic", "non-gmo"]
}
```

## 📊 Monitoramento

### **Banco de Dados:**
```sql
-- Estatísticas no PgAdmin
SELECT 
  (SELECT COUNT(*) FROM users) as usuarios,
  (SELECT COUNT(*) FROM products) as produtos,
  (SELECT COUNT(*) FROM supply_chain_events) as eventos;
```

### **Blockchain:**
- **Contrato**: `https://sepolia.etherscan.io/address/ENDERECO_DO_CONTRATO`
- **Transações**: `https://sepolia.etherscan.io/tx/HASH_TRANSACAO`
- **Debug API**: `http://localhost:3001/api/debug/data`

## 🛠️ Troubleshooting

### **Problemas Comuns:**

**MetaMask não conecta:**
```javascript
// Verificar se está instalado
if (typeof window.ethereum === 'undefined') {
  console.log('MetaMask não instalado!');
}
```

**Rede incorreta:**
- Verificar se está em Sepolia (Chain ID: 11155111)
- Usar botão "Trocar para Sepolia" no app

**Saldo insuficiente:**
- Obter ETH em: https://sepoliafaucet.com/
- Mínimo recomendado: 0.01 ETH

**Erro no backend:**
```bash
# Reiniciar containers
docker-compose restart

# Verificar logs
docker-compose logs postgres
```

## 🎓 Para Apresentação do TCC

### **Demonstração Ao Vivo:**
1. **Conectar MetaMask** na apresentação
2. **Registrar produto** em tempo real
3. **Mostrar transação** no Etherscan
4. **Buscar produto** no BlockchainTracker
5. **Evidenciar transparência** dos dados

### **Pontos Técnicos:**
- ✅ **Blockchain Real**: Sepolia Testnet
- ✅ **Smart Contracts**: Solidity auditável
- ✅ **Imutabilidade**: Dados não alteráveis
- ✅ **Transparência**: Verificável publicamente
- ✅ **Escalabilidade**: Arquitetura híbrida

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nome`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/nome`
5. Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja `LICENSE` para detalhes.

## 👨‍💻 Autor

**Helio Breda Netto** - TCC Faculdade
- GitHub: [@HeliosBN](https://github.com/HeliosBN)
- LinkedIn: [Perfil](https://linkedin.com/in/helio-bezerra)

---

## 🚀 Status do Projeto

✅ **Backend**: PostgreSQL + Express.js  
✅ **Frontend**: React + Bootstrap  
✅ **Blockchain**: Smart Contracts Sepolia  
✅ **Integração**: Web3 + MetaMask  
✅ **Documentação**: Completa  

**Pronto para apresentação do TCC!** 🎓
