import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { Sprout, Wallet } from 'lucide-react';

const Navbar: React.FC = () => {

  const { walletConnected, userAddress, connectWallet } = useWallet();
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
              <span className="text-xl font-bold text-gray-800">FarmChain</span>
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

    </>
  );
};

export default Navbar;