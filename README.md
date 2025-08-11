# 🌾 AgriChain Tracker

## Sistema de Rastreabilidade da Cadeia de Suprimentos Agrícolas usando Blockchain

Uma aplicação web moderna e responsiva desenvolvida com React e Bootstrap que permite o rastreamento completo de produtos agrícolas desde a fazenda até o consumidor final, utilizando tecnologia blockchain para garantir transparência e autenticidade.

## 🎯 Objetivos do Projeto

### Objetivo Geral
Desenvolver um protótipo de website utilizando a tecnologia blockchain para rastrear cada etapa da cadeia de suprimentos agrícolas, desde a saída do produtor até o destino final, promovendo maior transparência, eficiência e confiabilidade no processo.

### Objetivos Específicos
- ✅ Implementar um sistema de rastreabilidade baseado em blockchain
- ✅ Propor um site responsivo para facilitar o acesso às informações
- ✅ Garantir a segurança dos dados e a integridade do sistema
- ✅ Facilitar o monitoramento em tempo real das etapas
- ✅ Integrar funcionalidades para cumprimento de normas regulatórias
- ✅ Validar o protótipo por meio de testes práticos

## 🚀 Funcionalidades

### 👨‍🌾 Para Produtores
- **Registro de Produtos**: Cadastro completo de produtos agrícolas
- **Gerenciamento de Certificações**: Validação de selos orgânicos e sustentáveis
- **Atualização de Status**: Acompanhamento em tempo real da produção
- **Dashboard Personalizado**: Visão geral dos produtos registrados

### 🚛 Para Distribuidores
- **Gestão de Remessas**: Controle completo das entregas
- **Monitoramento de Temperatura**: Acompanhamento de condições de transporte
- **Rastreamento em Tempo Real**: Localização e status das mercadorias
- **Relatórios de Entrega**: Histórico detalhado de todas as operações

### 👥 Para Consumidores
- **Rastreamento Simples**: Busca por código do produto ou QR Code
- **Histórico Completo**: Visualização de toda a jornada do produto
- **Verificação de Autenticidade**: Dados imutáveis na blockchain
- **Informações de Sustentabilidade**: Certificações e práticas ambientais

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interface de usuário
- **React Router DOM** - Navegação entre páginas
- **Bootstrap 5** - Framework CSS responsivo
- **React Bootstrap** - Componentes Bootstrap para React
- **Bootstrap Icons** - Biblioteca de ícones

### Blockchain
- **Web3.js** - Interação com a blockchain Ethereum
- **Ethers.js** - Biblioteca alternativa para blockchain
- **MetaMask** - Carteira digital para autenticação

### Ferramentas de Desenvolvimento
- **Vite** - Build tool moderna e rápida
- **ESLint** - Linting de código JavaScript
- **Git** - Controle de versão

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- MetaMask (para funcionalidades blockchain)

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/agrichain-tracker.git

# Entre no diretório
cd agrichain-tracker

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

### Variáveis de Ambiente
```env
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NETWORK_ID=1337
```

## 👨‍💻 Autor

**Helio Breda Netto**
- 🎓 Graduando em Sistemas De Informação
- 💼 Desenvolvedor Full Stack


---

 🌱+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
