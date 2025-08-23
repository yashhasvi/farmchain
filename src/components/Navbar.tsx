import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { Sprout, Wallet } from 'lucide-react';

const Navbar: React.FC = () => {
  const { walletConnected, userAddress, connectWallet, isCorrectNetwork, switchNetwork } = useWallet();
  const location = useLocation();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/producer', label: 'Producer' },
    { path: '/retailer', label: 'Retailer' },
  ];

  return (
    <>
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 bg-green-500/20 rounded-lg backdrop-blur-sm">
                <Sprout className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xl font-bold text-gray-800">SupplyChain</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-green-600 bg-green-50/50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50/30'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              {walletConnected ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                    <Wallet className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-800">
                      {formatAddress(userAddress!)}
                    </span>
                  </div>
                  {!isCorrectNetwork && (
                    <button
                      onClick={switchNetwork}
                      className="px-4 py-2 bg-red-500/20 text-red-700 rounded-lg border border-red-300 hover:bg-red-500/30 transition-colors text-sm font-medium"
                    >
                      Switch Network
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-700 font-medium py-2 px-4 rounded-lg border border-green-300 transition-all duration-200 hover:scale-105"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Network Warning Banner */}
      {walletConnected && !isCorrectNetwork && (
        <div className="bg-red-500/10 border-b border-red-300/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Wrong network detected. Please switch to <strong>Avalanche Fuji Testnet</strong> to continue.
                  </p>
                </div>
              </div>
              <button
                onClick={switchNetwork}
                className="text-sm text-red-700 hover:text-red-600 font-medium underline"
              >
                Switch Network
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;