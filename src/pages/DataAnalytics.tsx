
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, LineChart, ArrowUpRight, RefreshCw, Calendar } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import AnalyticsChart from '@/components/AnalyticsChart';
import { getCollectionStats } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';

const DataAnalytics = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = () => {
    setLoading(true);
    try {
      const data = getCollectionStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Generate some mock time-series data for demonstration
  const generateTimeSeriesData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      data.push({
        name: `${day}, ${dateStr}`,
        general: Math.floor(Math.random() * 30) + 10,
        recycling: Math.floor(Math.random() * 25) + 5,
        compost: Math.floor(Math.random() * 15) + 5,
        hazardous: Math.floor(Math.random() * 5) + 1,
      });
    }
    
    return data;
  };
  
  const timeSeriesData = generateTimeSeriesData();
  
  // Formatting the pie chart data
  const getWasteTypeData = () => {
    if (!stats) return [];
    
    return stats.wasteTypeData.map((item: any) => ({
      name: item.name,
      value: item.value
    }));
  };
  
  // Formatting the area data for bar chart
  const getAreaData = () => {
    if (!stats) return [];
    
    return stats.areaData.map((item: any) => ({
      name: item.name,
      collected: item.collected,
      missed: item.missed,
      scheduled: item.scheduled
    }));
  };
  
  // Issues stats for the pie chart
  const getIssuesData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Resolved', value: stats.issues.resolved },
      { name: 'Pending', value: stats.issues.pending }
    ];
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold tracking-tight mb-2"
            >
              Data Analytics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Track waste collection trends and performance metrics
            </motion.p>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                <RefreshCw className="h-8 w-8 mx-auto animate-spin text-eco-500" />
                <p className="mt-4 text-muted-foreground">Loading analytics data...</p>
              </div>
            ) : (
              <>
                <SummaryCard 
                  title="Total Collections" 
                  value={stats?.collections.total || 0}
                  icon={<Calendar className="h-5 w-5 text-eco-500" />}
                />
                
                <SummaryCard 
                  title="Successful Pickups" 
                  value={stats?.collections.collected || 0}
                  percentage={(stats?.collections.collected / stats?.collections.total * 100) || 0}
                  icon={<BarChart3 className="h-5 w-5 text-green-500" />}
                />
                
                <SummaryCard 
                  title="Missed Collections" 
                  value={stats?.collections.missed || 0}
                  percentage={(stats?.collections.missed / stats?.collections.total * 100) || 0}
                  icon={<BarChart3 className="h-5 w-5 text-red-500" />}
                />
                
                <SummaryCard 
                  title="Issues Reported" 
                  value={stats?.issues.total || 0}
                  secondaryValue={`${stats?.issues.resolved || 0} resolved`}
                  icon={<BarChart3 className="h-5 w-5 text-amber-500" />}
                />
              </>
            )}
          </div>
          
          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">Collection Trends</h2>
              <Button variant="outline" onClick={loadStats}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
            
            <div className="h-80">
              <AnalyticsChart
                type="area"
                data={timeSeriesData}
                dataKeys={['general', 'recycling', 'compost', 'hazardous']}
                labels={['General Waste', 'Recycling', 'Compost', 'Hazardous']}
                colors={['#94a3b8', '#3b82f6', '#10b981', '#ef4444']}
                height={280}
              />
            </div>
          </motion.div>
          
          {/* Additional Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-medium mb-6">Waste Type Distribution</h2>
              
              <div className="h-64">
                <AnalyticsChart
                  type="pie"
                  data={getWasteTypeData()}
                  dataKeys={['value']}
                  colors={['#94a3b8', '#3b82f6', '#10b981', '#ef4444']}
                  height={240}
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-medium mb-6">Issue Resolution</h2>
              
              <div className="h-64">
                <AnalyticsChart
                  type="pie"
                  data={getIssuesData()}
                  dataKeys={['value']}
                  colors={['#10b981', '#ef4444']}
                  height={240}
                />
              </div>
            </motion.div>
          </div>
          
          {/* Area Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-medium mb-6">Collection Performance by Area</h2>
            
            <div className="h-80">
              <AnalyticsChart
                type="bar"
                data={getAreaData()}
                dataKeys={['collected', 'missed', 'scheduled']}
                labels={['Collected', 'Missed', 'Scheduled']}
                colors={['#10b981', '#ef4444', '#f59e0b']}
                height={280}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

interface SummaryCardProps {
  title: string;
  value: number | string;
  percentage?: number;
  secondaryValue?: string;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  percentage, 
  secondaryValue,
  icon 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      
      <div className="space-y-1">
        <div className="text-3xl font-bold">{value}</div>
        
        {percentage !== undefined && (
          <div className="text-sm text-muted-foreground">
            {percentage.toFixed(1)}% of total
          </div>
        )}
        
        {secondaryValue && (
          <div className="text-sm text-muted-foreground">
            {secondaryValue}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DataAnalytics;
