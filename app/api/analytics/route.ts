//app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Total bookings
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'completed');

    // Total revenue
    const { data: revenueData } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('payment_status', 'completed');

    const totalRevenue = revenueData?.reduce(
      (sum, booking) => sum + parseFloat(booking.total_amount),
      0
    ) || 0;

    // Today's bookings
    const today = new Date().toISOString().split('T')[0];
    const { count: todayBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'completed')
      .gte('created_at', today);

    // Popular ticket type
    const { data: ticketTypes } = await supabase
      .from('bookings')
      .select('ticket_type')
      .eq('payment_status', 'completed');

    const ticketCounts: { [key: string]: number } = {};
    ticketTypes?.forEach((booking) => {
      ticketCounts[booking.ticket_type] =
        (ticketCounts[booking.ticket_type] || 0) + 1;
    });

    const popularTicket = Object.entries(ticketCounts).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0];

    return NextResponse.json({
      totalBookings: totalBookings || 0,
      totalRevenue: totalRevenue.toFixed(2),
      todayBookings: todayBookings || 0,
      popularTicket: popularTicket || 'N/A',
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}