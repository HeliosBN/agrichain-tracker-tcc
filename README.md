#  AgriChainTracker

O AgriChain é uma plataforma completa de rastreamento para a cadeia de suprimentos agrícola, utilizando tecnologia blockchain para garantir transparência, imutabilidade e confiabilidade dos dados. O sistema integra banco de dados PostgreSQL com blockchain Ethereum (rede Sepolia) para criar um sistema híbrido robusto.

##  Funcionalidades Principais


### Integração Blockchain
- Smart contracts em Solidity na rede Sepolia
- Conexão MetaMask para transações
- Registro imutável de produtos na blockchain
- Rastreamento completo da cadeia de suprimentos
- Verificação via Etherscan

###  Gestão de Produtos
- Registro detalhado de produtos agrícolas
- Categorização (vegetais, frutas, grãos, etc.)
- Certificações (orgânico, fair-trade, etc.)
- Dados de qualidade e rastreabilidade

###  Visualização e Monitoramento
- Dashboard responsivo com Bootstrap 5
- Busca de produtos na blockchain
- Timeline de eventos da cadeia
- Estatísticas em tempo real

## 🛠️ Tecnologias Utilizadas

### Frontend
- React 18 - Framework principal
- Vite - Build tool e dev server
- Bootstrap 5 - Framework CSS responsivo
- React Bootstrap - Componentes React
- Web3.js - Interação com blockchain
- MetaMask - Conexão com wallet Ethereum

### Backend
- Node.js - Runtime JavaScript
- Express.js - Framework web
- Sequelize - ORM para PostgreSQL

### Blockchain
- Solidity ^0.8.19 - Smart contracts
- Ethereum Sepolia - Rede de teste
- MetaMask - Wallet e provider
- Etherscan - Explorer de blockchain

### Banco de Dados
- PostgreSQL 15 - Banco principal
- Docker - Containerização
- PgAdmin - Interface administrativa


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





