
import React from 'react';
import { motion } from 'framer-motion';
import { Recycle, Lightbulb, ArrowRight } from 'lucide-react';

import PageTransition from '@/components/PageTransition';
import WasteScanner from '@/components/WasteScanner';

const RECYCLING_TIPS = [
  {
    title: "Rinse Containers",
    description: "Always rinse food containers before recycling to prevent contamination of other recyclables."
  },
  {
    title: "Remove Caps",
    description: "Remove plastic caps from bottles before recycling, as they are often made from different types of plastic."
  },
  {
    title: "Check the Number",
    description: "Check the recycling number on plastic items. Most facilities accept #1 and #2 plastics, but others may vary."
  },
  {
    title: "Flatten Cardboard",
    description: "Flatten cardboard boxes to save space in recycling bins and improve collection efficiency."
  }
];

const SortingAssistant = () => {
  const handleScanResult = (result: string) => {
    console.log('Scan result:', result);
    // Would handle the scanning result here
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-3xl font-bold tracking-tight mb-2"
            >
              Waste Sorting Assistant
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Learn how to properly sort and dispose of waste items
            </motion.p>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scanning Tool */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <WasteScanner onScan={handleScanResult} />
            </motion.div>
            
            {/* Recycling Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-5 w-5 text-eco-500 mr-2" />
                  <h3 className="text-lg font-medium">Recycling Tips</h3>
                </div>
                
                <div className="space-y-4">
                  {RECYCLING_TIPS.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                      className="p-4 rounded-lg border border-border bg-background/50"
                    >
                      <h4 className="font-medium mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <Recycle className="h-5 w-5 text-eco-500 mr-2" />
                  <h3 className="text-lg font-medium">Did You Know?</h3>
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="rounded-lg overflow-hidden"
                >
                  <div className="p-4 bg-accent/50 text-accent-foreground rounded-lg">
                    <p className="text-sm leading-relaxed">
                      Recycling one aluminum can saves enough energy to run a TV for 3 hours. 
                      Proper recycling can save up to 75% of energy compared to producing new products.
                    </p>
                  </div>
                </motion.div>
                
                <div className="mt-4">
                  <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors">
                    <span>Learn More About Recycling</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Waste Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="mt-8"
          >
            <h3 className="text-2xl font-medium mb-6">Common Waste Categories</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CategoryCard
                title="Recyclable"
                description="Paper, cardboard, glass, certain plastics, aluminum cans, and metal containers."
                color="bg-blue-500"
                delay={0.2}
              />
              
              <CategoryCard
                title="Compostable"
                description="Food scraps, yard waste, coffee grounds, tea bags, and soiled paper products."
                color="bg-eco-500"
                delay={0.3}
              />
              
              <CategoryCard
                title="General Waste"
                description="Non-recyclable plastics, soiled food containers, styrofoam, and certain packaging."
                color="bg-slate-500"
                delay={0.4}
              />
              
              <CategoryCard
                title="Hazardous"
                description="Batteries, electronics, chemicals, paints, oils, and certain cleaning products."
                color="bg-amber-500"
                delay={0.5}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

// Helper component for waste categories
const CategoryCard = ({ 
  title, 
  description, 
  color,
  delay
}: { 
  title: string; 
  description: string; 
  color: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card overflow-hidden"
    >
      <div className={`h-2 ${color}`} />
      <div className="p-5">
        <h4 className="text-lg font-medium mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};

export default SortingAssistant;
