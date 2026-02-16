import React from 'react';
import { Chip } from '@mui/material';

const ReservationStatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
      variant="outlined" 
      size="small"
      sx={{ fontWeight: 'bold' }}
    />
  );
};

export default ReservationStatusChip;
