
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar, ClipboardList, AlertTriangle, CheckSquare, XSquare, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateScheduleStatus } from '@/services/dataService';
import { PickupSchedule } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ActionButtonProps {
  schedule?: PickupSchedule;
  onStatusUpdate?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const ActionButton = ({ schedule, onStatusUpdate, variant = "default", size = "default" }: ActionButtonProps) => {
  const { user, isAdmin, isCollector, isResident } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMarkCollected = () => {
    if (!schedule || !user) return;
    
    try {
      updateScheduleStatus(schedule.id, 'collected', user.id);
      toast({
        title: "Status Updated",
        description: "Pickup marked as collected successfully",
      });
      if (onStatusUpdate) onStatusUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleMarkMissed = () => {
    if (!schedule || !user) return;
    
    try {
      updateScheduleStatus(schedule.id, 'missed', user.id);
      toast({
        title: "Status Updated",
        description: "Pickup marked as missed",
      });
      if (onStatusUpdate) onStatusUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getButtonText = () => {
    if (isAdmin) return "Admin Actions";
    if (isCollector) return "Collector Actions";
    return "Resident Actions";
  };

  const getButtonIcon = () => {
    if (isAdmin) return <Settings className="mr-2 h-4 w-4" />;
    if (isCollector) return <CheckSquare className="mr-2 h-4 w-4" />;
    return <Calendar className="mr-2 h-4 w-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          {getButtonIcon()}
          {getButtonText()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isResident && (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate('/schedules')}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>View Schedules</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/issues')}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>Report Issue</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        
        {isCollector && schedule && (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleMarkCollected} disabled={schedule.status === 'collected'}>
              <CheckSquare className="mr-2 h-4 w-4" />
              <span>Mark as Collected</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMarkMissed} disabled={schedule.status === 'missed'}>
              <XSquare className="mr-2 h-4 w-4" />
              <span>Mark as Missed</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/collection-status')}>
              <ClipboardList className="mr-2 h-4 w-4" />
              <span>View All Collections</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        
        {isAdmin && (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate('/schedules')}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Manage Schedules</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/issues')}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>View Reported Issues</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/analytics')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Data Analytics</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionButton;
