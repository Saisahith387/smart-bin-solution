
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LogOut, 
  User,
  Home,
  Truck,
  Settings,
  LogIn,
  UserPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

const NavbarAuth = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
    setLogoutDialogOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
        return <Settings className="h-4 w-4 mr-2" />;
      case 'collector':
        return <Truck className="h-4 w-4 mr-2" />;
      case 'resident':
      default:
        return <Home className="h-4 w-4 mr-2" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={() => navigate('/login')}
          size="sm"
          className="flex items-center"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
        <Button
          onClick={() => navigate('/register')}
          size="sm"
          className="flex items-center"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Register
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          onClick={() => setLogoutDialogOpen(true)}
          size="sm"
          className="flex items-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 mr-2"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarFallback className="bg-eco-500/20 text-eco-700">
                  {user ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground flex items-center mt-1">
                  {getRoleIcon()}
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <User className="h-4 w-4 mr-2" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavbarAuth;
