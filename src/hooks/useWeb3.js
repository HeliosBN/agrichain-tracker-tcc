import { useState, useEffect, useCallback } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 em hex
const SEPOLIA_CONFIG = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'SepoliaETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    'https://rpc.sepolia.org',
  ],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

export const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState('');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState('');

  // Detectar MetaMask
  const detectMetaMask = useCallback(async () => {
    try {
      const provider = await detectEthereumProvider();
      
      if (provider && provider === window.ethereum) {
        console.log('🦊 MetaMask detectado!');
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        
        // Verificar se já está conectado
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccounts(accounts);
          setCurrentAccount(accounts[0]);
          setIsConnected(true);
          
          // Verificar rede
          const chainId = await web3Instance.eth.getChainId();
          setChainId('0x' + chainId.toString(16));
          setIsCorrectNetwork('0x' + chainId.toString(16) === SEPOLIA_CHAIN_ID);
          
          // Obter saldo
          await updateBalance(accounts[0], web3Instance);
        }
        
        return true;
      } else {
        setError('MetaMask não encontrado. Por favor, instale o MetaMask.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao detectar MetaMask:', error);
      setError('Erro ao conectar com MetaMask: ' + error.message);
      return false;
    }
  }, []);

  // Conectar wallet
  const connectWallet = useCallback(async () => {
    if (!web3) {
      const detected = await detectMetaMask();
      if (!detected) return false;
    }

    try {
      setIsConnecting(true);
      setError('');

      // Solicitar acesso às contas
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccounts(accounts);
        setCurrentAccount(accounts[0]);
        setIsConnected(true);
        
        // Verificar rede
        const chainId = await web3.eth.getChainId();
        setChainId('0x' + chainId.toString(16));
        setIsCorrectNetwork('0x' + chainId.toString(16) === SEPOLIA_CHAIN_ID);
        
        // Obter saldo
        await updateBalance(accounts[0], web3);
        
        console.log('✅ Wallet conectada:', accounts[0]);
        return true;
      }
    } catch (error) {
      console.error('Erro ao conectar wallet:', error);
      setError('Erro ao conectar wallet: ' + error.message);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [web3]);

  // Trocar para rede Sepolia
  const switchToSepolia = useCallback(async () => {
    try {
      setError('');
      
      // Primeiro tentar trocar para Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      
      console.log('✅ Rede trocada para Sepolia');
      return true;
    } catch (switchError) {
      // Se a rede não existe, adicionar ela
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_CONFIG],
          });
          
          console.log('✅ Rede Sepolia adicionada e ativada');
          return true;
        } catch (addError) {
          console.error('Erro ao adicionar rede Sepolia:', addError);
          setError('Erro ao adicionar rede Sepolia: ' + addError.message);
          return false;
        }
      } else {
        console.error('Erro ao trocar para Sepolia:', switchError);
        setError('Erro ao trocar para Sepolia: ' + switchError.message);
        return false;
      }
    }
  }, []);

  // Atualizar saldo
  const updateBalance = useCallback(async (address, web3Instance = web3) => {
    try {
      if (web3Instance && address) {
        const balanceWei = await web3Instance.eth.getBalance(address);
        const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
        setBalance(parseFloat(balanceEth).toFixed(4));
      }
    } catch (error) {
      console.error('Erro ao obter saldo:', error);
    }
  }, [web3]);

  // Desconectar wallet
  const disconnectWallet = useCallback(() => {
    setAccounts([]);
    setCurrentAccount('');
    setIsConnected(false);
    setBalance('0');
    setChainId('');
    setIsCorrectNetwork(false);
    setError('');
    console.log('🔌 Wallet desconectada');
  }, []);

  // Listeners para mudanças no MetaMask
  useEffect(() => {
    if (window.ethereum) {
      // Mudança de conta
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccounts(accounts);
          setCurrentAccount(accounts[0]);
          updateBalance(accounts[0]);
          console.log('🔄 Conta alterada para:', accounts[0]);
        }
      };

      // Mudança de rede
      const handleChainChanged = (chainId) => {
        setChainId(chainId);
        setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
        console.log('🔄 Rede alterada para:', chainId);
        
        // Atualizar saldo na nova rede
        if (currentAccount) {
          updateBalance(currentAccount);
        }
      };

      // Adicionar listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [currentAccount, disconnectWallet, updateBalance]);

  // Auto-detectar MetaMask na inicialização
  useEffect(() => {
    detectMetaMask();
  }, [detectMetaMask]);

  // Funções utilitárias
  const formatAddress = useCallback((address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  const getEtherscanUrl = useCallback((txHash) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }, []);

  const getAddressUrl = useCallback((address) => {
    return `https://sepolia.etherscan.io/address/${address}`;
  }, []);

  return {
    // Estado
    web3,
    accounts,
    currentAccount,
    isConnecting,
    isConnected,
    chainId,
    isCorrectNetwork,
    balance,
    error,
    
    // Ações
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    updateBalance,
    
    // Utilitários
    formatAddress,
    getEtherscanUrl,
    getAddressUrl,
    
    // Constantes
    SEPOLIA_CHAIN_ID,
    SEPOLIA_CONFIG,
  };
};

export default useWeb3;