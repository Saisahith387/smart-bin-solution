
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, MapPin, ArrowUpRight } from 'lucide-react';

import StatusIndicator from './StatusIndicator';
import { BinStatus, WasteType } from './BinStatusCard';

interface BinLocation {
  id: string;
  lat: number;
  lng: number;
  status: BinStatus;
  wasteType: WasteType;
  address: string;
}

interface MapViewProps {
  bins: BinLocation[];
  onBinSelect?: (binId: string) => void;
}

// Mock implementation for demo purposes
const MapView: React.FC<MapViewProps> = ({ bins, onBinSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedBin, setSelectedBin] = useState<BinLocation | null>(null);

  // This would be replaced with actual map implementation
  useEffect(() => {
    if (mapRef.current) {
      // In a real implementation, we would initialize the map here
      console.log('Map would be initialized with bins:', bins);
    }
  }, [bins]);

  const handleBinClick = (bin: BinLocation) => {
    setSelectedBin(bin);
    if (onBinSelect) {
      onBinSelect(bin.id);
    }
  };

  const getWasteTypeLabel = (type: WasteType) => {
    switch (type) {
      case 'general': return 'General Waste';
      case 'recycling': return 'Recycling';
      case 'compost': return 'Compost';
      case 'hazardous': return 'Hazardous Waste';
      default: return 'Unknown';
    }
  };

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border">
      {/* Placeholder map - would be replaced with actual map component */}
      <div 
        ref={mapRef} 
        className="w-full h-full min-h-[400px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"
      >
        <div className="text-center p-6">
          <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            Interactive map would display here with {bins.length} bin locations
          </p>
        </div>
      </div>

      {/* Demo bin markers for visual representation */}
      <div className="absolute inset-0 pointer-events-none">
        {bins.map((bin, index) => {
          // Calculate pseudo-positions for demo
          const xPos = (20 + (index % 5) * 18) + '%';
          const yPos = (20 + Math.floor(index / 5) * 15) + '%';
          
          return (
            <motion.div
              key={bin.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{ left: xPos, top: yPos }}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleBinClick(bin)}
            >
              <div className="relative">
                <div className={`p-2 rounded-full 
                  ${bin.status === 'empty' ? 'bg-empty/20' : 
                    bin.status === 'half' ? 'bg-half/20' : 'bg-full/20'}`}
                >
                  <MapPin 
                    className={`h-5 w-5 
                      ${bin.status === 'empty' ? 'text-empty' : 
                        bin.status === 'half' ? 'text-half' : 'text-full'}`} 
                  />
                </div>
                {bin.status === 'full' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-full/20"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.2, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bin info card */}
      {selectedBin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 p-4 glass-card max-w-xs"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">Bin #{selectedBin.id}</h3>
            <StatusIndicator status={selectedBin.status} showLabel={true} />
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p>{selectedBin.address}</p>
            <p>Type: {getWasteTypeLabel(selectedBin.wasteType)}</p>
          </div>
          
          <button 
            className="flex items-center text-sm mt-3 text-eco-600 hover:text-eco-700 font-medium"
            onClick={() => onBinSelect && onBinSelect(selectedBin.id)}
          >
            <span>View Details</span>
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MapView;
