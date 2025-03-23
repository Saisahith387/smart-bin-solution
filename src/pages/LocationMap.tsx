
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trash, FileSearch, RefreshCw } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import GoogleMap from '@/components/GoogleMap';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getSchedules } from '@/services/dataService';
import { PickupSchedule } from '@/types';

interface BinLocation {
  lat: number;
  lng: number;
  address: string;
  id?: string;
  wasteType?: string;
  status?: string;
}

// Mock bin locations - in a real app, these would come from the API
const MOCK_BIN_LOCATIONS: BinLocation[] = [
  { lat: 40.7128, lng: -74.0060, address: 'New York City Hall, New York, NY' },
  { lat: 40.7142, lng: -74.0130, address: 'One World Trade Center, New York, NY' },
  { lat: 40.7411, lng: -73.9897, address: 'Empire State Building, New York, NY' },
  { lat: 40.7516, lng: -73.9755, address: 'Grand Central Terminal, New York, NY' },
  { lat: 40.7587, lng: -73.9787, address: 'Rockefeller Center, New York, NY' },
];

const LocationMap = () => {
  const [mapApiKey, setMapApiKey] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<BinLocation | null>(null);
  const [schedules, setSchedules] = useState<PickupSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  
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
    } finally {
      setLoading(false);
    }
  };
  
  const handleLocationSelect = (location: BinLocation) => {
    setSelectedLocation(location);
  };
  
  // In a real app, this function would convert address to coordinates
  // For demo purposes, we'll just use the mock data
  const getScheduleLocations = (): BinLocation[] => {
    return schedules.map((schedule, index) => {
      // For demo purposes, slightly offset the mock coordinates to make them unique
      const baseLocation = MOCK_BIN_LOCATIONS[index % MOCK_BIN_LOCATIONS.length];
      return {
        lat: baseLocation.lat + (Math.random() - 0.5) * 0.01,
        lng: baseLocation.lng + (Math.random() - 0.5) * 0.01,
        address: schedule.address,
        id: schedule.id,
        wasteType: schedule.wasteType,
        status: schedule.status
      };
    });
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
              Waste Collection Map
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Find nearby collection points and scheduled pickups
            </motion.p>
          </div>
          
          {/* API Key Input (for demo purposes) */}
          {!mapApiKey && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="glass-card p-6 mb-6"
            >
              <div className="max-w-xl mx-auto text-center">
                <h2 className="text-lg font-medium mb-3">Google Maps API Key Required</h2>
                <p className="text-muted-foreground mb-4">
                  To use the interactive map, you'll need to provide a Google Maps API key.
                  In a production app, this would be securely stored on the server.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    className="bg-eco-500 hover:bg-eco-600"
                    onClick={() => setMapApiKey('demo_key')}
                  >
                    Use Demo Mode (No Live Map)
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Note: Demo mode shows a placeholder map with sample data.
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Map and Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Container */}
            <motion.div 
              className="lg:col-span-2 h-[calc(100vh-250px)] min-h-[500px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <GoogleMap 
                apiKey={mapApiKey} 
                markers={mapApiKey ? getScheduleLocations() : []}
                onLocationSelect={handleLocationSelect}
                height="100%"
              />
            </motion.div>
            
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="glass-card p-6 h-[calc(100vh-250px)] min-h-[500px] overflow-y-auto"
            >
              <Tabs defaultValue="collection-points">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="collection-points" className="flex-1">
                    <Trash className="h-4 w-4 mr-2" />
                    Bins
                  </TabsTrigger>
                  <TabsTrigger value="schedules" className="flex-1">
                    <FileSearch className="h-4 w-4 mr-2" />
                    Schedules
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="collection-points">
                  <div className="space-y-4">
                    <h3 className="font-medium">Collection Points</h3>
                    
                    {MOCK_BIN_LOCATIONS.map((location, index) => (
                      <div
                        key={index}
                        className="p-3 border border-border rounded-lg hover:bg-muted/30 cursor-pointer"
                        onClick={() => setSelectedLocation(location)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-eco-100 p-2 rounded-full">
                            <MapPin className="h-4 w-4 text-eco-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Bin #{index + 1}</p>
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="schedules">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Upcoming Pickups</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={loadSchedules}
                      >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                    
                    {loading ? (
                      <div className="py-10 text-center">
                        <RefreshCw className="h-6 w-6 mx-auto animate-spin text-eco-500" />
                        <p className="mt-2 text-sm text-muted-foreground">Loading schedules...</p>
                      </div>
                    ) : schedules.length === 0 ? (
                      <div className="py-10 text-center">
                        <p className="text-muted-foreground">No schedules found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {schedules.map((schedule) => (
                          <div 
                            key={schedule.id}
                            className="p-3 border border-border rounded-lg hover:bg-muted/30 cursor-pointer"
                          >
                            <p className="font-medium text-sm">{schedule.area}</p>
                            <p className="text-sm text-muted-foreground">{schedule.address}</p>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs text-muted-foreground">
                                {schedule.date} • {schedule.time}
                              </p>
                              <span 
                                className={`text-xs px-2 py-0.5 rounded-full 
                                  ${schedule.status === 'collected' ? 'bg-green-100 text-green-800' : 
                                    schedule.status === 'missed' ? 'bg-red-100 text-red-800' : 
                                    'bg-blue-100 text-blue-800'}`}
                              >
                                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              {selectedLocation && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Selected Location</h3>
                  <p className="text-sm">{selectedLocation.address}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground">
                      {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </p>
                    <Button size="sm" className="bg-eco-500 hover:bg-eco-600 text-xs" asChild>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View in Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LocationMap;
