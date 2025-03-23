
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  ArrowUpRight, 
  Bell,
  AlertTriangle
} from 'lucide-react';

import PageTransition from '@/components/PageTransition';
import BinStatusCard, { BinStatus, WasteType } from '@/components/BinStatusCard';
import StatusIndicator from '@/components/StatusIndicator';
import AnalyticsChart from '@/components/AnalyticsChart';

// Mock data
const MOCK_BINS = [
  { id: '1001', location: 'Main Street & 5th Ave', status: 'full' as BinStatus, wasteType: 'general' as WasteType, lastUpdated: '5 min ago' },
  { id: '1002', location: 'Central Park West', status: 'half' as BinStatus, wasteType: 'recycling' as WasteType, lastUpdated: '10 min ago' },
  { id: '1003', location: 'Broadway & 42nd St', status: 'empty' as BinStatus, wasteType: 'compost' as WasteType, lastUpdated: '15 min ago' },
  { id: '1004', location: 'Park Ave & 23rd St', status: 'half' as BinStatus, wasteType: 'general' as WasteType, lastUpdated: '25 min ago' },
  { id: '1005', location: 'Madison Square Park', status: 'full' as BinStatus, wasteType: 'hazardous' as WasteType, lastUpdated: '30 min ago' },
  { id: '1006', location: 'Union Square East', status: 'empty' as BinStatus, wasteType: 'recycling' as WasteType, lastUpdated: '1 hour ago' },
];

const ACTIVITY_DATA = [
  { id: 1, time: '09:45 AM', message: 'Bin #1001 is now full and needs collection', status: 'full' as BinStatus, urgent: true },
  { id: 2, time: '09:32 AM', message: 'Bin #1005 reached critical capacity', status: 'full' as BinStatus, urgent: true },
  { id: 3, time: '08:15 AM', message: 'Bin #1002 is now half full', status: 'half' as BinStatus, urgent: false },
  { id: 4, time: '07:50 AM', message: 'Bin #1003 was emptied successfully', status: 'empty' as BinStatus, urgent: false },
];

const WEEKLY_TREND_DATA = [
  { name: 'Mon', general: 30, recycling: 20, compost: 10 },
  { name: 'Tue', general: 40, recycling: 30, compost: 15 },
  { name: 'Wed', general: 35, recycling: 25, compost: 12 },
  { name: 'Thu', general: 50, recycling: 35, compost: 20 },
  { name: 'Fri', general: 65, recycling: 45, compost: 25 },
  { name: 'Sat', general: 60, recycling: 40, compost: 22 },
  { name: 'Sun', general: 40, recycling: 30, compost: 15 },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBins, setFilteredBins] = useState(MOCK_BINS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const filterBins = (query: string) => {
    if (!query.trim()) {
      setFilteredBins(MOCK_BINS);
      return;
    }
    
    const filtered = MOCK_BINS.filter(bin => 
      bin.id.toLowerCase().includes(query.toLowerCase()) ||
      bin.location.toLowerCase().includes(query.toLowerCase()) ||
      bin.wasteType.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredBins(filtered);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterBins(searchQuery);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  const binsByStatus = {
    full: filteredBins.filter(bin => bin.status === 'full').length,
    half: filteredBins.filter(bin => bin.status === 'half').length,
    empty: filteredBins.filter(bin => bin.status === 'empty').length,
  };

  const totalBins = filteredBins.length;
  const percentageFull = Math.round((binsByStatus.full / totalBins) * 100);
  const percentageHalf = Math.round((binsByStatus.half / totalBins) * 100);
  const percentageEmpty = Math.round((binsByStatus.empty / totalBins) * 100);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Dashboard Header */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold tracking-tight mb-2"
            >
              Smart Bin Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Monitor and manage your smart bins in real-time
            </motion.p>
          </div>
          
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Critical Bins</h3>
                <StatusIndicator status="full" pulse={true} />
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-4xl font-bold">{binsByStatus.full}</span>
                <span className="text-muted-foreground text-sm mb-1">bins need attention</span>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">{percentageFull}% of total bins</p>
              <div className="mt-4 bg-muted/50 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentageFull}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-full rounded-full"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="glass-card p-6"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Half-Full Bins</h3>
                <StatusIndicator status="half" />
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-4xl font-bold">{binsByStatus.half}</span>
                <span className="text-muted-foreground text-sm mb-1">bins half capacity</span>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">{percentageHalf}% of total bins</p>
              <div className="mt-4 bg-muted/50 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentageHalf}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-half rounded-full"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="glass-card p-6"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Available Bins</h3>
                <StatusIndicator status="empty" />
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-4xl font-bold">{binsByStatus.empty}</span>
                <span className="text-muted-foreground text-sm mb-1">bins available</span>
              </div>
              <p className="text-sm mt-2 text-muted-foreground">{percentageEmpty}% of total bins</p>
              <div className="mt-4 bg-muted/50 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentageEmpty}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-empty rounded-full"
                />
              </div>
            </motion.div>
          </div>
          
          {/* Middle Section: Weekly Trends + Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Weekly Trends Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="glass-card p-6 lg:col-span-2"
            >
              <h3 className="text-lg font-medium mb-6">Weekly Waste Collection Trends</h3>
              <AnalyticsChart
                type="area"
                data={WEEKLY_TREND_DATA}
                dataKeys={['general', 'recycling', 'compost']}
                labels={['General Waste', 'Recycling', 'Compost']}
                colors={['#94a3b8', '#3b82f6', '#10b981']}
                height={250}
              />
            </motion.div>
            
            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="glass-card p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <div className="relative">
                  <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-full rounded-full border border-white"></span>
                </div>
              </div>
              
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                {ACTIVITY_DATA.map((activity) => (
                  <div 
                    key={activity.id}
                    className={`p-3 rounded-lg border ${
                      activity.urgent ? 'border-full/30 bg-full/5' : 'border-border bg-muted/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center">
                        {activity.urgent && (
                          <AlertTriangle className="h-4 w-4 text-full mr-2" />
                        )}
                        <StatusIndicator status={activity.status} size="sm" />
                        <span className="ml-2 text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm">{activity.message}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Bins List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
              <h3 className="text-lg font-medium">All Smart Bins</h3>
              
              <div className="flex items-center space-x-3">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search bins..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!e.target.value.trim()) {
                        setFilteredBins(MOCK_BINS);
                      }
                    }}
                    className="px-3 py-2 pl-9 rounded-md border border-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-eco-500/30 w-full md:w-auto"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </form>
                
                <button className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30">
                  <Filter className="h-4 w-4" />
                </button>
                
                <button 
                  className="p-2 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 relative"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBins.map((bin, index) => (
                <BinStatusCard
                  key={bin.id}
                  id={bin.id}
                  location={bin.location}
                  status={bin.status}
                  wasteType={bin.wasteType}
                  lastUpdated={bin.lastUpdated}
                />
              ))}
            </div>
            
            {filteredBins.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No bins found matching your search.</p>
              </div>
            )}
            
            {filteredBins.length > 0 && (
              <div className="mt-6 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredBins.length} of {MOCK_BINS.length} bins
                </p>
                
                <button className="flex items-center text-sm text-eco-600 hover:text-eco-700 font-medium">
                  <span>View All</span>
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
