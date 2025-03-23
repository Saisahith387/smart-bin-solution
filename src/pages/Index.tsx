
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Recycle, BarChart3, Map, Search } from 'lucide-react';

import PageTransition from '@/components/PageTransition';

const Index = () => {
  const navigate = useNavigate();

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const hero = document.querySelector('.hero-parallax');
      const features = document.querySelector('.features-section');
      
      if (hero) {
        (hero as HTMLElement).style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      
      if (features) {
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach((item, index) => {
          const delay = index * 0.1;
          const offset = scrollY * (0.1 + delay * 0.05);
          (item as HTMLElement).style.transform = `translateY(-${offset}px)`;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Recycle className="h-8 w-8" />,
      title: 'Smart Bin Management',
      description: 'Monitor bin fill levels in real-time and receive alerts when bins need attention.'
    },
    {
      icon: <Map className="h-8 w-8" />,
      title: 'Interactive Bin Map',
      description: 'Visualize bin locations and statuses on an interactive map for efficient route planning.'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Waste Analytics',
      description: 'Gain insights into waste patterns and trends to optimize collection schedules.'
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: 'Sorting Assistant',
      description: 'Easily identify recyclable items and learn proper waste disposal methods.'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-eco-50/50 to-transparent opacity-70"></div>
          
          {/* Background pattern */}
          <div className="absolute inset-0 bg-noise opacity-5"></div>
          
          {/* Hero content */}
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-eco-100 text-eco-800 mb-4">
                  Revolutionizing Waste Management
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-balance"
              >
                Smart Waste Management <br />for a Cleaner Future
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              >
                Optimize waste collection, improve recycling rates, and reduce environmental impact with our intelligent bin monitoring system.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 rounded-lg bg-eco-500 text-white font-medium flex items-center space-x-2 hover:bg-eco-600 transition-colors shadow-lg shadow-eco-500/20"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => navigate('/sorting-assistant')}
                  className="px-6 py-3 rounded-lg bg-white text-eco-700 border border-border font-medium hover:bg-muted/50 transition-colors"
                >
                  Try Sorting Assistant
                </button>
              </motion.div>
            </div>
          </div>
          
          {/* Hero parallax elements */}
          <div className="hero-parallax absolute inset-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="absolute top-1/4 right-[10%] w-64 h-64 bg-eco-300/20 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute bottom-1/4 left-[15%] w-64 h-64 bg-eco-200/30 rounded-full blur-3xl"
            />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="features-section py-20 md:py-32 bg-white relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground mb-4">
                Key Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Intelligent Waste Management
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform offers comprehensive tools to streamline waste collection, monitoring, and recycling processes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="feature-item glass-card p-6 relative"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-eco-300 to-transparent opacity-50" />
                  <div className="mb-4 text-eco-500">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-eco-50 relative">
          <div className="absolute inset-0 bg-noise opacity-10"></div>
          <div className="container mx-auto px-4 md:px-6 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Waste Management?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join the revolution in smart, sustainable waste solutions and make a positive impact on our environment.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-lg bg-eco-500 text-white font-medium flex items-center space-x-2 hover:bg-eco-600 transition-colors shadow-lg shadow-eco-500/20 mx-auto"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Index;
