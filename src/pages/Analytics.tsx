
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Download,
  BarChart3,
  PieChart,
  LineChart,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';

import PageTransition from '@/components/PageTransition';
import AnalyticsChart from '@/components/AnalyticsChart';

// Mock data
const WEEKLY_DATA = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 30 },
  { name: 'Wed', value: 45 },
  { name: 'Thu', value: 50 },
  { name: 'Fri', value: 75 },
  { name: 'Sat', value: 65 },
  { name: 'Sun', value: 45 }
];

const MONTHLY_DATA = [
  { name: 'Jan', value: 240 },
  { name: 'Feb', value: 210 },
  { name: 'Mar', value: 290 },
  { name: 'Apr', value: 350 },
  { name: 'May', value: 410 },
  { name: 'Jun', value: 520 },
  { name: 'Jul', value: 620 },
  { name: 'Aug', value: 550 },
  { name: 'Sep', value: 420 },
  { name: 'Oct', value: 380 },
  { name: 'Nov', value: 430 },
  { name: 'Dec', value: 490 }
];

const WASTE_COMPOSITION_DATA = [
  { name: 'General Waste', value: 45 },
  { name: 'Recyclables', value: 30 },
  { name: 'Compost', value: 15 },
  { name: 'Hazardous', value: 10 }
];

const COLLECTION_EFFICIENCY_DATA = [
  { name: 'Mon', actual: 95, target: 100 },
  { name: 'Tue', actual: 88, target: 100 },
  { name: 'Wed', actual: 92, target: 100 },
  { name: 'Thu', actual: 96, target: 100 },
  { name: 'Fri', actual: 93, target: 100 },
  { name: 'Sat', actual: 85, target: 100 },
  { name: 'Sun', actual: 75, target: 100 }
];

const HOTSPOT_DATA = [
  { name: 'Downtown', general: 65, recycling: 35 },
  { name: 'Midtown', general: 50, recycling: 50 },
  { name: 'Uptown', general: 45, recycling: 55 },
  { name: 'Westside', general: 55, recycling: 45 },
  { name: 'Eastside', general: 70, recycling: 30 }
];

// Predictive forecast data
const FORECAST_DATA = [
  { name: 'Week 1', predicted: 45, actual: 42 },
  { name: 'Week 2', predicted: 50, actual: 48 },
  { name: 'Week 3', predicted: 55, actual: 57 },
  { name: 'Week 4', predicted: 65, actual: 62 },
  { name: 'Week 5', predicted: 70, actual: null } // Future prediction
];

const INSIGHTS = [
  {
    id: 1,
    title: 'Collection Efficiency',
    description: 'Sunday collection efficiency is 25% below target, consider adding more resources.',
    icon: AlertTriangle,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Waste Hotspots',
    description: 'Downtown area has 30% higher waste generation than other areas.',
    icon: BarChart3,
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Forecast Accuracy',
    description: 'Waste prediction model is performing with 94% accuracy for the month.',
    icon: LineChart,
    priority: 'low'
  }
];

const Analytics = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  
  const handleDownloadReport = () => {
    console.log('Downloading report...');
    // Implementation would go here
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Analytics Header */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold tracking-tight mb-2"
            >
              Waste Analytics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Insights and trends to optimize waste management
            </motion.p>
          </div>
          
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap justify-between items-center gap-4 mb-8"
          >
            <div className="flex items-center space-x-4">
              <div className="glass-effect px-4 py-2 rounded-lg flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Last 30 Days</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex rounded-lg overflow-hidden border border-border">
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`px-4 py-2 text-sm font-medium ${
                    timeframe === 'weekly' 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-background text-muted-foreground hover:bg-muted/30'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`px-4 py-2 text-sm font-medium ${
                    timeframe === 'monthly' 
                      ? 'bg-accent text-accent-foreground' 
                      : 'bg-background text-muted-foreground hover:bg-muted/30'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            <button
              onClick={handleDownloadReport}
              className="flex items-center space-x-2 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </button>
          </motion.div>
          
          {/* Main metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard 
              title="Total Waste Collected"
              value={timeframe === 'weekly' ? "350" : "4,580"}
              unit="kg"
              change="+12.5%"
              changeType="positive"
              delay={0.3}
            />
            
            <MetricCard 
              title="Recycling Rate"
              value="42"
              unit="%"
              change="+3.2%"
              changeType="positive"
              delay={0.4}
            />
            
            <MetricCard 
              title="Collection Efficiency"
              value="89"
              unit="%"
              change="-2.1%"
              changeType="negative"
              delay={0.5}
            />
          </div>
          
          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-medium mb-6">Waste Collection Trend</h3>
              <AnalyticsChart 
                type="area" 
                data={timeframe === 'weekly' ? WEEKLY_DATA : MONTHLY_DATA} 
                height={250}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-medium mb-6">Waste Composition</h3>
              <AnalyticsChart 
                type="pie" 
                data={WASTE_COMPOSITION_DATA} 
                colors={['#94a3b8', '#3b82f6', '#10b981', '#f59e0b']}
                height={250}
              />
            </motion.div>
          </div>
          
          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-medium mb-6">Collection Efficiency</h3>
              <AnalyticsChart 
                type="bar" 
                data={COLLECTION_EFFICIENCY_DATA} 
                dataKeys={['actual', 'target']}
                labels={['Actual', 'Target']}
                colors={['#549a7f', '#cbd5e1']}
                height={250}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-medium mb-6">Waste Hotspots</h3>
              <AnalyticsChart 
                type="bar" 
                data={HOTSPOT_DATA} 
                dataKeys={['general', 'recycling']}
                labels={['General Waste', 'Recycling']}
                colors={['#94a3b8', '#3b82f6']}
                height={250}
              />
            </motion.div>
          </div>
          
          {/* Predictive analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 }}
            className="glass-card p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Waste Generation Forecast</h3>
              <span className="text-xs px-3 py-1 bg-accent rounded-full text-accent-foreground">AI Powered</span>
            </div>
            
            <AnalyticsChart 
              type="area" 
              data={FORECAST_DATA} 
              dataKeys={['predicted', 'actual']}
              labels={['Predicted', 'Actual']}
              colors={['#94a3b8', '#3b82f6']}
              height={250}
            />
          </motion.div>
          
          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-medium mb-6">Key Insights</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INSIGHTS.map((insight, index) => (
                <div 
                  key={insight.id}
                  className={`p-4 rounded-lg border ${
                    insight.priority === 'high' 
                      ? 'border-full/30 bg-full/5' 
                      : insight.priority === 'medium'
                        ? 'border-half/30 bg-half/5'
                        : 'border-empty/30 bg-empty/5'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      insight.priority === 'high' 
                        ? 'bg-full/20' 
                        : insight.priority === 'medium'
                          ? 'bg-half/20'
                          : 'bg-empty/20'
                    }`}>
                      <insight.icon className={`h-5 w-5 ${
                        insight.priority === 'high' 
                          ? 'text-full' 
                          : insight.priority === 'medium'
                            ? 'text-half'
                            : 'text-empty'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

// Helper component for metric cards
const MetricCard = ({ 
  title, 
  value, 
  unit, 
  change, 
  changeType,
  delay
}: { 
  title: string; 
  value: string; 
  unit: string;
  change: string;
  changeType: 'positive' | 'negative';
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-6"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-4xl font-bold mr-2">{value}</span>
        <span className="text-muted-foreground">{unit}</span>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm ${
          changeType === 'positive' ? 'text-empty' : 'text-full'
        }`}>
          {change}
        </span>
        <span className="text-xs text-muted-foreground ml-2">vs last period</span>
      </div>
    </motion.div>
  );
};

export default Analytics;
