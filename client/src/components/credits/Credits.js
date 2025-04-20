import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Credits.css';

const CREDIT_PACKAGES = {
  basic: { name: 'Basic Package', amount: 499, credits: 5 },
  standard: { name: 'Standard Package', amount: 999, credits: 12 },
  premium: { name: 'Premium Package', amount: 1999, credits: 30 },
};

const Credits = () => {
  const { credits, fetchCredits } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const API_URL = "https://vcall-2vlg.onrender.com"

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const handlePayment = async (packageType) => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      const package_details = CREDIT_PACKAGES[packageType];

      const orderResponse = await axios.post(API_URL + '/api/payments/order',
        { packageType },
        { withCredentials: true }
      );

      const { amount, id: order_id, currency } = orderResponse.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_QFiPjXZxurW3hs',
        amount: amount,
        currency: currency,
        name: 'VCall Video Conferencing',
        description: `Purchase ${package_details.name}`,
        order_id: order_id,
        handler: async function (response) {
          try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

            const verifyResponse = await axios.post(API_URL + '/api/payments/verify', {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
              packageType
            }, { withCredentials: true });

            if (verifyResponse.data.success) {
              setSuccessMessage(`Payment successful! Added ${package_details.credits} credits to your account.`);
              await fetchCredits();
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', err);
          }
        },
        prefill: {
          name: 'User',
          email: '',
          contact: ''
        },
        theme: {
          color: '#3399cc'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      setError('Failed to initiate payment. Please try again later.');
      console.error('Payment initiation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="credits-container">
      <div className="credits-header">
        <h2>Your Credits</h2>
        <div className="credits-balance">
          <span className="credits-count">{credits}</span>
          <span className="credits-label">Credits Available</span>
        </div>
      </div>

      {error && <div className="credits-error">{error}</div>}
      {successMessage && <div className="credits-success">{successMessage}</div>}

      <div className="credits-packages">
        <h3>Purchase Credits</h3>
        <div className="packages-grid">
          {Object.entries(CREDIT_PACKAGES).map(([key, package_info]) => (
            <div className="package-card" key={key}>
              <h4>{package_info.name}</h4>
              <div className="package-credits">{package_info.credits} Credits</div>
              <div className="package-price">₹{package_info.amount}</div>
              <button
                className="purchase-btn"
                onClick={() => handlePayment(key)}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Purchase'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="credits-info">
        <h3>About Credits</h3>
        <p>Each credit allows you to create one meeting. Credits are deducted when you start a new meeting.</p>
        <p>New users receive 5 credits for free.</p>
      </div>
    </div>
  );
};

export default Credits;