import React from 'react';
import { PackageCheck, Tractor, Warehouse, ShoppingCart } from 'lucide-react';

// A simple map to get an icon based on the status text
const statusIconMap: { [key: string]: React.ReactNode } = {
  CREATED: <Tractor className="h-5 w-5 text-white" />,
  'IN-STORAGE': <Warehouse className="h-5 w-5 text-white" />,
  'IN-TRANSIT': <ShoppingCart className="h-5 w-5 text-white" />,
};

const getIcon = (status: string) => {
  const normalizedStatus = status.toUpperCase();
  for (const key in statusIconMap) {
    if (normalizedStatus.includes(key)) {
      return statusIconMap[key];
    }
  }
  return <PackageCheck className="h-5 w-5 text-white" />; // Default icon
};

const getIconBgColor = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    if (normalizedStatus.includes('CREATED')) return 'bg-green-500';
    if (normalizedStatus.includes('STORAGE')) return 'bg-blue-500';
    if (normalizedStatus.includes('TRANSIT')) return 'bg-yellow-500';
    return 'bg-gray-500';
}

interface TimelineProps {
  history: Array<{
    timestamp: string;
    status: string;
    location: string;
    sensorData: string;
  }>;
}

export const Timeline: React.FC<TimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return <p>No history found for this product.</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((event, eventIdx) => (
          <li key={event.timestamp}>
            <div className="relative pb-8">
              {eventIdx !== history.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div>
                  <div className={`relative px-1 ${getIconBgColor(event.status)} rounded-full h-8 w-8 flex items-center justify-center`}>
                    {getIcon(event.status)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{event.status}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {event.timestamp}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p><strong>Location:</strong> {event.location}</p>
                    <p><strong>Sensor Data:</strong> {event.sensorData}</p>
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