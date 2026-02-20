import React, { useState } from 'react';
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Stack,
	Typography,
	CircularProgress
} from '@mui/material';
import { CheckCircleOutline, Payment as PaymentIcon, Money as CashIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { createReservation } from '../../api/reservationsApi';
import { processPayment } from '../../api/paymentApi';
import { getStoredAuth } from '../../api/dashboardApi';

const BookingConfirmation = ({ bookingDetails }) => {
	const navigate = useNavigate();
	const { stalls = [], company = {} } = bookingDetails;

	const [status, setStatus] = useState('review'); // review, creating, payment, processing, success, error
	const [reservationId, setReservationId] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	// Group stalls by hall
	const stallsByHall = stalls.reduce((acc, stall) => {
		if (!acc[stall.hallName]) acc[stall.hallName] = [];
		acc[stall.hallName].push(stall.id);
		return acc;
	}, {});


	const handleCreateReservation = async () => {
		// Use consistent auth retrieval
		const user = getStoredAuth();

		if (!user || !user.userId) {
			alert('User session not found. Please log in again.');
			navigate('/login');
			return;
		}

		// Map userId to id for consistency if needed, though backend expects userId
		const userId = user.userId;

		// Filter valid stalls with dbId
		const validStallIds = stalls.map(s => s.dbId).filter(id => id);

		if (validStallIds.length === 0) {
			alert('No valid stalls selected for reservation (stalls found in map but not in database).');
			return;
		}

		const bookingRecord = {
			userId: userId,
			stallIds: validStallIds
		};

		try {
			setStatus('creating');
			const response = await createReservation(bookingRecord);

			if (response.success && response.data) {
				setReservationId(response.data.reservationId);
				setStatus('payment'); // Move to payment step
			} else {
				setErrorMessage('Failed to create reservation. Please try again.');
				setStatus('error');
			}
		} catch (error) {
			console.error('Failed to create reservation', error);
			const msg = error.response?.data?.message || error.message || 'Failed to create reservation.';
			setErrorMessage(msg);
			setStatus('error');
		}
	};

	const handlePayment = async (method) => {
		if (!reservationId) return;
		setStatus('processing');

		try {
			const paymentData = {
				reservationId: reservationId,
				paymentMethod: method
			};

			const response = await processPayment(paymentData);

			if (method === 'PAYPAL') {
				// response is PayPalOrderResponse
				if (response.approvalLink) {
					window.location.href = response.approvalLink;
				} else {
					throw new Error('No approval link received from PayPal.');
				}
			} else {
				// CASH -> Valid JSON response (PaymentResponse)
				setSuccessMessage('Reservation confirmed! Please pay at the counter.');
				setStatus('success');
			}

		} catch (error) {
			console.error(`Failed to process ${method} payment`, error);
			setErrorMessage(error.message || 'Payment processing failed.');
			setStatus('payment'); // Go back to payment selection on error
			alert('Payment failed: ' + error.message);
		}
	};

	return (
		<Box sx={{ minHeight: '60vh' }}>
			<Box sx={{ maxWidth: 800, mx: 'auto', px: 2, py: 4 }}>
				<Card sx={{ borderRadius: 3, border: '1px solid rgba(13,71,161,0.15)', boxShadow: '0 18px 36px rgba(13,71,161,0.12)' }}>
					<CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>

						{/* HEADER */}
						<Stack spacing={3}>
							<Stack direction="row" alignItems="center" spacing={1.2}>
								<CheckCircleOutline color="success" />
								<Typography variant="h5" fontWeight={800} color="primary.main">
									{status === 'payment' ? 'Select Payment Method' : 'Review & Confirm Booking'}
								</Typography>
							</Stack>

							<Typography color="text.secondary" sx={{ fontWeight: 600 }}>
								{status === 'payment'
									? 'Your reservation is created. Please select a payment method to finalize.'
									: 'Please review your stall selection and company details below.'}
							</Typography>

							<Divider />

							{/* DETAILS SECTION (Always visible for context) */}
							<Stack spacing={2}>
								<Typography variant="h6" fontWeight={700} color="primary.main">Company Details</Typography>
								<Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 1, alignItems: 'center' }}>
									<Typography fontWeight={600}>Name:</Typography> <Typography>{company.companyName || company.businessName}</Typography>
									<Typography fontWeight={600}>Email:</Typography> <Typography>{company.email}</Typography>
									<Typography fontWeight={600}>Phone:</Typography> <Typography>{company.phone || company.contactNumber}</Typography>
								</Box>
							</Stack>

							<Divider />

							<Typography variant="h6" fontWeight={700} color="primary.main">Stall Selection</Typography>
							<Stack spacing={2}>
								{Object.entries(stallsByHall).map(([hallName, stallIds]) => (
									<Box key={hallName} sx={{ border: '1px solid rgba(0,0,0,0.1)', p: 2, borderRadius: 2 }}>
										<Typography variant="subtitle1" fontWeight={700}>{hallName}</Typography>
										<Stack direction="row" gap={1} flexWrap="wrap" mt={1}>
											{stallIds.map(id => (
												<Chip key={id} label={id.split('-').pop()} size="small" color="primary" />
											))}
										</Stack>
									</Box>
								))}
							</Stack>

							{/* ACTIONS */}
							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} pt={2}>
								{status === 'review' && (
									<Button
										variant="contained"
										color="primary"
										onClick={handleCreateReservation}
										fullWidth
										size="large"
										sx={{ textTransform: 'none', fontWeight: 700 }}
									>
										Confirm Reservation
									</Button>
								)}

								{status === 'creating' && (
									<Button disabled fullWidth variant="contained" startIcon={<CircularProgress size={20} />}>
										Creating Reservation...
									</Button>
								)}

								{status === 'payment' && (
									<>
										<Button
											variant="contained"
											color="success"
											onClick={() => handlePayment('CASH')}
											fullWidth
											size="large"
											startIcon={<CashIcon />}
											sx={{ textTransform: 'none', fontWeight: 700 }}
										>
											Pay with Cash
										</Button>
										<Button
											variant="contained"
											onClick={() => handlePayment('PAYPAL')}
											fullWidth
											size="large"
											startIcon={<PaymentIcon />}
											sx={{
												textTransform: 'none',
												fontWeight: 700,
												bgcolor: '#003087', // PayPal Blue
												'&:hover': { bgcolor: '#00256b' }
											}}
										>
											Pay with PayPal
										</Button>
									</>
								)}

								{status === 'processing' && (
									<Button disabled fullWidth variant="contained" startIcon={<CircularProgress size={20} />}>
										Processing Payment...
									</Button>
								)}
							</Stack>

							{status === 'error' && (
								<Alert severity="error">{errorMessage}</Alert>
							)}
						</Stack>
					</CardContent>
				</Card>
			</Box>

			{/* Success Dialog (For Cash) */}
			<Dialog open={status === 'success'} onClose={() => { }}>
				<DialogTitle>Booking Confirmed</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{successMessage}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button component={RouterLink} to="/user/dashboard" autoFocus>
						Go to Dashboard
					</Button>
					<Button component={RouterLink} to="/user/reservations">
						My Reservations
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default BookingConfirmation;
