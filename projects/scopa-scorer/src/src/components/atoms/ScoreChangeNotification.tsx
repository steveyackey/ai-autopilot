import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreChangeNotificationProps {
  open: boolean;
  message: string;
  type: 'increase' | 'decrease';
  onClose: () => void;
  autoHideDuration?: number;
}

export const ScoreChangeNotification: React.FC<ScoreChangeNotificationProps> = ({
  open,
  message,
  type,
  onClose,
  autoHideDuration = 3000
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity={type === 'increase' ? 'success' : 'info'}
              variant="filled"
              onClose={onClose}
              sx={{ 
                width: '100%',
                boxShadow: 2
              }}
              icon={false}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                {message}
              </motion.div>
            </Alert>
          </Snackbar>
        </motion.div>
      )}
    </AnimatePresence>
  );
};