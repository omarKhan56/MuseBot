'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Users, TrendingUp, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    todayBookings: 0,
    popularTicket: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

const fetchAnalytics = async () => {
  try {
    // Get all bookings
    const { data: allBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*');

    if (bookingsError) throw bookingsError;

    // Show ALL bookings (including pending)
    const totalBookings = allBookings?.length || 0;

    // Calculate total revenue (all bookings)
    const totalRevenue = allBookings?.reduce(
      (sum, booking) => sum + parseFloat(booking.total_amount || 0),
      0
    ) || 0;

    // Calculate today's bookings
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = allBookings?.filter(
      (b) => b.created_at.startsWith(today)
    ).length || 0;

    // Find popular ticket type
    const ticketCounts: { [key: string]: number } = {};
    allBookings?.forEach((booking) => {
      const type = booking.ticket_type;
      ticketCounts[type] = (ticketCounts[type] || 0) + 1;
    });

    const popularTicket =
      Object.entries(ticketCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'N/A';

    setAnalytics({
      totalBookings,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      todayBookings,
      popularTicket,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {analytics.totalBookings}
            </p>
            <p className="text-xs text-gray-500 mt-1">Completed payments</p>
          </div>
          <Users className="w-12 h-12 text-blue-500 opacity-80" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              ₹{analytics.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">All time earnings</p>
          </div>
          <DollarSign className="w-12 h-12 text-green-500 opacity-80" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Today's Bookings</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {analytics.todayBookings}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <TrendingUp className="w-12 h-12 text-purple-500 opacity-80" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Popular Ticket</p>
            <p className="text-lg font-bold text-gray-800 mt-2 leading-tight">
              {analytics.popularTicket}
            </p>
            <p className="text-xs text-gray-500 mt-1">Most booked</p>
          </div>
          <BarChart3 className="w-12 h-12 text-orange-500 opacity-80" />
        </div>
      </div>
    </div>
  );
}