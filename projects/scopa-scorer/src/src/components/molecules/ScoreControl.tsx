import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip, Badge } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreControlProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  tooltipText?: string;
}

export const ScoreControl: React.FC<ScoreControlProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  tooltipText
}) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // If value changed externally, update prevValue
    if (value !== prevValue) {
      setPrevValue(value);
      setIsAnimating(true);
      
      // Reset animation flag after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);
  
  // Handle increment with bounds checking
  const handleIncrement = () => {
    if (value < max) {
      setPrevValue(value);
      onChange(value + 1);
      setIsAnimating(true);
    }
  };
  
  // Handle decrement with bounds checking
  const handleDecrement = () => {
    if (value > min) {
      setPrevValue(value);
      onChange(value - 1);
      setIsAnimating(true);
    }
  };
  
  // Determine if buttons should be disabled
  const isIncrementDisabled = value >= max;
  const isDecrementDisabled = value <= min;
  
  // Determine animation color based on value change
  const getAnimationColor = () => {
    if (value > prevValue) return '#4caf50'; // green for increase
    if (value < prevValue) return '#f44336'; // red for decrease
    return 'transparent';
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        p: 1,
        borderRadius: 1,
        backgroundColor: isAnimating ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        transition: 'background-color 0.5s'
      }}
    >
      <Tooltip title={tooltipText || ''} placement="top" arrow>
        <Typography
          sx={{
            minWidth: '100px',
            fontWeight: isAnimating ? 'bold' : 'normal',
            transition: 'font-weight 0.5s'
          }}
        >
          {label}
        </Typography>
      </Tooltip>
      
      <IconButton 
        size="small" 
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
        aria-label={`Decrease ${label}`}
        sx={{ color: isDecrementDisabled ? 'text.disabled' : 'error.main' }}
      >
        <RemoveIcon />
      </IconButton>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Box 
            component={Badge}
            badgeContent={value > prevValue ? '+1' : value < prevValue ? '-1' : null}
            color={value > prevValue ? 'success' : 'error'}
            sx={{ 
              minWidth: '30px', 
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            <Typography variant="body1">{value}</Typography>
          </Box>
        </motion.div>
      </AnimatePresence>
      
      <IconButton 
        size="small" 
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
        aria-label={`Increase ${label}`}
        sx={{ color: isIncrementDisabled ? 'text.disabled' : 'success.main' }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};