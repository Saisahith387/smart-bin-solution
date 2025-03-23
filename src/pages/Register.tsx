
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import PageTransition from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'resident' | 'collector' | 'admin'>('resident');
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
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

    // In a real app, we'd register with a server
    // For now, we'll simulate a network request
    setTimeout(() => {
      // Create a user object
      const user: User = {
        id: uuidv4(), // Generate a unique ID
        name: name.trim(),
        role,
      };

      register(user);
      
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });
      
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
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
            <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
            <p className="text-muted-foreground">Join our waste management community</p>
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
              <label htmlFor="role" className="block text-sm font-medium">
                Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={role === 'resident' ? 'default' : 'outline'}
                  onClick={() => setRole('resident')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Resident
                </Button>
                <Button
                  type="button"
                  variant={role === 'collector' ? 'default' : 'outline'}
                  onClick={() => setRole('collector')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Collector
                </Button>
                <Button
                  type="button"
                  variant={role === 'admin' ? 'default' : 'outline'}
                  onClick={() => setRole('admin')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Admin
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
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p>Already have an account? <Link to="/login" className="text-eco-600 hover:underline">Sign in</Link></p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Register;
