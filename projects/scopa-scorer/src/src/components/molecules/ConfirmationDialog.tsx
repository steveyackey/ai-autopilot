import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'warning' | 'error' | 'info';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  severity = 'warning'
}) => {
  // Handle keyboard events for accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onConfirm();
    } else if (event.key === 'Escape') {
      onCancel();
    }
  };

  // Get the appropriate icon based on severity
  const getIcon = () => {
    switch (severity) {
      case 'error':
        return <ErrorOutlineIcon fontSize="large" color="error" />;
      case 'info':
        return <InfoOutlinedIcon fontSize="large" color="info" />;
      case 'warning':
      default:
        return <WarningAmberIcon fontSize="large" color="warning" />;
    }
  };

  // Get color based on severity for the confirm button
  const getConfirmButtonColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'info':
        return 'primary';
      case 'warning':
      default:
        return 'warning';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      onKeyDown={handleKeyDown}
      aria-labelledby="confirmation-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirmation-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
          {getIcon()}
          {title}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Alert severity={severity} sx={{ mb: 2 }}>
          <Typography variant="body1">{message}</Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onCancel} 
          variant="outlined" 
          autoFocus
        >
          {cancelLabel}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={getConfirmButtonColor() as any}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};