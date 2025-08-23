import React from 'react';
import QRCode from 'react-qr-code';
import { X, Download, Share2 } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, productId, productName }) => {
  if (!isOpen) return null;

  const verificationUrl = `${window.location.origin}/verify/${productId}`;

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `product-${productId}-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Product Verification - ${productName}`,
          text: `Verify the authenticity of ${productName} on the blockchain`,
          url: verificationUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(verificationUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Product QR Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="text-center">
          <div className="bg-white p-6 rounded-xl mb-6 inline-block shadow-lg">
            <QRCode
              id="qr-code"
              value={verificationUrl}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>

          <div className="bg-green-50/50 backdrop-blur-sm rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Product:</span> {productName}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">ID:</span> {productId}
            </p>
            <p className="text-xs text-gray-600 break-all">
              {verificationUrl}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={downloadQRCode}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 py-2 px-4 rounded-lg border border-blue-300 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            <button
              onClick={shareQRCode}
              className="flex-1 flex items-center justify-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-700 py-2 px-4 rounded-lg border border-green-300 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;