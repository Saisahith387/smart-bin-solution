
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, User, UserRole } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { LogIn, Home, Truck, Settings } from 'lucide-react';

const Login = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('resident');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // In a real app, we'd authenticate with a server
    setTimeout(() => {
      // Create a user object
      const user: User = {
        id: uuidv4(), // Generate a unique ID
        name: name.trim(),
        role,
      };

      login(user);
      
      toast({
        title: "Success!",
        description: "You've been logged in successfully.",
      });
      
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const getRoleIcon = (roleType: UserRole) => {
    switch (roleType) {
      case 'admin':
        return <Settings className="h-5 w-5" />;
      case 'collector':
        return <Truck className="h-5 w-5" />;
      case 'resident':
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card w-full max-w-md p-8"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant={role === 'resident' ? 'default' : 'outline'}
                  onClick={() => setRole('resident')}
                  disabled={isLoading}
                  className="flex flex-col items-center justify-center p-3 h-auto"
                >
                  <Home className="h-6 w-6 mb-1" />
                  <span>Resident</span>
                </Button>
                <Button
                  type="button"
                  variant={role === 'collector' ? 'default' : 'outline'}
                  onClick={() => setRole('collector')}
                  disabled={isLoading}
                  className="flex flex-col items-center justify-center p-3 h-auto"
                >
                  <Truck className="h-6 w-6 mb-1" />
                  <span>Collector</span>
                </Button>
                <Button
                  type="button"
                  variant={role === 'admin' ? 'default' : 'outline'}
                  onClick={() => setRole('admin')}
                  disabled={isLoading}
                  className="flex flex-col items-center justify-center p-3 h-auto"
                >
                  <Settings className="h-6 w-6 mb-1" />
                  <span>Admin</span>
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">●</span>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p>Don't have an account? <Link to="/register" className="text-eco-600 hover:underline">Register</Link></p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
