import React from 'react';
import { Chip } from '@mui/material';

const ReservationStatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'CONFIRMED':
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

  return (
    <Chip
      label={status}
      color={getStatusColor(status)}
      variant={status === 'PENDING' ? 'outlined' : 'filled'}
      size="small"
      sx={{ borderRadius: 1.5, fontWeight: 700, minWidth: 80 }}
    />
  );
};

export default ReservationStatusChip;
