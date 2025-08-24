import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers, BrowserProvider, Signer } from 'ethers';
// import { AVALANCHE_FUJI } from '../config/contract';
import toast from 'react-hot-toast';

// --- Interfaces and Provider Detection ---
interface WalletContextType {
  walletConnected: boolean;
  userAddress: string | null;
  provider: BrowserProvider | null;
  signer: Signer | null;
  connectWallet: () => Promise<void>;
// ...existing code...
}
interface WalletProviderProps {
  children: ReactNode;
}


// ----------------------------------------------------------------

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  // const [chainId, setChainId] = useState<string | null>(null);

  // Core connection logic
  const connectWallet = async () => {
    const injectedProvider = window.ethereum;
    if (!injectedProvider) {
      toast.error('Ethereum wallet not found! Please install MetaMask, Core Wallet, or a compatible wallet.');
      return;
    }
    try {
      const web3Provider = new ethers.BrowserProvider(injectedProvider);
      await web3Provider.send('eth_requestAccounts', []);
      const signerInstance = await web3Provider.getSigner();
      const address = (await signerInstance.getAddress()).toLowerCase();
      const allowedAddress = '0x958fe02ddbc4de192ecb5b82e145d58a90e408a4';
      if (address !== allowedAddress) {
        toast.error('Only the specified Core Wallet address can use this dApp.');
        setProvider(null);
        setSigner(null);
        setUserAddress(null);
        setWalletConnected(false);
        localStorage.removeItem('walletConnected');
        return;
      }
      setProvider(web3Provider);
      setSigner(signerInstance);
      setUserAddress(address);
      setWalletConnected(true);
      localStorage.setItem('walletConnected', 'true');
      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet.');
      localStorage.removeItem('walletConnected');
    }
  };

  // Effect runs once on mount
  useEffect(() => {
    const injectedProvider = window.ethereum;
    let lastAccount: string | null = null;
    // Remember Me: if user was previously connected, prompt to reconnect
    if (injectedProvider) {
      if (localStorage.getItem('walletConnected') === 'true') {
        // Try to reconnect silently (no popup if possible)
        (async () => {
          try {
            const web3Provider = new ethers.BrowserProvider(injectedProvider);
            const accounts = await web3Provider.send('eth_accounts', []);
            if (accounts.length > 0) {
              // Only connect if not already connected
              if (!walletConnected || userAddress !== accounts[0].toLowerCase()) {
                // Use connectWallet, which will set localStorage again
                await connectWallet();
              }
              lastAccount = accounts[0].toLowerCase();
            } else {
              setWalletConnected(false);
              setUserAddress(null);
              setSigner(null);
              localStorage.removeItem('walletConnected');
            }
          } catch {
            setWalletConnected(false);
            setUserAddress(null);
            setSigner(null);
            localStorage.removeItem('walletConnected');
          }
        })();
      }
      // Only handle account changes, do NOT auto-connect on mount if not remembered
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletConnected(false);
          setUserAddress(null);
          setSigner(null);
          localStorage.removeItem('walletConnected');
          toast('Wallet disconnected.');
        } else {
          const allowedAddress = '0x958fe02ddbc4de192ecb5b82e145d58a90e408a4';
          const newAccount = accounts[0].toLowerCase();
          if (newAccount !== allowedAddress) {
            setWalletConnected(false);
            setUserAddress(null);
            setSigner(null);
            localStorage.removeItem('walletConnected');
            toast.error('Only the specified Core Wallet address can use this dApp.');
          } else {
            if (lastAccount !== newAccount) {
              setUserAddress(newAccount);
              toast('Account switched.');
              lastAccount = newAccount;
            }
          }
        }
      };

      injectedProvider.on('accountsChanged', handleAccountsChanged);

      return () => {
        injectedProvider.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []); // only once on mount

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        userAddress,
        provider,
        signer,
        connectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Global type declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}

