import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, CircularProgress, Alert } from '@mui/material';
import ReservationTable from "../../components/admin/ReservationTable";
import AdminNavbar from '../../components/layout/AdminNavbar';
import { getAllReservations } from '../../api/reservationsApi';

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await getAllReservations();
      // Transform API data to match table structure if needed
      // API returns: { reservationId, businessName, stallCodes, reservationStatus, ... }
      // Table expects: { id, businessName, stall, size, status }
      // We need to map it.
      const formattedData = response.data.map(res => ({
        id: res.reservationId,
        businessName: res.businessName || 'N/A',
        stall: res.stallCodes ? res.stallCodes.join(', ') : 'N/A',
        size: 'N/A', // Size is per stall, might be mixed. For now N/A or we can fetch stalls details.
        status: res.reservationStatus,
        email: res.email,
        contactNumber: res.contactNumber
      }));
      setReservations(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', bgcolor: theme.palette.background.default }}>
      <AdminNavbar userName="Administrator" />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manage Reservations
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ReservationTable
            reservations={reservations}
            setReservations={setReservations}
          />
        )}
      </Box>
    </Box>
  );
};

export default ManageReservations;

