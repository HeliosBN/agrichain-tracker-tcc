# 🌐 Configuração Blockchain - AgriChain

## 📋 Guia de Configuração da Rede Sepolia

### 🦊 **1. Instalação e Configuração do MetaMask**

#### Instalação:
1. Acesse: https://metamask.io/download/
2. Instale a extensão no seu navegador
3. Crie uma nova wallet ou importe uma existente

#### Configuração da Rede Sepolia:
```javascript
// Dados da Rede Sepolia
Nome da Rede: Sepolia Test Network
RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
Chain ID: 11155111
Símbolo da Moeda: ETH
Block Explorer: https://sepolia.etherscan.io
```

### 💰 **2. Obter SepoliaETH (Moeda de Teste)**

#### Faucets Disponíveis:
1. **Sepolia Faucet (Alchemy)**: https://sepoliafaucet.com/
2. **ChainLink Faucet**: https://faucets.chain.link/sepolia
3. **Infura Faucet**: https://www.infura.io/faucet/sepolia

#### Como Usar:
1. Conecte sua wallet MetaMask
2. Cole seu endereço público
3. Solicite 0.1 ETH (suficiente para testes)
4. Aguarde 1-2 minutos para receber

### 🔧 **3. Deploy do Smart Contract**

#### Ferramentas Necessárias:
- **Remix IDE**: https://remix.ethereum.org/
- **Hardhat** (alternativa): https://hardhat.org/
- **Truffle** (alternativa): https://trufflesuite.com/

#### Deploy via Remix:
1. Abra https://remix.ethereum.org/
2. Crie um novo arquivo: `AgriChainTracker.sol`
3. Cole o código do contrato (localizado em `/src/contracts/AgriChainTracker.sol`)
4. Compile o contrato (Solidity 0.8.19+)
5. Configure Environment: "Injected Provider - MetaMask"
6. Selecione Sepolia no MetaMask
7. Deploy o contrato
8. **IMPORTANTE**: Copie o endereço do contrato gerado

#### Atualizar Endereço no Frontend:
```javascript
// Arquivo: /src/contracts/AgriChainABI.js
export const CONTRACT_ADDRESS = 'SEU_ENDERECO_DO_CONTRATO_AQUI';
```

### 🏗️ **4. Configuração do Infura (RPC Provider)**

#### Criar Conta no Infura:
1. Acesse: https://infura.io/
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a chave do projeto
5. Configure a URL RPC:

```javascript
// URL Personalizada (opcional)
https://sepolia.infura.io/v3/SUA_CHAVE_DO_PROJETO
```

### 🔍 **5. Verificação e Monitoramento**

#### Etherscan Sepolia:
- **URL**: https://sepolia.etherscan.io/
- **Verificar Transações**: Cole o hash da transação
- **Verificar Contratos**: Cole o endereço do contrato
- **Verificar Contas**: Cole o endereço da wallet

#### URLs Úteis:
```
Transação: https://sepolia.etherscan.io/tx/HASH_DA_TRANSACAO
Contrato: https://sepolia.etherscan.io/address/ENDERECO_DO_CONTRATO
Wallet: https://sepolia.etherscan.io/address/ENDERECO_DA_WALLET
```

### 🚀 **6. Testando a Integração**

#### Fluxo de Teste Completo:
1. **Conectar MetaMask** → Componente detecta wallet
2. **Trocar para Sepolia** → Auto-switch ou manual
3. **Verificar Saldo** → Mínimo 0.01 ETH recomendado
4. **Registrar Produto** → Teste com dados reais
5. **Confirmar Transação** → MetaMask popup
6. **Verificar no Etherscan** → Hash da transação
7. **Buscar Produto** → BlockchainTracker component

### ⚡ **7. Otimizações de Gas**

#### Custos Estimados (Sepolia):
```
Registro de Produto: ~0.01-0.02 ETH
Evento da Cadeia: ~0.005-0.01 ETH
Consultas (view): Gratuitas
```

#### Dicas para Economia:
- Execute transações em horários de menor movimento
- Use estimativa de gas automática
- Mantenha dados IPFS externos (futuro)

### 🛠️ **8. Troubleshooting**

#### Problemas Comuns:

**MetaMask não detectado:**
```javascript
// Verificar se está instalado
if (typeof window.ethereum === 'undefined') {
  alert('MetaMask não instalado!');
}
```

**Rede incorreta:**
```javascript
// Chain ID da Sepolia = 11155111 (0xaa36a7 em hex)
await window.ethereum.request({
  method: 'wallet_switchEthereumChain',
  params: [{ chainId: '0xaa36a7' }],
});
```

**Gas insuficiente:**
- Verificar saldo ETH
- Aumentar limite de gas
- Aguardar menor congestionamento

**Transação falhando:**
- Verificar autorização no contrato
- Validar dados de entrada
- Conferir estado do contrato

### 📊 **9. Monitoramento em Produção**

#### Métricas Importantes:
- Número de produtos registrados
- Gas médio usado por transação
- Tempo médio de confirmação
- Taxa de sucesso das transações

#### Alertas Recomendados:
- Saldo baixo na wallet do sistema
- Falhas consecutivas de transação
- Aumento anormal no custo de gas

### 🔒 **10. Segurança**

#### Boas Práticas:
- **Nunca** exponha chaves privadas no código
- Use variáveis de ambiente para dados sensíveis
- Implemente rate limiting para transações
- Monitore tentativas de acesso não autorizado

#### Backup da Wallet:
- Mantenha seed phrase em local seguro
- Use wallet separada para desenvolvimento
- Configure alertas de transações suspeitas

### 📱 **11. Recursos Adicionais**

#### Documentação:
- **Web3.js**: https://web3js.readthedocs.io/
- **MetaMask**: https://docs.metamask.io/
- **Ethereum**: https://ethereum.org/developers/
- **Solidity**: https://docs.soliditylang.org/

#### Comunidade:
- **Discord Ethereum**: https://discord.gg/ethereum
- **Stack Overflow**: Busque por "web3" e "solidity"
- **GitHub**: Veja projetos similares

---

## 🎯 **Status da Implementação**

✅ **Concluído:**
- Hook useWeb3 para gerenciamento MetaMask
- Smart Contract AgriChainTracker completo
- Web3Service para interação com contratos
- Componente MetaMaskConnect
- Integração no ProductRegistration
- BlockchainTracker para visualização

⏳ **Próximos Passos:**
1. Deploy do contrato na Sepolia
2. Configurar endereço do contrato no frontend
3. Testes end-to-end
4. Documentação final do TCC

---

## 🎉 **CONTRATO DEPLOYADO COM SUCESSO!**

### 📋 **Informações do Deploy:**
- **🏷️ Nome:** AgriChainSimple
- **📍 Endereço:** `0x501d6eF3d44cdc7AcbBF41e7dda8b0259595C174`
- **⏰ Data:** 14/10/2025 - 03:48:36 PM UTC
- **🔗 Hash:** `0x16f8fd33a7f1a24206fd7213d60ca73266cc9bc1c0a620d4f62e20c96f6582`
- **📦 Bloco:** #9410939
- **💰 Taxa:** 0.002139882014265888 ETH

### 🔗 **Links para Verificação:**
- **Etherscan:** https://sepolia.etherscan.io/address/0x501d6eF3d44cdc7AcbBF41e7dda8b0259595C174
- **Transação:** https://sepolia.etherscan.io/tx/0x16f8fd33a7f1a24206fd7213d60ca73266cc9bc1c0a620d4f62e20c96f6582

---

## 🚀 **Para Sua Apresentação de TCC**

### Pontos Destacar:
1. **Integração Real**: Sistema funciona com blockchain real (Sepolia)
2. **Transparência**: Todas as transações são verificáveis
3. **Imutabilidade**: Dados não podem ser alterados após registro
4. **Rastreabilidade**: Histórico completo da cadeia de suprimentos
5. **Tecnologia Atual**: Usa padrões da indústria (Ethereum, Solidity, Web3)

### Demonstração Ao Vivo:
1. Conectar MetaMask na apresentação
2. Registrar produto em tempo real
3. Mostrar transação no Etherscan
4. Buscar produto registrado
5. Mostrar transparência dos dados