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
}

interface WalletProviderProps {
  children: ReactNode;
}

// --- BROWSER WALLET DETECTION (Optimized for Core Wallet First) ---
const getCoreProvider = (): any => {
    // Specifically looks for Core Wallet's provider
    if (window.avalanche) {
        return window.avalanche;
    }
    toast.error('Core Wallet not found! Please install the extension.');
    return null;
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
   * Switches the wallet's network to the Fuji Testnet.
   * If the network is not added, it prompts the user to add it.
   */
  const switchNetwork = async (provider: any): Promise<boolean> => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_FUJI.chainId }],
      });
      // The `chainChanged` listener will handle the page reload and state update.
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_FUJI],
          });
          return true;
        } catch (addError) {
          toast.error('Failed to add Avalanche Fuji network.');
        }
      } else {
        toast.error('You must switch to the Fuji network to continue.');
      }
      return false;
    }
  };

  /**
   * Core function to update all wallet-related states once connected to the correct network.
   */
  const setupWalletState = async (injectedProvider: any) => {
    const web3Provider = new ethers.BrowserProvider(injectedProvider);
    const signerInstance = await web3Provider.getSigner();
    const network = await web3Provider.getNetwork();
    const address = await signerInstance.getAddress();

    setProvider(web3Provider);
    setSigner(signerInstance);
    setUserAddress(address);
    setChainId(`0x${network.chainId.toString(16)}`);
    setWalletConnected(true);
    toast.success('Wallet connected successfully!');
  };


  /**
   * Connects the wallet, checks the network, and prompts to switch if necessary.
   */
  const connectWallet = async () => {
    const injectedProvider = getCoreProvider();
    if (!injectedProvider) return;

    try {
        // 1. Request account access first.
        await injectedProvider.request({ method: 'eth_requestAccounts' });
        
        // 2. Create a temporary provider just to check the network.
        const tempProvider = new ethers.BrowserProvider(injectedProvider);
        const network = await tempProvider.getNetwork();

        // 3. Check if the network is correct.
        if (network.chainId.toString() !== AVALANCHE_FUJI.chainId.substring(2)) { // Compare decimal string
            toast('Wrong network detected. Please approve the switch to Fuji.');
            await switchNetwork(injectedProvider);
            // The page will reload automatically due to the 'chainChanged' listener if successful.
        } else {
            // 4. If the network is already correct, set up the wallet state.
            await setupWalletState(injectedProvider);
        }
    } catch (error: any) {
        console.error('Error connecting wallet:', error);
        // Handle user rejection
        if (error.code === 4001) {
            toast.error('Connection request rejected.');
        } else {
            toast.error('Failed to connect wallet.');
        }
    }
  };
  
  /**
   * Effect to handle wallet events like account or network changes.
   */
  useEffect(() => {
    const injectedProvider = getCoreProvider();
    if (injectedProvider) {
      const handleChainChanged = () => {
        // Reload to get the new network state.
        window.location.reload();
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet.
          window.location.reload();
        } else {
          // User switched to another account.
          toast('Account changed. Reloading...');
          window.location.reload();
        }
      };

      injectedProvider.on('chainChanged', handleChainChanged);
      injectedProvider.on('accountsChanged', handleAccountsChanged);

      return () => {
        injectedProvider.removeListener('chainChanged', handleChainChanged);
        injectedProvider.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        userAddress,
        provider,
        signer,
        connectWallet,
        isCorrectNetwork,
        // We don't need to export switchNetwork as it's now handled automatically.
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