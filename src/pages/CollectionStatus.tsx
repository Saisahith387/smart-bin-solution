
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, RefreshCw, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { getSchedules, updateScheduleStatus } from '@/services/dataService';
import { PickupSchedule, WasteType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const CollectionStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<PickupSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  
  useEffect(() => {
    loadSchedules();
  }, []);
  
  const loadSchedules = () => {
    setLoading(true);
    try {
      const data = getSchedules();
      setSchedules(data);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load schedules',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusUpdate = (scheduleId: string, status: 'collected' | 'missed') => {
    if (!user) return;
    
    try {
      updateScheduleStatus(scheduleId, status, user.id);
      loadSchedules();
      toast({
        title: 'Status Updated',
        description: `Collection marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };
  
  const filteredSchedules = schedules.filter(schedule => {
    if (!searchQuery) return true;
    
    return (
      schedule.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.date.includes(searchQuery)
    );
  });
  
  const currentDate = new Date();
  const upcomingSchedules = filteredSchedules
    .filter(schedule => new Date(`${schedule.date}T${schedule.time}`) >= currentDate && schedule.status === 'scheduled')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  
  const pastSchedules = filteredSchedules
    .filter(schedule => schedule.status !== 'scheduled' || new Date(`${schedule.date}T${schedule.time}`) < currentDate)
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
  
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
              Collection Status
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Track and update waste collection statuses
            </motion.p>
          </div>
          
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="relative flex-grow max-w-md">
                <Input 
                  type="text" 
                  placeholder="Search schedules..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSearchQuery('')}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchQuery('general')}>General Waste</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchQuery('recycling')}>Recycling</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchQuery('compost')}>Compost</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSearchQuery('hazardous')}>Hazardous</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="outline" 
                  onClick={loadSchedules}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card p-6"
          >
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming" className="flex-1">
                  Upcoming ({upcomingSchedules.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="flex-1">
                  Past Collections ({pastSchedules.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {loading ? (
                  <div className="py-20 text-center">
                    <RefreshCw className="h-8 w-8 mx-auto animate-spin text-eco-500" />
                    <p className="mt-4 text-muted-foreground">Loading schedules...</p>
                  </div>
                ) : upcomingSchedules.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground">No upcoming collections</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingSchedules.map((schedule) => (
                      <CollectionCard 
                        key={schedule.id} 
                        schedule={schedule} 
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {loading ? (
                  <div className="py-20 text-center">
                    <RefreshCw className="h-8 w-8 mx-auto animate-spin text-eco-500" />
                    <p className="mt-4 text-muted-foreground">Loading schedules...</p>
                  </div>
                ) : pastSchedules.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="text-muted-foreground">No past collections</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastSchedules.map((schedule) => (
                      <CollectionCard 
                        key={schedule.id} 
                        schedule={schedule} 
                        onStatusUpdate={handleStatusUpdate}
                        readonly={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

interface CollectionCardProps {
  schedule: PickupSchedule;
  onStatusUpdate: (scheduleId: string, status: 'collected' | 'missed') => void;
  readonly?: boolean;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ 
  schedule, 
  onStatusUpdate,
  readonly = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'collected': return 'bg-empty text-white';
      case 'missed': return 'bg-full text-white';
      default: return 'bg-half text-white';
    }
  };
  
  const getWasteTypeColor = (type: WasteType) => {
    switch (type) {
      case 'general': return 'bg-slate-500';
      case 'recycling': return 'bg-blue-500';
      case 'compost': return 'bg-green-500';
      case 'hazardous': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };
  
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return dateStr;
    }
  };
  
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium">{schedule.area}</h3>
            <p className="text-sm text-muted-foreground">{schedule.address}</p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
            {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{formatDate(schedule.date)}</span>
        </div>
        
        <div className="flex items-center mb-4">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{schedule.time}</span>
        </div>
        
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${getWasteTypeColor(schedule.wasteType)}`}></div>
          <span className="text-sm font-medium">
            {schedule.wasteType.charAt(0).toUpperCase() + schedule.wasteType.slice(1)} Waste
          </span>
        </div>
      </div>
      
      {!readonly && schedule.status === 'scheduled' && (
        <div className="bg-muted/30 px-5 py-3 flex justify-end space-x-3">
          <Button 
            size="sm" 
            className="bg-empty hover:bg-empty/80 text-white"
            onClick={() => onStatusUpdate(schedule.id, 'collected')}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Collected
          </Button>
          
          <Button 
            size="sm"
            className="bg-full hover:bg-full/80 text-white"
            onClick={() => onStatusUpdate(schedule.id, 'missed')}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Missed
          </Button>
        </div>
      )}
    </div>
  );
};

export default CollectionStatus;
