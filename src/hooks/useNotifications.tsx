
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setIsSupported(true);
      
      // Check if permission is already granted
      if (Notification.permission === 'granted') {
        setPermissionGranted(true);
      }
    }
    
    // Load saved notifications from localStorage
    const savedNotifications = localStorage.getItem('eco_notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Failed to parse notifications:', error);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: 'Notifications Not Supported',
        description: 'Your browser does not support notifications.',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setPermissionGranted(granted);
      
      if (granted) {
        toast({
          title: 'Notifications Enabled',
          description: 'You will now receive notifications about waste collection.'
        });
      } else {
        toast({
          title: 'Permission Denied',
          description: 'You will not receive notifications. You can change this in your browser settings.',
          variant: 'destructive'
        });
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to request notification permission.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const sendNotification = (title: string, message: string, tag?: string) => {
    // Add to internal notifications list
    const newNotification: Notification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('eco_notifications', JSON.stringify(updatedNotifications));
    
    // Send browser notification if permission is granted
    if (isSupported && permissionGranted) {
      try {
        // Create and show the notification
        const notification = new Notification(title, {
          body: message,
          tag,
          icon: '/favicon.ico'
        });
        
        // Handle notification click
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    } else {
      // Fallback to toast notification
      toast({
        title,
        description: message
      });
    }
    
    return newNotification;
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('eco_notifications', JSON.stringify(updatedNotifications));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('eco_notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isSupported,
    permissionGranted,
    requestPermission,
    sendNotification,
    markAsRead,
    clearNotifications
  };
};

export default useNotifications;
