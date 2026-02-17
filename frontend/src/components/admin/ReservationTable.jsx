import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Stack
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ReservationStatusChip from './ReservationStatusChip';
import ReservationActionDialog from './ReservationActionDialog';

const ReservationTable = ({ reservations, setReservations }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [actionType, setActionType] = useState(''); // 'APPROVE', 'REJECT', 'DELETE'

  const handleOpenDialog = (reservation, type) => {
    setSelectedReservation(reservation);
    setActionType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReservation(null);
    setActionType('');
  };

  const handleConfirmAction = () => {
    if (!selectedReservation) return;

    let updatedStatus = selectedReservation.status;
    
    if (actionType === 'APPROVE') {
      updatedStatus = 'APPROVED';
    } else if (actionType === 'REJECT') {
      updatedStatus = 'REJECTED';
    } else if (actionType === 'DELETE') {
      // Handle delete
      const updatedReservations = reservations.filter(r => r.id !== selectedReservation.id);
      setReservations(updatedReservations);
      handleCloseDialog();
      return;
    }

    const updatedReservations = reservations.map((r) =>
      r.id === selectedReservation.id ? { ...r, status: updatedStatus } : r
    );
    setReservations(updatedReservations);
    handleCloseDialog();
  };

  const getDialogDetails = () => {
    switch (actionType) {
      case 'APPROVE':
        return {
          title: 'Approve Reservation',
          content: `Are you sure you want to approve the reservation for ${selectedReservation?.businessName}?`,
          confirmText: 'Approve',
          confirmColor: 'success'
        };
      case 'REJECT':
        return {
          title: 'Reject Reservation',
          content: `Are you sure you want to reject the reservation for ${selectedReservation?.businessName}?`,
          confirmText: 'Reject',
          confirmColor: 'error'
        };
      case 'DELETE':
        return {
          title: 'Delete Reservation',
          content: `Are you sure you want to delete the reservation for ${selectedReservation?.businessName}? This action cannot be undone.`,
          confirmText: 'Delete',
          confirmColor: 'error'
        };
      default:
        return { title: '', content: '', confirmText: '', confirmColor: 'primary' };
    }
  };

  const { title, content, confirmText, confirmColor } = getDialogDetails();

  return (
    <>
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="reservation table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Business Name</strong></TableCell>
              <TableCell><strong>Stall</strong></TableCell>
              <TableCell><strong>Size</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.businessName}</TableCell>
                <TableCell>{row.stall}</TableCell>
                <TableCell>{row.size}</TableCell>
                <TableCell>
                  <ReservationStatusChip status={row.status} />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {row.status === 'PENDING' && (
                      <>
                        <IconButton 
                          color="success" 
                          onClick={() => handleOpenDialog(row, 'APPROVE')}
                          title="Approve"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton 
                          color="warning" 
                          onClick={() => handleOpenDialog(row, 'REJECT')}
                          title="Reject"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                     <IconButton 
                        color="error" 
                        onClick={() => handleOpenDialog(row, 'DELETE')}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No reservations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ReservationActionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={title}
        content={content}
        onConfirm={handleConfirmAction}
        confirmText={confirmText}
        confirmColor={confirmColor}
      />
    </>
  );
};

export default ReservationTable;
