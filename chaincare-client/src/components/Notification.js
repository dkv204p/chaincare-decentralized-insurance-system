import React from 'react';
import { Alert } from 'react-bootstrap';

const Notification = ({ message, type, onDismiss }) => {
  if (!message) return null;

  // Base style for all notifications to match the dark theme
  const baseStyle = {
    backgroundColor: '#1F2937', // A slightly lighter dark color for contrast
    color: '#D1D5DB',
    border: '1px solid',
    borderRadius: '0.5rem',
  };

  // Specific styles for different notification types (success, error, etc.)
  const variantStyles = {
    success: {
      borderColor: '#10B981', // Green border for success
      color: '#A7F3D0',       // Light green text for success
    },
    danger: {
      borderColor: '#EF4444', // Red border for error
      color: '#FECACA',       // Light red text for error
    },
  };

  // Merge the base style with the style for the specific variant
  const notificationStyle = { ...baseStyle, ...variantStyles[type] };

  return (
    <Alert 
      style={notificationStyle} 
      onClose={onDismiss} 
      dismissible 
      className="mt-3"
    >
      {message}
    </Alert>
  );
};

export default Notification;
