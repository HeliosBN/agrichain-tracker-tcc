import React, { useState } from 'react';

const ContractTest = () => {
  const [result, setResult] = useState('');
  const [testing, setTesting] = useState(false);

  const testContract = async () => {
    setTesting(true);
    setResult('🔍 Testando contrato...');

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask não detectado');
      }

      // Conectar
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const Web3 = (await import('web3')).default;
      const web3 = new Web3(window.ethereum);
      
      // Verificar rede
      const chainId = await web3.eth.getChainId();
      if (Number(chainId) !== 11155111) {
        throw new Error(`Rede incorreta. Atual: ${chainId}, Esperada: 11155111 (Sepolia)`);
      }

      const { AGRICHAIN_ABI, CONTRACT_ADDRESS } = await import('../../contracts/AgriChainABI_Fixed.js');
      
      setResult(prev => prev + `\n📍 Endereço do contrato: ${CONTRACT_ADDRESS}`);
      
      // Verificar se existe código no endereço
      const code = await web3.eth.getCode(CONTRACT_ADDRESS);
      setResult(prev => prev + `\n📜 Código do contrato: ${code.length > 2 ? 'Existe ✅' : 'Não existe ❌'}`);
      
      if (code === '0x') {
        throw new Error('Não há contrato neste endereço!');
      }

      // Criar instância do contrato
      const contract = new web3.eth.Contract(AGRICHAIN_ABI, CONTRACT_ADDRESS);
      setResult(prev => prev + '\n🔗 Contrato instanciado');

      // Testar leitura simples (totalProducts)
      try {
        const totalProducts = await contract.methods.totalProducts().call();
        setResult(prev => prev + `\n📊 Total de produtos: ${totalProducts}`);
      } catch (error) {
        setResult(prev => prev + `\n❌ Erro ao ler totalProducts: ${error.message}`);
      }

      // Testar getProduct com ID inexistente (deve retornar vazio, não reverter)
      try {
        const product = await contract.methods.getProduct('test-inexistente').call();
        setResult(prev => prev + `\n🔍 Produto teste: ${JSON.stringify(product)}`);
      } catch (error) {
        setResult(prev => prev + `\n⚠️ Erro ao ler produto teste: ${error.message}`);
      }

      const accounts = await web3.eth.getAccounts();
      
      // Testar estimativa de gas com dados simples
      try {
        setResult(prev => prev + '\n⛽ Testando estimativa de gas...');
        
        const gasEstimate = await contract.methods.storeProduct(
          'test-123',
          'Produto Teste',
          'vegetables',
          'Produtor Teste',
          'Local Teste'
        ).estimateGas({ from: accounts[0] });
        
        setResult(prev => prev + `\n✅ Gas estimado: ${gasEstimate}`);
        
        // Se chegou até aqui, o contrato está OK
        setResult(prev => prev + '\n🎉 Contrato está funcionando corretamente!');
        
      } catch (gasError) {
        setResult(prev => prev + `\n❌ Erro na estimativa: ${gasError.message}`);
        
        // Vamos tentar ver a razão do revert
        if (gasError.message.includes('revert')) {
          setResult(prev => prev + '\n🔍 Tentando descobrir a razão do revert...');
          
          try {
            // Tentar chamada direta para ver o erro
            await contract.methods.storeProduct(
              'test-123',
              'Produto Teste', 
              'vegetables',
              'Produtor Teste',
              'Local Teste'
            ).call({ from: accounts[0] });
            
          } catch (callError) {
            setResult(prev => prev + `\n🚨 Razão do revert: ${callError.message}`);
          }
        }
      }

    } catch (error) {
      setResult(prev => prev + `\n❌ Erro geral: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header">
        <h6 className="mb-0">🔧 Teste Detalhado do Contrato</h6>
      </div>
      <div className="card-body">
        <button 
          className="btn btn-warning"
          onClick={testContract}
          disabled={testing}
        >
          {testing ? '🔄 Testando...' : '🧪 Testar Contrato Completo'}
        </button>
        
        {result && (
          <div className="mt-3">
            <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', fontSize: '0.85em' }}>
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractTest;