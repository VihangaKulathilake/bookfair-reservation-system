import { useMemo, useState } from 'react';
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
	TextField,
	Typography,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import NavBar from '../../components/layout/NavBar';

const BOOKING_HISTORY_STORAGE_KEY = 'bookfair_booking_history_v1';
const COMPANY_CONFIRM_STORAGE_KEY = 'bookfair_company_confirmations_v1';

const BookingConfirmation = () => {
	const { state } = useLocation();
	const [companyForm, setCompanyForm] = useState({
		companyName: '',
		registrationNo: '',
		email: '',
		phone: '',
	});
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);
	const [formError, setFormError] = useState('');

	const bookingHistory = useMemo(() => {
		const fromState = state?.bookingId
			? [{
				bookingId: state.bookingId,
				hallName: state.hallName || 'Hall -',
				stalls: state.stalls || [],
				confirmedAt: state.confirmedAt || new Date().toISOString(),
			}]
			: [];

		try {
			const historyRaw = localStorage.getItem(BOOKING_HISTORY_STORAGE_KEY);
			const parsed = historyRaw ? JSON.parse(historyRaw) : [];
			if (!Array.isArray(parsed)) return fromState;

			const byId = new Map();
			[...fromState, ...parsed].forEach((item) => {
				if (item?.bookingId) {
					byId.set(item.bookingId, item);
				}
			});
			return Array.from(byId.values());
		} catch {
			return fromState;
		}
	}, [state]);

	const bookedHalls = useMemo(
		() => Array.from(new Set(bookingHistory.map((item) => item.hallName).filter(Boolean))),
		[bookingHistory]
	);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setCompanyForm((previous) => ({
			...previous,
			[name]: value,
		}));
	};

	const handleConfirmAndBook = () => {
		if (!bookingHistory.length) {
			setFormError('No booked halls/stalls found. Please book stalls first from Stall Reservation page.');
			return;
		}

		const allFilled = Object.values(companyForm).every((value) => value.trim().length > 0);
		if (!allFilled) {
			setFormError('Please fill all company details before confirmation.');
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyForm.email)) {
			setFormError('Please enter a valid company email address.');
			return;
		}

		const confirmationRecord = {
			confirmationId: `CONF-${Date.now().toString().slice(-6)}`,
			...companyForm,
			bookings: bookingHistory,
			createdAt: new Date().toISOString(),
		};

		try {
			const existingRaw = localStorage.getItem(COMPANY_CONFIRM_STORAGE_KEY);
			const existing = existingRaw ? JSON.parse(existingRaw) : [];
			const next = [confirmationRecord, ...(Array.isArray(existing) ? existing : [])];
			localStorage.setItem(COMPANY_CONFIRM_STORAGE_KEY, JSON.stringify(next));
		} catch (error) {
			console.error('Failed to persist company confirmation', error);
		}

		setFormError('');
		setShowSuccessDialog(true);
	};

	return (
		<Box sx={{ minHeight: '100vh', background: '#f4f7fc' }}>
			<NavBar role="user" />
			<Box sx={{ maxWidth: 920, mx: 'auto', px: 2, py: 4 }}>
				<Card sx={{ borderRadius: 3, border: '1px solid rgba(13,71,161,0.15)', boxShadow: '0 18px 36px rgba(13,71,161,0.12)' }}>
					<CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
						<Stack spacing={2}>
							<Stack direction="row" alignItems="center" spacing={1.2}>
								<CheckCircleOutline color="success" />
								<Typography variant="h5" fontWeight={800} color="primary.main">
									Booking Confirmation
								</Typography>
							</Stack>

							<Typography color="text.secondary" sx={{ fontWeight: 600 }}>
								Fill company details, verify booked halls/stalls, then click <strong>Confirm and Book</strong>.
							</Typography>

							<Divider />

							{formError && <Alert severity="error">{formError}</Alert>}

							<Stack spacing={1.2}>
								<Typography variant="h6" fontWeight={700} color="primary.main">Company Details</Typography>
								<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
									<TextField
										label="Company Name"
										name="companyName"
										fullWidth
										value={companyForm.companyName}
										onChange={handleInputChange}
									/>
									<TextField
										label="Business Registration No"
										name="registrationNo"
										fullWidth
										value={companyForm.registrationNo}
										onChange={handleInputChange}
									/>
								</Stack>
								<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
									<TextField
										label="Company Email"
										name="email"
										type="email"
										fullWidth
										value={companyForm.email}
										onChange={handleInputChange}
									/>
									<TextField
										label="Phone Number"
										name="phone"
										fullWidth
										value={companyForm.phone}
										onChange={handleInputChange}
									/>
								</Stack>
							</Stack>

							<Divider />

							<Typography variant="h6" fontWeight={700} color="primary.main">Booked Halls</Typography>
							<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
								{bookedHalls.length ? (
									bookedHalls.map((hallName) => (
										<Chip key={hallName} label={hallName} color="primary" variant="outlined" />
									))
								) : (
									<Chip label="No booked halls yet" variant="outlined" />
								)}
							</Stack>

							<Stack spacing={1.1}>
								{bookingHistory.length ? bookingHistory.map((item) => (
									<Box
										key={item.bookingId}
										sx={{ border: '1px solid rgba(13,71,161,0.14)', borderRadius: 2, px: 1.5, py: 1 }}
									>
										<Typography><strong>Booking ID:</strong> {item.bookingId}</Typography>
										<Typography><strong>Hall:</strong> {item.hallName}</Typography>
										<Typography><strong>Stalls:</strong> {(item.stalls || []).join(', ') || 'None'}</Typography>
										<Typography><strong>Booked At:</strong> {new Date(item.confirmedAt).toLocaleString()}</Typography>
									</Box>
								)) : (
									<Typography color="text.secondary">No booking records found yet.</Typography>
								)}
							</Stack>

							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
								<Button
									variant="contained"
									color="secondary"
									onClick={handleConfirmAndBook}
									sx={{ textTransform: 'none', fontWeight: 700 }}
								>
									Confirm and Book
								</Button>
								<Button component={RouterLink} to="/stall-reservation" variant="contained" color="primary" sx={{ textTransform: 'none', fontWeight: 700 }}>
									Back to Stall Reservation
								</Button>
							</Stack>
						</Stack>
					</CardContent>
				</Card>
			</Box>

			<Dialog open={showSuccessDialog} onClose={() => setShowSuccessDialog(false)}>
				<DialogTitle>Booking Successful</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Your booking has been confirmed successfully. We have saved your company details and booked hall information.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowSuccessDialog(false)} autoFocus>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default BookingConfirmation;
