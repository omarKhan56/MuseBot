'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import PaymentButton from '@/components/PaymentButton';
import Link from 'next/link';
import { CheckCircle, Calendar, Mail, Phone, User, ArrowLeft } from 'lucide-react';

export default function BookingPage() {
  const params = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // In a real app, fetch booking details from your backend
    // For now, we'll use mock data
    const mockBooking = {
      id: params.id,
      visitor_name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      visit_date: '2024-02-15',
      ticket_type: 'General Admission (Adult)',
      quantity: 2,
      total_amount: 400,
      payment_status: 'pending',
    };
    setBooking(mockBooking);
    setLoading(false);
  }, [params.id]);

  const handlePaymentSuccess = (paymentData: any) => {
    setPaymentSuccess(true);
    // Update booking with payment details
    setBooking({ ...booking, payment_status: 'completed' });
  };

  const handlePaymentError = (error: any) => {
    alert('Payment failed. Please try again.');
    console.error('Payment error:', error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-800">Booking not found</p>
          <Link href="/" className="text-primary-600 hover:underline mt-4 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        {paymentSuccess ? (
          // Success View
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-6">
              Your tickets have been sent to {booking.email}
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{booking.visitor_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{booking.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{booking.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">{booking.visit_date}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code at the museum entrance
              </p>
              <QRCodeGenerator
                value={JSON.stringify({
                  bookingId: booking.id,
                  name: booking.visitor_name,
                  date: booking.visit_date,
                })}
                size={250}
              />
            </div>

            <Link
              href="/"
              className="mt-8 inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          // Payment View
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Complete Your Booking
            </h1>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h2 className="font-semibold text-blue-800 mb-2">Booking Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Name:</span>
                  <span className="font-medium">{booking.visitor_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Email:</span>
                  <span className="font-medium">{booking.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Phone:</span>
                  <span className="font-medium">{booking.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Visit Date:</span>
                  <span className="font-medium">{booking.visit_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Ticket Type:</span>
                  <span className="font-medium">{booking.ticket_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Quantity:</span>
                  <span className="font-medium">{booking.quantity}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-blue-200">
                  <span className="text-gray-800">Total Amount:</span>
                  <span className="text-primary-600">₹{booking.total_amount}</span>
                </div>
              </div>
            </div>

            <PaymentButton
              amount={booking.total_amount}
              bookingId={booking.id}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />

            <p className="text-xs text-gray-500 text-center mt-4">
              By proceeding, you agree to our terms and conditions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}