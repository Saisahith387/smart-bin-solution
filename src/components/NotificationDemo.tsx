
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useNotifications from '@/hooks/useNotifications';
import { getSchedules } from '@/services/dataService';
import { PickupSchedule } from '@/types';
import { format } from 'date-fns';

const NotificationDemo = () => {
  const { 
    isSupported, 
    permissionGranted, 
    requestPermission, 
    sendNotification 
  } = useNotifications();
  
  const [nextPickup, setNextPickup] = useState<PickupSchedule | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    // Load upcoming pickups
    try {
      const schedules = getSchedules();
      const upcomingSchedules = schedules
        .filter(s => s.status === 'scheduled')
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
      
      if (upcomingSchedules.length > 0) {
        setNextPickup(upcomingSchedules[0]);
      }
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  }, []);
  
  useEffect(() => {
    if (!nextPickup) return;
    
    const updateTime = () => {
      const now = new Date();
      const pickupDate = new Date(`${nextPickup.date}T${nextPickup.time}`);
      
      if (pickupDate <= now) {
        setTimeLeft('Scheduled for today');
        return;
      }
      
      const diff = pickupDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        setTimeLeft(`${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`);
      } else if (hours > 0) {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`);
      } else {
        const minutes = Math.floor(diff / (1000 * 60));
        setTimeLeft(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
      }
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [nextPickup]);
  
  const handleEnableNotifications = async () => {
    if (!isSupported) return;
    
    const granted = await requestPermission();
    
    if (granted && nextPickup) {
      sendTestNotification();
    }
  };
  
  const sendTestNotification = () => {
    if (!nextPickup) return;
    
    sendNotification(
      'Upcoming Waste Collection',
      `You have a ${nextPickup.wasteType} waste collection scheduled in ${timeLeft} at ${nextPickup.address}.`,
      'pickup-reminder'
    );
  };
  
  const formatPickupTime = (schedule: PickupSchedule) => {
    try {
      const date = new Date(`${schedule.date}T${schedule.time}`);
      return format(date, 'EEEE, MMMM d, yyyy h:mm a');
    } catch (error) {
      return `${schedule.date} ${schedule.time}`;
    }
  };
  
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Pickup Reminders</span>
          {permissionGranted ? (
            <Bell className="h-5 w-5 text-eco-500" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {nextPickup ? (
          <>
            <div className="mb-4">
              <div className="flex items-center mb-1">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{formatPickupTime(nextPickup)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{nextPickup.address}</p>
              <div className="mt-2 flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${
                  nextPickup.wasteType === 'general' ? 'bg-slate-500' : 
                  nextPickup.wasteType === 'recycling' ? 'bg-blue-500' : 
                  nextPickup.wasteType === 'compost' ? 'bg-green-500' : 
                  'bg-red-500'
                }`}></div>
                <span className="text-sm">
                  {nextPickup.wasteType.charAt(0).toUpperCase() + nextPickup.wasteType.slice(1)} Waste
                </span>
              </div>
              
              <div className="bg-muted/30 px-3 py-2 mt-3 rounded-md">
                <p className="text-sm">
                  {timeLeft ? (
                    <>Coming up in: <span className="font-medium">{timeLeft}</span></>
                  ) : (
                    'Scheduled pickup'
                  )}
                </p>
              </div>
            </div>
            
            {isSupported && (
              <div className="flex justify-end">
                {permissionGranted ? (
                  <Button 
                    size="sm" 
                    className="bg-eco-500 hover:bg-eco-600" 
                    onClick={sendTestNotification}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Send Test Notification
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleEnableNotifications}
                  >
                    <BellOff className="h-4 w-4 mr-2" />
                    Enable Reminders
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No upcoming pickups scheduled</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationDemo;
