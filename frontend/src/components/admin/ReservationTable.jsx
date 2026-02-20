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
import ModernAlert from '../common/ModernAlert';

const ReservationTable = ({ reservations, setReservations }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [actionType, setActionType] = useState(''); // 'APPROVE', 'REJECT', 'DELETE'
  const [alert, setAlert] = useState({ open: false, title: '', message: '', severity: 'error' });

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

  /* 
   * Handlers for actions 
   */
  const handleConfirmAction = async () => {
    if (!selectedReservation) return;

    try {
      if (actionType === 'DELETE') {
        // Call delete API
        const { deleteReservation } = await import('../../api/reservationsApi'); // Dynamic import to avoid circular dep if any, or just clean module structure
        await deleteReservation(selectedReservation.id);
        const updatedReservations = reservations.filter(r => r.id !== selectedReservation.id);
        setReservations(updatedReservations);
      } else {
        // Approve or Reject
        let status = '';
        if (actionType === 'APPROVE') status = 'APPROVED';
        else if (actionType === 'REJECT') status = 'REJECTED'; // Assuming backend handles 'REJECTED' or 'CANCELLED'? Backend enum has CANCELLED, maybe not REJECTED?

        // Let's check backend enum: PENDING, CONFIRMED, CANCELLED.
        // So APPROVE -> CONFIRMED, REJECT -> CANCELLED?
        if (actionType === 'APPROVE') status = 'CONFIRMED';
        if (actionType === 'REJECT') status = 'CANCELLED';

        const { updateReservationStatus } = await import('../../api/reservationsApi');
        await updateReservationStatus(selectedReservation.id, status);

        const updatedReservations = reservations.map((r) =>
          r.id === selectedReservation.id ? { ...r, status: status } : r
        );
        setReservations(updatedReservations);
      }
    } catch (error) {
      console.error("Failed to update reservation:", error);
      setAlert({
        open: true,
        title: 'Action Failed',
        message: 'Failed to perform action: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    } finally {
      handleCloseDialog();
    }
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
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 650 }} aria-label="reservation table">
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Business Name</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Stall</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Size</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {row.id}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{row.businessName}</TableCell>
                <TableCell>{row.stall}</TableCell>
                <TableCell>{row.size}</TableCell>
                <TableCell>
                  <ReservationStatusChip status={row.status} />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                    {row.status === 'PENDING' ? (
                      <>
                        <IconButton
                          color="success"
                          onClick={() => handleOpenDialog(row, 'APPROVE')}
                          title="Approve"
                          size="small"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          color="warning"
                          onClick={() => handleOpenDialog(row, 'REJECT')}
                          title="Reject"
                          size="small"
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 500, mr: 1 }}>
                        {row.status === 'CONFIRMED' ? 'Approved' : 'Rejected'}
                      </Typography>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDialog(row, 'DELETE')}
                      title="Delete"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {reservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Stack alignItems="center" spacing={1}>
                    <CancelIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                    <div style={{ color: '#666', fontWeight: 500 }}>No reservations found</div>
                  </Stack>
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

      <ModernAlert
        open={alert.open}
        title={alert.title}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </>
  );
};

export default ReservationTable;
