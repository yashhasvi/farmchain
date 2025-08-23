import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import QRCodeModal from '../components/QRCodeModal';
import { Sprout, Plus, Package, Calendar, Hash, Clock } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  quantity: string;
  harvestDate: Date;
  statuses: string[];
  iotData: string[];
  timestamps: Date[];
}

const ProducerDashboard: React.FC = () => {
  const { walletConnected, userAddress, isCorrectNetwork } = useWallet();
  const { createProduct, getProductHistory, getProductsByOwner } = useContract();
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    harvestDate: '',
  });
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; productId: string; productName: string }>({
    isOpen: false,
    productId: '',
    productName: '',
  });

  // TODO COMMENT: This fetches products created by the current user
  // You may need to adjust this based on your contract implementation
  const loadUserProducts = async () => {
    if (!walletConnected || !userAddress || !isCorrectNetwork) return;
    
    try {
      setLoading(true);
      const productIds = await getProductsByOwner(userAddress);
      
      const productDetails = await Promise.all(
        productIds.map(async (id) => {
          try {
            return await getProductHistory(id);
          } catch (error) {
            console.error(`Error loading product ${id}:`, error);
            return null;
          }
        })
      );
      
      setProducts(productDetails.filter(Boolean) as Product[]);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProducts();
  }, [walletConnected, userAddress, isCorrectNetwork]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletConnected || !isCorrectNetwork) {
      return;
    }

    try {
      const harvestDate = new Date(formData.harvestDate);
      const productId = await createProduct(
        formData.name,
        parseInt(formData.quantity),
        harvestDate
      );
      
      if (productId) {
        setQrModal({
          isOpen: true,
          productId,
          productName: formData.name,
        });
        
        setFormData({ name: '', quantity: '', harvestDate: '' });
        loadUserProducts();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Connection Required</h2>
          <p className="text-gray-600">Please connect your MetaMask wallet to access the Producer Dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Producer Dashboard</h1>
          <p className="text-gray-600">Register new products and track their supply chain journey.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Registration Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Plus className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Register New Product</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="e.g., Organic Tomatoes"
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    id="harvestDate"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isCorrectNetwork}
                  className="w-full bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-green-700 font-semibold py-3 px-4 rounded-lg border border-green-300 transition-all duration-200 hover:scale-105"
                >
                  Register Product
                </button>
              </form>

              {!isCorrectNetwork && (
                <p className="mt-4 text-sm text-red-600 bg-red-50/80 p-3 rounded-lg">
                  Please switch to Avalanche Fuji Testnet to register products.
                </p>
              )}
            </div>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <p className="mt-2 text-gray-600">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No products registered yet.</p>
                  <p className="text-sm text-gray-500">Create your first product to get started!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Hash className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">ID: {product.id}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">{product.quantity} kg</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">
                                {product.harvestDate.toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">
                                {product.statuses.length} updates
                              </span>
                            </div>
                          </div>
                          
                          {product.statuses.length > 0 && (
                            <div className="mt-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                {product.statuses[product.statuses.length - 1]}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => setQrModal({
                            isOpen: true,
                            productId: product.id,
                            productName: product.name,
                          })}
                          className="ml-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 px-3 py-2 rounded-lg border border-blue-300 text-sm font-medium transition-colors"
                        >
                          View QR
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <QRCodeModal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal({ isOpen: false, productId: '', productName: '' })}
        productId={qrModal.productId}
        productName={qrModal.productName}
      />
    </div>
  );
};

export default ProducerDashboard;