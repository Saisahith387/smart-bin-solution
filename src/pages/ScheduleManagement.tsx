
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Plus, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/contexts/AuthContext';
import { getSchedules, addSchedule } from '@/services/dataService';
import { PickupSchedule, WasteType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ScheduleManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<PickupSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newSchedule, setNewSchedule] = useState({
    area: '',
    address: '',
    date: '',
    time: '',
    wasteType: 'general' as WasteType
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({ ...prev, [name]: value }));
  };
  
  const handleWasteTypeChange = (value: string) => {
    setNewSchedule(prev => ({ ...prev, wasteType: value as WasteType }));
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setNewSchedule(prev => ({
        ...prev,
        date: format(date, 'yyyy-MM-dd')
      }));
    }
  };
  
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      addSchedule(newSchedule);
      setDialogOpen(false);
      loadSchedules();
      toast({
        title: 'Success',
        description: 'Schedule added successfully',
      });
      setNewSchedule({
        area: '',
        address: '',
        date: '',
        time: '',
        wasteType: 'general'
      });
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to add schedule',
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
  
  const isAdmin = user?.role === 'admin';
  
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
              Pickup Schedules
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground"
            >
              {isAdmin 
                ? 'Manage waste collection schedules for all areas' 
                : 'View upcoming waste collection schedules in your area'}
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
                  placeholder="Search by area, address, or date..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-eco-500 hover:bg-eco-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Schedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Pickup Schedule</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddSchedule} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Area</label>
                          <Input 
                            name="area"
                            value={newSchedule.area}
                            onChange={handleInputChange}
                            placeholder="e.g., Downtown"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Address</label>
                          <Input 
                            name="address"
                            value={newSchedule.address}
                            onChange={handleInputChange}
                            placeholder="e.g., Main Street & 5th Ave"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="justify-start text-left font-normal w-full"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, 'PPP') : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                initialFocus
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Time</label>
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <div className="pl-3">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input 
                              name="time"
                              type="time"
                              value={newSchedule.time}
                              onChange={handleInputChange}
                              className="border-0"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Waste Type</label>
                          <Select 
                            value={newSchedule.wasteType} 
                            onValueChange={handleWasteTypeChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select waste type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Waste</SelectItem>
                              <SelectItem value="recycling">Recycling</SelectItem>
                              <SelectItem value="compost">Compost</SelectItem>
                              <SelectItem value="hazardous">Hazardous</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-eco-500 hover:bg-eco-600">
                            Add Schedule
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={loadSchedules}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Schedules List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-medium mb-6">Upcoming Pickups</h2>
            
            {loading ? (
              <div className="py-20 text-center">
                <RefreshCw className="h-8 w-8 mx-auto animate-spin text-eco-500" />
                <p className="mt-4 text-muted-foreground">Loading schedules...</p>
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-muted-foreground">No schedules found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchedules.map((schedule) => (
                  <ScheduleCard 
                    key={schedule.id} 
                    schedule={schedule} 
                    isAdmin={isAdmin}
                    onRefresh={loadSchedules}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

interface ScheduleCardProps {
  schedule: PickupSchedule;
  isAdmin: boolean;
  onRefresh: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, isAdmin, onRefresh }) => {
  const { toast } = useToast();
  
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
  
  const isPast = new Date(`${schedule.date}T${schedule.time}`) < new Date();
  
  return (
    <div className={`rounded-lg border border-border bg-card shadow-sm overflow-hidden ${isPast ? 'opacity-70' : ''}`}>
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
      
      {isAdmin && (
        <div className="bg-muted/30 px-5 py-3 flex justify-end">
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              // Delete functionality would go here
              toast({
                title: "Not Implemented",
                description: "Schedule deletion is not implemented in this demo.",
              });
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
