import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContract } from '../hooks/useContract';
import { useWallet } from '../contexts/WalletContext';
import Timeline from '../components/Timeline';
import { ShieldCheck, Package, Calendar, Hash, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ProductHistory {
  id: string;
  name: string;
  quantity: string;
  harvestDate: Date;
  statuses: string[];
  iotData: string[];
  timestamps: Date[];
}

const ConsumerVerification: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { getProductHistory } = useContract();
  const { provider } = useWallet();
  
  const [productHistory, setProductHistory] = useState<ProductHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProductHistory = async () => {
      if (!productId) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      // For demo purposes when productId is 'demo'
      if (productId === 'demo') {
        setProductHistory({
          id: 'demo',
          name: 'Organic Tomatoes',
          quantity: '100',
          harvestDate: new Date('2024-01-15'),
          statuses: ['Created', 'Shipped', 'In Transit', 'Quality Checked', 'Delivered'],
          iotData: [
            JSON.stringify({ temperature: '20°C', humidity: '65%', location: 'Farm A' }, null, 2),
            JSON.stringify({ temperature: '4°C', humidity: '60%', location: 'Cold Storage' }, null, 2),
            JSON.stringify({ temperature: '2°C', humidity: '58%', vibration: 'Low', location: 'Transport Vehicle' }, null, 2),
            JSON.stringify({ quality_score: '9.5/10', freshness: 'Excellent', contamination: 'None', inspector: 'Jane Smith' }, null, 2),
            JSON.stringify({ temperature: '3°C', humidity: '62%', location: 'Retail Store' }, null, 2),
          ],
          timestamps: [
            new Date('2024-01-15T08:00:00'),
            new Date('2024-01-16T10:30:00'),
            new Date('2024-01-17T14:15:00'),
            new Date('2024-01-18T09:45:00'),
            new Date('2024-01-18T16:20:00'),
          ]
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // TODO COMMENT: This requires a connected wallet and correct network
        // You might want to allow read-only access for consumers
        const history = await getProductHistory(productId);
        setProductHistory(history);
      } catch (error) {
        console.error('Error loading product history:', error);
        setError('Failed to load product history. Please ensure the product ID is correct and try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProductHistory();
  }, [productId, getProductHistory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading product verification...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-8 shadow-lg">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 font-semibold py-2 px-4 rounded-lg border border-purple-300 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!productHistory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-8 shadow-lg">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600">The requested product could not be found in the blockchain.</p>
          </div>
        </div>
      </div>
    );
  }

  const timelineItems = productHistory.statuses.map((status, index) => ({
    status,
    iotData: productHistory.iotData[index] || '',
    timestamp: productHistory.timestamps[index] || new Date(),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 bg-green-100/80 backdrop-blur-sm px-6 py-3 rounded-full border border-green-300 mb-4">
            <ShieldCheck className="h-6 w-6 text-green-600" />
            <span className="text-green-800 font-semibold">Verified on Avalanche Blockchain</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Verification</h1>
          <p className="text-gray-600">Complete supply chain journey verified through blockchain technology</p>
        </div>

        {/* Product Info Card */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-8 mb-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{productHistory.name}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Hash className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Product ID</p>
                    <p className="font-semibold text-gray-900">{productHistory.id}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity</p>
                    <p className="font-semibold text-gray-900">{productHistory.quantity} kg</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Harvest Date</p>
                    <p className="font-semibold text-gray-900">
                      {productHistory.harvestDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Authenticity Verified</h3>
                  <p className="text-gray-600 text-sm">
                    This product's complete journey has been recorded on the Avalanche blockchain,
                    ensuring transparency and authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supply Chain Timeline */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Supply Chain Journey</h2>
          </div>

          <Timeline items={timelineItems} />
        </div>

        {/* Blockchain Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-200">
            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
            </svg>
            <span className="text-blue-800 text-sm">
              Powered by Avalanche Blockchain Technology
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerVerification;