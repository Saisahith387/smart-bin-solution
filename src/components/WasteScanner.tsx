
import React, { useState } from 'react';
import { Camera, Search, X, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WasteScannerProps {
  onScan?: (result: string) => void;
}

const WasteScanner: React.FC<WasteScannerProps> = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scanResult, setScanResult] = useState<{
    item: string;
    recyclable: boolean;
    instructions: string;
  } | null>(null);

  // Simulate scanning functionality
  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scan delay
    setTimeout(() => {
      setIsScanning(false);
      
      // Demo result
      setScanResult({
        item: 'Plastic Bottle (Type 1 PET)',
        recyclable: true,
        instructions: 'Rinse clean and remove cap before recycling. Check local guidelines as some facilities may require caps to be removed.'
      });
      
      if (onScan) {
        onScan('Plastic Bottle (Type 1 PET)');
      }
    }, 2000);
  };

  // Simulate search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Demo results based on search query
    let result;
    
    if (searchQuery.toLowerCase().includes('bottle') || searchQuery.toLowerCase().includes('plastic')) {
      result = {
        item: 'Plastic Bottle',
        recyclable: true,
        instructions: 'Rinse clean and remove cap before recycling. Check local guidelines as some facilities may require caps to be removed.'
      };
    } else if (searchQuery.toLowerCase().includes('battery')) {
      result = {
        item: 'Battery',
        recyclable: false,
        instructions: 'Batteries should not be placed in regular recycling bins. Take to a specialized battery recycling point or hazardous waste facility.'
      };
    } else {
      result = {
        item: searchQuery,
        recyclable: false,
        instructions: 'Item not recognized. Please check with your local waste management authority for proper disposal instructions.'
      };
    }
    
    setScanResult(result);
    setSearchQuery('');
  };

  return (
    <div className="w-full h-full">
      <div className="glass-card overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg font-medium mb-4">Waste Sorting Assistant</h3>
          
          <div className="flex flex-col space-y-4">
            {/* Search form */}
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for an item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-eco-500/30"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-eco-500 hover:bg-eco-600 text-white rounded-lg px-4 py-2 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
            
            {/* Camera scan button */}
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="flex items-center justify-center space-x-2 py-3 px-4 border border-border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              {isScanning ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-eco-600"></div>
                  <span>Scanning...</span>
                </div>
              ) : (
                <>
                  <Camera className="w-5 h-5 text-muted-foreground" />
                  <span>Scan Item</span>
                </>
              )}
            </button>
          </div>
          
          {/* Simulated camera view for scanning */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 relative overflow-hidden rounded-lg bg-black aspect-video"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-opacity-70">Camera preview would appear here</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-white border-opacity-50 rounded-lg flex items-center justify-center">
                    <motion.div
                      className="w-full h-0.5 bg-eco-500"
                      initial={{ y: -50, opacity: 0.5 }}
                      animate={{ y: 50, opacity: 1 }}
                      transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1.5
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Results display */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 p-4 rounded-lg border"
                style={{
                  borderColor: scanResult.recyclable ? '#2ecc71' : '#f39c12',
                  backgroundColor: scanResult.recyclable ? 'rgba(46, 204, 113, 0.05)' : 'rgba(243, 156, 18, 0.05)'
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${scanResult.recyclable ? 'bg-empty/20' : 'bg-half/20'}`}>
                    {scanResult.recyclable ? (
                      <Check className="w-5 h-5 text-empty" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-half" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{scanResult.item}</h4>
                    <p className="text-sm mt-1 text-muted-foreground">
                      {scanResult.recyclable 
                        ? 'This item is recyclable.' 
                        : 'This item is not recyclable in standard bins.'}
                    </p>
                    <p className="text-sm mt-2">{scanResult.instructions}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WasteScanner;
