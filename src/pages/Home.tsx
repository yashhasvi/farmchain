import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { Sprout, Truck, ShoppingCart, Shield, Eye, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const { walletConnected } = useWallet();

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Blockchain Security',
      description: 'All data is secured on the Avalanche blockchain, ensuring immutable and transparent records.',
    },
    {
      icon: <Eye className="h-8 w-8 text-blue-600" />,
      title: 'Complete Transparency',
      description: 'Track products from farm to table with full visibility into the supply chain journey.',
    },
    {
      icon: <Zap className="h-8 w-8 text-amber-600" />,
      title: 'Real-time Updates',
      description: 'IoT sensors provide real-time environmental data throughout the supply chain.',
    },
  ];

  const roles = [
    {
      icon: <Sprout className="h-12 w-12 text-green-600" />,
      title: 'Producer Dashboard',
      description: 'Register new products and track their journey through the supply chain.',
      link: '/producer',
      color: 'green',
    },
    {
      icon: <Truck className="h-12 w-12 text-blue-600" />,
      title: 'Retailer Dashboard',
      description: 'Update product status and add IoT data at each supply chain step.',
      link: '/retailer',
      color: 'blue',
    },
    {
      icon: <ShoppingCart className="h-12 w-12 text-purple-600" />,
      title: 'Consumer Verification',
      description: 'Scan QR codes to verify product authenticity and view complete history.',
      link: '/verify/demo',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Farm
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {' '}Chain
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionizing supply chain transparency with Avalanche blockchain technology.
            From farm to fork, every step is verified, secured, and traceable.
          </p>
          
          {!walletConnected && (
            <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <p className="text-amber-800 text-sm">
                <strong>Getting Started:</strong> Connect your MetaMask wallet to begin using the platform.
              </p>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-white/80 rounded-2xl mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <Link
              key={index}
              to={role.link}
              className={`block bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-8 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-lg group ${
                !walletConnected && role.link !== '/verify/demo' 
                  ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                  : ''
              }`}
            >
              <div className={`flex items-center justify-center w-20 h-20 bg-${role.color}-100 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                {role.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                {role.title}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {role.description}
              </p>
              <div className="text-center">
                <span className={`inline-flex items-center px-4 py-2 bg-${role.color}-100 text-${role.color}-700 rounded-lg font-medium group-hover:bg-${role.color}-200 transition-colors`}>
                  Get Started
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/30 backdrop-blur-sm border-y border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '100%', label: 'Transparency' },
              { number: '24/7', label: 'Real-time Tracking' },
              { number: '∞', label: 'Immutable Records' },
              { number: '0', label: 'Trust Required' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;