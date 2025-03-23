
import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, MapPin, Clock } from 'lucide-react';
import StatusIndicator from './StatusIndicator';

export type BinStatus = 'empty' | 'half' | 'full';
export type WasteType = 'general' | 'recycling' | 'compost' | 'hazardous';

interface BinStatusCardProps {
  id: string;
  location: string;
  status: BinStatus;
  wasteType: WasteType;
  lastUpdated: string;
  onClick?: () => void;
}

const BinStatusCard: React.FC<BinStatusCardProps> = ({
  id,
  location,
  status,
  wasteType,
  lastUpdated,
  onClick
}) => {
  const getWasteTypeDetails = (type: WasteType) => {
    switch (type) {
      case 'general':
        return { label: 'General Waste', bgColor: 'bg-slate-100', textColor: 'text-slate-700' };
      case 'recycling':
        return { label: 'Recycling', bgColor: 'bg-blue-50', textColor: 'text-blue-700' };
      case 'compost':
        return { label: 'Compost', bgColor: 'bg-eco-50', textColor: 'text-eco-700' };
      case 'hazardous':
        return { label: 'Hazardous', bgColor: 'bg-amber-50', textColor: 'text-amber-700' };
      default:
        return { label: 'Unknown', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
    }
  };

  const wasteTypeDetails = getWasteTypeDetails(wasteType);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden"
      onClick={onClick}
    >
      <div className="p-4 cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${wasteTypeDetails.bgColor} ${wasteTypeDetails.textColor}`}>
              {wasteTypeDetails.label}
            </span>
          </div>
          <StatusIndicator status={status} showLabel={true} pulse={status === 'full'} />
        </div>

        <h3 className="font-medium text-lg mb-3">Bin #{id}</h3>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-eco-500" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-eco-500" />
            <span>Updated {lastUpdated}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BinStatusCard;
