import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const reservationId = searchParams.get('reservationId');
    const [status, setStatus] = useState('Processing Payment...');

    useEffect(() => {
        if (token && reservationId) {
            confirmPayment(token, reservationId);
        } else {
            setStatus('Invalid parameters. Payment failed.');
        }
    }, [token, reservationId]);

    const confirmPayment = async (token, reservationId) => {
        try {
            const response = await axios.post('http://localhost:8080/api/payments/confirm', {
                referenceId: token,
                paymentMethod: 'PAYPAL',
                reservationId: reservationId
            });

            if (response.data.paymentStatus === 'SUCCESS') {
                setStatus('Payment Successful! Redirecting...');
                setTimeout(() => {
                    navigate('/user/reservations');
                }, 3000);
            } else {
                setStatus('Payment Failed. Please try again.');
            }
        } catch (error) {
            console.error('Error confirming payment:', error);
            setStatus('Error confirming payment. Please contact support.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>{status}</h2>
        </div>
    );
};

export default PaymentSuccess;
