import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers, BrowserProvider, Signer } from 'ethers';
import { AVALANCHE_FUJI } from '../config/contract'; // Assuming this contains your network config
import toast from 'react-hot-toast';

// --- TYPE DEFINITIONS ---
interface WalletContextType {
  walletConnected: boolean;
  userAddress: string | null;
  provider: BrowserProvider | null;
  signer: Signer | null;
  isCorrectNetwork: boolean;
  connectWallet: () => Promise<void>;
  switchNetwork: () => Promise<void>;
}

interface WalletProviderProps {
  children: ReactNode;
}

// --- BROWSER WALLET DETECTION ---
// Detects Core Wallet (window.avalanche) or MetaMask-like wallets (window.ethereum)
const getEthereumProvider = (): any => {
    return window.avalanche || window.ethereum;
}

// --- CONTEXT CREATION ---
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// --- HOOK for easy context access ---
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// --- WALLET PROVIDER COMPONENT ---
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const isCorrectNetwork = chainId === AVALANCHE_FUJI.chainId;

  /**
   * Core function to update all wallet-related states.
   * Encapsulates the logic to prevent repetition.
   */
  const updateWallet = useCallback(async () => {
    const injectedProvider = getEthereumProvider();
    if (injectedProvider) {
      const web3Provider = new ethers.BrowserProvider(injectedProvider);
      const accounts = await web3Provider.send('eth_accounts', []);
      
      if (accounts.length > 0) {
        const signerInstance = await web3Provider.getSigner();
        const network = await web3Provider.getNetwork();
        const address = await signerInstance.getAddress();

        setProvider(web3Provider);
        setSigner(signerInstance);
        setUserAddress(address);
        setChainId(`0x${network.chainId.toString(16)}`);
        setWalletConnected(true);
      } else {
        // No accounts are connected
        setWalletConnected(false);
        setUserAddress(null);
        setSigner(null);
      }
    }
  }, []);

  /**
   * Connects the wallet by requesting account access.
   */
  const connectWallet = async () => {
    const injectedProvider = getEthereumProvider();
    if (!injectedProvider) {
      toast.error('No browser wallet detected. Please install Core or MetaMask.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(injectedProvider);
      await provider.send('eth_requestAccounts', []);
      await updateWallet(); // Update state after successful connection
      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet.');
    }
  };

  /**
   * Switches the wallet's network to the Fuji Testnet.
   * If the network is not added, it prompts the user to add it.
   */
  const switchNetwork = async () => {
    const injectedProvider = getEthereumProvider();
    if (!injectedProvider) return;

    try {
      await injectedProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_FUJI.chainId }],
      });
    } catch (switchError: any) {
      // Code 4902 indicates the chain has not been added to the wallet.
      if (switchError.code === 4902) {
        try {
          await injectedProvider.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_FUJI],
          });
        } catch (addError) {
          console.error('Failed to add Fuji network:', addError);
          toast.error('Failed to add Avalanche Fuji network.');
        }
      } else {
        console.error('Failed to switch network:', switchError);
        toast.error('Failed to switch network.');
      }
    }
  };

  /**
   * Effect to handle wallet events and initial connection check.
   */
  useEffect(() => {
    const injectedProvider = getEthereumProvider();
    if (injectedProvider) {
      // Eagerly connect if the wallet is already authorized
      updateWallet();

      // Set up listeners for wallet events
      const handleAccountsChanged = () => {
        toast('Account changed. Reloading...');
        window.location.reload();
      };
      const handleChainChanged = () => {
        toast('Network changed. Reloading...');
        window.location.reload();
      };

      injectedProvider.on('accountsChanged', handleAccountsChanged);
      injectedProvider.on('chainChanged', handleChainChanged);

      // Cleanup listeners on component unmount
      return () => {
        injectedProvider.removeListener('accountsChanged', handleAccountsChanged);
        injectedProvider.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [updateWallet]);

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        userAddress,
        provider,
        signer,
        connectWallet,
        switchNetwork,
        isCorrectNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// TypeScript declaration to add `avalanche` to the window object
declare global {
  interface Window {
    ethereum?: any;
    avalanche?: any;
  }
}