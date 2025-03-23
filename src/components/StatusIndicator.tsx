
import React from 'react';
import { motion } from 'framer-motion';

type StatusType = 'empty' | 'half' | 'full';

interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  pulse?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  size = 'md', 
  showLabel = false,
  pulse = false
}) => {
  const getColor = () => {
    switch (status) {
      case 'empty': return 'bg-empty';
      case 'half': return 'bg-half';
      case 'full': return 'bg-full';
      default: return 'bg-gray-300';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'empty': return 'Empty';
      case 'half': return 'Half Full';
      case 'full': return 'Full';
      default: return 'Unknown';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'md': return 'h-4 w-4';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };

  const ringColor = () => {
    switch (status) {
      case 'empty': return 'bg-empty/30';
      case 'half': return 'bg-half/30';
      case 'full': return 'bg-full/30';
      default: return 'bg-gray-300/30';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <motion.div
          className={`${getSizeClasses()} ${getColor()} rounded-full`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {pulse && (
          <motion.div
            className={`absolute inset-0 ${getSizeClasses()} ${ringColor()} rounded-full`}
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              repeatType: "loop"
            }}
          />
        )}
      </div>
      
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground">
          {getLabel()}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
