import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';

// Mock contract ABI - replace with your actual contract ABI
const mockContractABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_location", "type": "string"},
      {"internalType": "string", "name": "_certifications", "type": "string"}
    ],
    "name": "registerProduct",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_productId", "type": "uint256"}],
    "name": "getProductHistory",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export const useSupplyChain = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock contract address - replace with your deployed contract address
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';

  const initWeb3 = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });

        if (accounts.length > 0) {
          const contractInstance = new web3Instance.eth.Contract(
            mockContractABI,
            contractAddress
          );

          setWeb3(web3Instance);
          setContract(contractInstance);
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } else {
        // For development/testing without MetaMask
        console.warn('MetaMask not detected. Using mock data for development.');
        setAccount('0x1234567890123456789012345678901234567890');
        setIsConnected(true);
      }
    } catch (err) {
      setError('Failed to connect to wallet: ' + err.message);
      console.error('Web3 initialization error:', err);
    } finally {
      setLoading(false);
    }
  }, [contractAddress]);

  useEffect(() => {
    initWeb3();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
          setIsConnected(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [initWeb3]);

  const registerProduct = async (productData) => {
    try {
      setLoading(true);
      setError('');

      if (!contract || !account) {
        throw new Error('Wallet not connected');
      }

      // Mock implementation for development
      const mockProductId = Date.now();
      console.log('Registering product:', productData);
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        productId: mockProductId,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
        success: true
      };

      // Uncomment for real blockchain interaction:
      /*
      const result = await contract.methods
        .registerProduct(
          productData.name,
          productData.location,
          productData.certifications
        )
        .send({ from: account });
      
      return {
        productId: result.events.ProductRegistered.returnValues.productId,
        transactionHash: result.transactionHash,
        success: true
      };
      */
    } catch (err) {
      setError('Failed to register product: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductHistory = async (productId) => {
    try {
      setLoading(true);
      setError('');

      // Mock implementation for development
      const mockHistory = [
        {
          address: '0x1234567890123456789012345678901234567890',
          role: 'Producer',
          timestamp: Date.now() - 86400000 * 3,
          location: 'Farm Valley, Brazil',
          action: 'Harvested'
        },
        {
          address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          role: 'Processor',
          timestamp: Date.now() - 86400000 * 2,
          location: 'Processing Plant, São Paulo',
          action: 'Processed'
        },
        {
          address: '0x9876543210987654321098765432109876543210',
          role: 'Distributor',
          timestamp: Date.now() - 86400000,
          location: 'Distribution Center, Rio de Janeiro',
          action: 'In Transit'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockHistory;

      // Uncomment for real blockchain interaction:
      /*
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const history = await contract.methods
        .getProductHistory(productId)
        .call();
      
      return history;
      */
    } catch (err) {
      setError('Failed to get product history: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId, newStatus, location) => {
    try {
      setLoading(true);
      setError('');

      // Mock implementation
      console.log('Updating product status:', { productId, newStatus, location });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        success: true,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
      };
    } catch (err) {
      setError('Failed to update product status: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to use this application.');
      return;
    }

    try {
      await initWeb3();
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
    setWeb3(null);
    setContract(null);
  };

  return {
    web3,
    contract,
    account,
    isConnected,
    loading,
    error,
    registerProduct,
    getProductHistory,
    updateProductStatus,
    connectWallet,
    disconnectWallet,
    setError
  };
};
