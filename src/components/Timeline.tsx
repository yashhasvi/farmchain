import React from 'react';
import { CheckCircle, Clock, Truck, Package } from 'lucide-react';

interface TimelineItem {
  status: string;
  iotData: string;
  timestamp: Date;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'created':
        return <Package className="h-5 w-5" />;
      case 'shipped':
      case 'in transit':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'created':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
      case 'in transit':
        return 'text-amber-600 bg-amber-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {items.map((item, itemIdx) => (
          <li key={itemIdx}>
            <div className="relative pb-8">
              {itemIdx !== items.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {item.status}
                    </p>
                    {item.iotData && (
                      <div className="mt-2 p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">IoT Data:</p>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                          {item.iotData}
                        </pre>
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={item.timestamp.toISOString()}>
                      {item.timestamp.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;