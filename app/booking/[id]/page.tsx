//app/booking/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import PaymentButton from '@/components/PaymentButton';

export default function BookingPage() {
  const params = useParams();

  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchBooking();
    }
  }, [params]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(
        `/api/booking/${params.id}`
      );

      const data = await response.json();

      console.log(data);

      if (data.success) {
        setBooking(data.booking);
      }
    } catch (error) {
      console.error('Booking fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
        <h1 className="text-3xl font-bold text-white">
          Loading Booking...
        </h1>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 to-pink-500">
        <h1 className="text-3xl font-bold text-white">
          Booking Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-2">
          Booking Successful 🎉
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Your museum ticket has been booked successfully.
        </p>

        <div className="space-y-5">
          <div>
            <p className="text-gray-500 text-sm">
              Visitor Name
            </p>

            <p className="text-xl font-semibold">
              {booking.visitor_name}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Email
            </p>

            <p className="text-xl font-semibold">
              {booking.email}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Phone
            </p>

            <p className="text-xl font-semibold">
              {booking.phone}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Visit Date
            </p>

            <p className="text-xl font-semibold">
              {booking.visit_date}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Ticket Type
            </p>

            <p className="text-xl font-semibold">
              {booking.ticket_type}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Quantity
            </p>

            <p className="text-xl font-semibold">
              {booking.quantity}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-5 text-white">
            <p className="text-sm opacity-80">
              Total Amount
            </p>

            <p className="text-4xl font-bold">
              ₹{booking.total_amount}
            </p>
          </div>

          <div className="pt-4">
            <PaymentButton
              amount={booking.total_amount}
              bookingId={booking._id}
              onSuccess={() => {
                alert('Payment Successful');

                router.push(
                  `/ticket/${booking._id}`
                );
              }}
              onError={() => {
                alert('Payment Failed');
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}