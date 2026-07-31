'use client';
import { useState } from 'react';

interface PaymentButtonProps {
  amount: number;
  bookingId: string;
  onSuccess: () => void;
  onError: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentButton({
  amount,
  bookingId,
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load Razorpay SDK. Check your internet connection.');
        onError();
        return;
      }

      // 1. Create order on the server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert('Could not create payment order: ' + orderData.error);
        onError();
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MuseBot',
        description: 'Museum Ticket Booking',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify payment signature on the server
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            onSuccess();
          } else {
            onError();
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        theme: {
          color: '#7c3aed',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        onError();
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      onError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 font-bold text-lg"
    >
      {loading ? 'Opening Razorpay...' : `Pay ₹${amount}`}
    </button>
  );
}