
import React from 'react';
import { 
  Bell, 
  Settings, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  BellOff
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useNotifications from '@/hooks/useNotifications';

const NotificationsDropdown = () => {
  const { 
    notifications, 
    unreadCount, 
    isSupported,
    permissionGranted,
    requestPermission,
    markAsRead,
    clearNotifications
  } = useNotifications();

  const handleTogglePermission = async () => {
    if (!permissionGranted) {
      await requestPermission();
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'h:mm a');
    } catch (error) {
      return '';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-full text-[10px] font-bold flex items-center justify-center text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleTogglePermission}
              title={isSupported ? (permissionGranted ? 'Notifications enabled' : 'Enable notifications') : 'Notifications not supported'}
              disabled={!isSupported || permissionGranted}
            >
              {permissionGranted ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={clearNotifications}
              disabled={notifications.length === 0}
              title="Clear all notifications"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {!isSupported && (
          <div className="px-2 py-4 text-center">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Notifications are not supported in your browser.</p>
          </div>
        )}
        
        {isSupported && !permissionGranted && (
          <div className="px-2 py-4 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-3">Enable notifications to stay updated on waste collection schedules.</p>
            <Button size="sm" className="bg-eco-500 hover:bg-eco-600" onClick={handleTogglePermission}>
              Enable Notifications
            </Button>
          </div>
        )}
        
        {notifications.length === 0 && (
          <div className="px-2 py-4 text-center">
            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          </div>
        )}
        
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className={`flex flex-col items-start p-3 ${notification.read ? '' : 'bg-muted/30'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex w-full justify-between items-start mb-1">
                <span className="font-medium text-sm">{notification.title}</span>
                <span className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
