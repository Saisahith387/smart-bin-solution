
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, ArrowUpRight, Layers } from 'lucide-react';

import PageTransition from '@/components/PageTransition';
import MapView from '@/components/MapView';
import StatusIndicator from '@/components/StatusIndicator';
import { BinStatus, WasteType } from '@/components/BinStatusCard';

// Mock data
const MOCK_BIN_LOCATIONS = [
  { id: '1001', lat: 40.7128, lng: -74.0060, status: 'full' as BinStatus, wasteType: 'general' as WasteType, address: 'Main Street & 5th Ave' },
  { id: '1002', lat: 40.7138, lng: -74.0050, status: 'half' as BinStatus, wasteType: 'recycling' as WasteType, address: 'Central Park West' },
  { id: '1003', lat: 40.7118, lng: -74.0070, status: 'empty' as BinStatus, wasteType: 'compost' as WasteType, address: 'Broadway & 42nd St' },
  { id: '1004', lat: 40.7108, lng: -74.0065, status: 'half' as BinStatus, wasteType: 'general' as WasteType, address: 'Park Ave & 23rd St' },
  { id: '1005', lat: 40.7132, lng: -74.0045, status: 'full' as BinStatus, wasteType: 'hazardous' as WasteType, address: 'Madison Square Park' },
  { id: '1006', lat: 40.7145, lng: -74.0080, status: 'empty' as BinStatus, wasteType: 'recycling' as WasteType, address: 'Union Square East' },
  { id: '1007', lat: 40.7115, lng: -74.0055, status: 'full' as BinStatus, wasteType: 'general' as WasteType, address: 'Times Square' },
  { id: '1008', lat: 40.7150, lng: -74.0065, status: 'half' as BinStatus, wasteType: 'compost' as WasteType, address: 'Hudson Yards' },
];

const Map = () => {
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const [visibleFilters, setVisibleFilters] = useState(false);
  const [filters, setFilters] = useState({
    full: true,
    half: true,
    empty: true,
    general: true,
    recycling: true,
    compost: true,
    hazardous: true
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Apply filters
  const filteredBins = MOCK_BIN_LOCATIONS.filter(bin => {
    const matchesStatus = 
      (bin.status === 'full' && filters.full) ||
      (bin.status === 'half' && filters.half) ||
      (bin.status === 'empty' && filters.empty);
      
    const matchesType = 
      (bin.wasteType === 'general' && filters.general) ||
      (bin.wasteType === 'recycling' && filters.recycling) ||
      (bin.wasteType === 'compost' && filters.compost) ||
      (bin.wasteType === 'hazardous' && filters.hazardous);
      
    const matchesSearch = !searchQuery.trim() || 
      bin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bin.address.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleBinSelect = (binId: string) => {
    setSelectedBin(binId);
  };

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Map Header */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold tracking-tight mb-2"
            >
              Smart Bin Map
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground"
            >
              View and locate all smart bins across the city
            </motion.p>
          </div>

          {/* Map Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card p-4 mb-6"
          >
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 py-2 pr-4 rounded-md border border-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-eco-500/30 w-full md:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex space-x-3">
                <button 
                  className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 relative"
                  onClick={() => setVisibleFilters(!visibleFilters)}
                >
                  <Filter className="h-4 w-4" />
                </button>
                
                <button className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30">
                  <Layers className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <AnimatedFilters visible={visibleFilters} filters={filters} toggleFilter={toggleFilter} />
          </motion.div>
          
          {/* Map + Sidebar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map Container */}
            <motion.div 
              className="lg:col-span-3 h-[calc(100vh-250px)] min-h-[500px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <MapView bins={filteredBins} onBinSelect={handleBinSelect} />
            </motion.div>
            
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="glass-card p-4 h-[calc(100vh-250px)] min-h-[500px] overflow-y-auto"
            >
              <h3 className="text-lg font-medium mb-4">Nearby Bins</h3>

              {filteredBins.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No bins match your current filters.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBins.map((bin) => (
                    <div 
                      key={bin.id}
                      onClick={() => handleBinSelect(bin.id)}
                      className={`p-3 rounded-lg border border-border ${
                        selectedBin === bin.id ? 'bg-accent' : 'hover:bg-muted/30'
                      } cursor-pointer transition-colors`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">Bin #{bin.id}</span>
                        <StatusIndicator status={bin.status} showLabel />
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{bin.address}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs px-2 py-1 bg-muted rounded-full">
                          {getWasteTypeLabel(bin.wasteType)}
                        </span>
                        
                        <button className="text-xs text-eco-600 flex items-center">
                          <span>Details</span>
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

// Helper component for animated filters
const AnimatedFilters = ({ 
  visible, 
  filters, 
  toggleFilter 
}: { 
  visible: boolean, 
  filters: Record<string, boolean>,
  toggleFilter: (key: keyof typeof filters) => void 
}) => {
  return (
    <motion.div
      initial={false}
      animate={{ 
        height: visible ? 'auto' : 0,
        opacity: visible ? 1 : 0,
        marginTop: visible ? 16 : 0
      }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <div className="space-y-2">
            <FilterCheckbox 
              label="Full" 
              checked={filters.full} 
              onChange={() => toggleFilter('full')} 
              status="full"
            />
            <FilterCheckbox 
              label="Half Full" 
              checked={filters.half} 
              onChange={() => toggleFilter('half')} 
              status="half"
            />
            <FilterCheckbox 
              label="Empty" 
              checked={filters.empty} 
              onChange={() => toggleFilter('empty')} 
              status="empty"
            />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Waste Type</h4>
          <div className="space-y-2">
            <FilterCheckbox 
              label="General" 
              checked={filters.general} 
              onChange={() => toggleFilter('general')} 
            />
            <FilterCheckbox 
              label="Recycling" 
              checked={filters.recycling} 
              onChange={() => toggleFilter('recycling')} 
            />
            <FilterCheckbox 
              label="Compost" 
              checked={filters.compost} 
              onChange={() => toggleFilter('compost')} 
            />
            <FilterCheckbox 
              label="Hazardous" 
              checked={filters.hazardous} 
              onChange={() => toggleFilter('hazardous')} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FilterCheckbox = ({ 
  label, 
  checked, 
  onChange,
  status
}: { 
  label: string, 
  checked: boolean, 
  onChange: () => void,
  status?: BinStatus
}) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-border text-eco-500 focus:ring-eco-500/30"
      />
      <div className="flex items-center space-x-2">
        {status && <StatusIndicator status={status} size="sm" />}
        <span className="text-sm">{label}</span>
      </div>
    </label>
  );
};

// Helper function to get waste type label
const getWasteTypeLabel = (type: WasteType) => {
  switch (type) {
    case 'general': return 'General';
    case 'recycling': return 'Recycling';
    case 'compost': return 'Compost';
    case 'hazardous': return 'Hazardous';
    default: return type;
  }
};

export default Map;
