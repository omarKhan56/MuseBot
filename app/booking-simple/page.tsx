//app/booking-simple/page.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const TICKET_PRICES: { [key: string]: number } = {
  'General Admission (Adult)': 200,
  'General Admission (Child)': 100,
  'Student (with ID)':         150,
  'Senior Citizen':            100,
  'VIP Tour':                  500,
  'Group (10+ people)':        150,
};

export default function BookingSimplePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    visitor_name: '',
    email:        '',
    phone:        '',
    visit_date:   '',
    ticket_type:  'General Admission (Adult)',
    quantity:     1,
  });

  const totalAmount =
    (TICKET_PRICES[bookingData.ticket_type] || 200) * bookingData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          total_amount:   totalAmount,
          payment_status: 'pending',
          language:       'en',
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/booking/${data.booking.id}`);
      } else {
        alert('Booking failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="container mx-auto max-w-xl">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quick Book</h1>
          <p className="text-gray-600">Fill in your details to book tickets instantly</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={bookingData.visitor_name}
                onChange={(e) => setBookingData({ ...bookingData, visitor_name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={bookingData.email}
                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={bookingData.phone}
                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
              />
            </div>

            {/* Visit Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Visit Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={bookingData.visit_date}
                onChange={(e) => setBookingData({ ...bookingData, visit_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
              />
            </div>

            {/* Ticket Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ticket Type <span className="text-red-500">*</span>
              </label>
              <select
                value={bookingData.ticket_type}
                onChange={(e) => setBookingData({ ...bookingData, ticket_type: e.target.value })}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
              >
                <option value="General Admission (Adult)">General Admission (Adult) — ₹200</option>
                <option value="General Admission (Child)">General Admission (Child) — ₹100</option>
                <option value="Student (with ID)">Student (with ID) — ₹150</option>
                <option value="Senior Citizen">Senior Citizen — ₹100</option>
                <option value="VIP Tour">VIP Tour — ₹500</option>
                <option value="Group (10+ people)">Group (10+ people) — ₹150/person</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Tickets <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={bookingData.quantity}
                onChange={(e) =>
                  setBookingData({ ...bookingData, quantity: parseInt(e.target.value) || 1 })
                }
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
              />
            </div>

            {/* Total */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">Total Amount:</span>
                <span className="text-3xl font-bold text-primary-600">₹{totalAmount}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-6 py-4 rounded-2xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg hover:scale-105 hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                '🎟️ Proceed to Payment'
              )}
            </button>
          </form>

          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> Prefer chatting? Use our{' '}
              <Link href="/chat" className="text-primary-600 hover:underline font-medium">
                AI Assistant
              </Link>{' '}
              instead — it books automatically!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}