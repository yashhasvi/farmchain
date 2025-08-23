import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useContract } from '../hooks/useContract';
import { Truck, Package, Search, Heater as Update, Thermometer } from 'lucide-react';

interface ProductHistory {
  id: string;
  name: string;
  quantity: string;
  harvestDate: Date;
  statuses: string[];
  iotData: string[];
  timestamps: Date[];
}

const RetailerDashboard: React.FC = () => {
  const { walletConnected, signer } = useWallet();
  const { addUpdate, getProductHistory } = useContract();
  
  const [updateForm, setUpdateForm] = useState({
    productId: '',
    status: '',
    iotData: '',
  });
  
  const [searchId, setSearchId] = useState('');
  const [productHistory, setProductHistory] = useState<ProductHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const statusOptions = [
    'Shipped',
    'In Transit',
    'Arrived at Warehouse',
    'Quality Checked',
    'Ready for Retail',
    'Delivered',
  ];

  // TODO COMMENT: You may want to customize these IoT data templates based on your use case
  const iotTemplates = [
    {
      name: 'Temperature & Humidity',
      data: JSON.stringify({
        temperature: '4°C',
        humidity: '60%',
        location: 'Warehouse A'
      }, null, 2),
    },
    {
      name: 'Transport Conditions',
      data: JSON.stringify({
        temperature: '2°C',
        humidity: '65%',
        vibration: 'Low',
        location: 'In Transit - Highway 101'
      }, null, 2),
    },
    {
      name: 'Quality Check',
      data: JSON.stringify({
        quality_score: '9.2/10',
        freshness: 'Excellent',
        contamination: 'None detected',
        inspector: 'John Doe',
        location: 'Quality Control Center'
      }, null, 2),
    },
  ];

  const handleUpdateSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!walletConnected) return;

    try {
      setLoading(true);
      if (!signer) throw new Error('No signer');
      await addUpdate(signer, updateForm.productId, updateForm.status, updateForm.iotData);

      setUpdateForm({ productId: '', status: '', iotData: '' });

      // Refresh product history if we're viewing the same product
      if (productHistory && productHistory.id === updateForm.productId) {
        await searchProduct();
      }
    } catch (error) {
      console.error('Error adding update:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProduct = async () => {
  if (!searchId.trim() || !walletConnected) return;

    try {
      setSearchLoading(true);
      if (!signer) throw new Error('No signer');
      const history = await getProductHistory(signer, searchId);
      // Defensive: always set harvestDate to a Date (never null)
      setProductHistory({
        ...history,
        harvestDate: history.harvestDate || new Date(0),
      });
    } catch (error) {
      console.error('Error searching product:', error);
      setProductHistory(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setUpdateForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const useTemplate = (template: string) => {
    setUpdateForm(prev => ({
      ...prev,
      iotData: template,
    }));
  };

  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Truck className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet Connection Required</h2>
          <p className="text-gray-600">Please connect your MetaMask wallet to access the Retailer Dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
            <span className="bg-gradient-to-r from-green-400 via-green-600 to-green-800 bg-clip-text text-transparent">Farm</span>
            <span className="text-black">Chain</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-900 bg-gradient-to-r from-blue-100 via-white to-purple-100 rounded-xl px-6 py-4 shadow-md inline-block">
            Revolutionizing supply chain transparency with Avalanche blockchain technology. From farm to fork, every step is verified, secured, and traceable.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Search */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Search Product</h2>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Product ID"
                  className="flex-1 px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={searchProduct}
                  disabled={searchLoading}
                  className="bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-50 text-blue-700 font-semibold px-6 py-3 rounded-lg border border-blue-300 transition-all duration-200 hover:scale-105 whitespace-nowrap"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Product History */}
            {productHistory && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                
                <div className="bg-green-50/80 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-900">{productHistory.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Quantity:</span>
                      <p className="text-gray-900">{productHistory.quantity} kg</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Harvest Date:</span>
                      <p className="text-gray-900">{productHistory.harvestDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Updates:</span>
                      <p className="text-gray-900">{productHistory.statuses.length}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {productHistory.statuses.map((status, index) => (
                    <div key={index} className="bg-white/80 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 capitalize">{status}</span>
                        <span className="text-xs text-gray-500">
                          {productHistory.timestamps[index]?.toLocaleDateString()} {productHistory.timestamps[index]?.toLocaleTimeString()}
                        </span>
                      </div>
                      {productHistory.iotData[index] && (
                        <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono overflow-x-auto">
                          {productHistory.iotData[index]}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Update Form */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Update className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Add Status Update</h2>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                    Product ID
                  </label>
                  <input
                    type="text"
                    id="productId"
                    name="productId"
                    value={updateForm.productId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter Product ID"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status Update
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={updateForm.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="iotData" className="block text-sm font-medium text-gray-700 mb-1">
                    IoT Data (JSON format)
                  </label>
                  <textarea
                    id="iotData"
                    name="iotData"
                    value={updateForm.iotData}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono text-sm"
                    placeholder='{"temperature": "4°C", "humidity": "60%", "location": "Warehouse A"}'
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-green-700 font-semibold py-3 px-4 rounded-lg border border-green-300 transition-all duration-200 hover:scale-105"
                >
                  {loading ? 'Adding Update...' : 'Add Update'}
                </button>
              </form>


            </div>

            {/* IoT Templates */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">IoT Data Templates</h3>
              <div className="space-y-2">
                {iotTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => useTemplate(template.data)}
                    className="w-full text-left p-3 bg-white/80 hover:bg-blue-50/80 border border-gray-200 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {template.name.includes('Temperature') && <Thermometer className="h-4 w-4 text-blue-600" />}
                        {template.name.includes('Transport') && <Truck className="h-4 w-4 text-green-600" />}
                        {template.name.includes('Quality') && <Package className="h-4 w-4 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-600">Click to use this template</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailerDashboard;