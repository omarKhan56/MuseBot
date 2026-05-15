//components/PaymentButton.tsx
'use client';

import { useState } from 'react';

interface PaymentButtonProps {
  amount: number;
  bookingId: string;
  onSuccess: () => void;
  onError: () => void;
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

      // Fake processing delay
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      const response = await fetch(
        '/api/payment/mock',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        onError();
      }
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
      {loading
        ? 'Processing Payment...'
        : `Pay ₹${amount}`}
    </button>
  );
}