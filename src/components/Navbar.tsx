
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Home, Map, Recycle, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { to: '/map', label: 'Bin Map', icon: Map },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/sorting-assistant', label: 'Sorting Assistant', icon: Recycle },
  ];

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 ${
    isScrolled ? 'py-2 glass-effect' : 'py-4 bg-transparent'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mr-2"
          >
            <Recycle className="h-7 w-7 text-eco-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl font-bold tracking-tight text-foreground"
          >
            SmartBin
          </motion.h1>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'text-eco-600' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }
              `}
            >
              {({ isActive }) => (
                <div className="flex items-center">
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-md bg-accent/80"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30
                      }}
                    />
                  )}
                  <div className="flex items-center space-x-2 relative z-10">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>

        {/* Mobile Menu */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isMenuOpen ? 1 : 0,
              height: isMenuOpen ? 'auto' : 0,
              display: isMenuOpen ? 'block' : 'none',
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 glass-effect overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-accent text-eco-600' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
