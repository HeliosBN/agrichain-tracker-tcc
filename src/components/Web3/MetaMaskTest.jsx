import React, { useState } from 'react';

const MetaMaskTest = () => {
  const [testResult, setTestResult] = useState('');
  const [testing, setTesting] = useState(false);

  const testMetaMask = async () => {
    setTesting(true);
    setTestResult('🔍 Testando MetaMask...');

    try {
      // 1. Verificar se MetaMask está instalado
      if (typeof window.ethereum === 'undefined') {
        throw new Error('❌ MetaMask não está instalado');
      }

      setTestResult('✅ MetaMask detectado. Verificando status...');

      // 2. Verificar se MetaMask está desbloqueado
      const isUnlocked = await window.ethereum._metamask.isUnlocked();
      if (!isUnlocked) {
        throw new Error('🔒 MetaMask está bloqueado. Por favor, desbloqueie-o primeiro.');
      }

      setTestResult('🔓 MetaMask desbloqueado. Solicitando conexão...');

      // 3. Solicitar conexão (deve abrir popup)
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('❌ Nenhuma conta foi conectada');
      }

      setTestResult(`✅ Conectado! Conta: ${accounts[0]}`);

      // 4. Verificar rede
      const Web3 = (await import('web3')).default;
      const web3 = new Web3(window.ethereum);
      const chainId = await web3.eth.getChainId();
      
      setTestResult(prev => prev + `\n🌐 Rede atual: ${chainId} ${chainId === 11155111n ? '(Sepolia ✅)' : '(Não é Sepolia ⚠️)'}`);

      // 5. Verificar saldo
      const balance = await web3.eth.getBalance(accounts[0]);
      const ethBalance = web3.utils.fromWei(balance, 'ether');
      
      setTestResult(prev => prev + `\n💰 Saldo: ${parseFloat(ethBalance).toFixed(4)} ETH`);

      // 6. Testar transação simulada (estimativa de gas)
      setTestResult(prev => prev + '\n🧪 Testando estimativa de gas...');
      
      const { AGRICHAIN_ABI, CONTRACT_ADDRESS } = await import('../../contracts/AgriChainABI_Fixed.js');
      const contract = new web3.eth.Contract(AGRICHAIN_ABI, CONTRACT_ADDRESS);
      
      try {
        const gasEstimate = await contract.methods.storeProduct(
          'test-123',        // ID
          'Produto Teste',   // Nome
          'vegetables',      // Categoria
          'Produtor Teste',  // Produtor
          'Local Teste'      // Localização
        ).estimateGas({ from: accounts[0] });
        
        setTestResult(prev => prev + `\n⛽ Gas estimado: ${gasEstimate} (${web3.utils.fromWei((BigInt(gasEstimate) * BigInt(20000000000)).toString(), 'ether')} ETH aprox.)`);
        setTestResult(prev => prev + '\n🎉 Teste completo! MetaMask está funcionando corretamente.');
        
      } catch (gasError) {
        setTestResult(prev => prev + `\n⚠️ Erro na estimativa de gas: ${gasError.message}`);
      }

    } catch (error) {
      setTestResult(`❌ Erro: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h6 className="mb-0">🦊 Teste de Conexão MetaMask</h6>
      </div>
      <div className="card-body">
        <button 
          className="btn btn-primary"
          onClick={testMetaMask}
          disabled={testing}
        >
          {testing ? '🔄 Testando...' : '🧪 Testar MetaMask'}
        </button>
        
        {testResult && (
          <div className="mt-3">
            <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', fontSize: '0.9em' }}>
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaMaskTest;