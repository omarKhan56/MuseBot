import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticketNumber = searchParams.get('ticketNumber');
    const bookingId = searchParams.get('bookingId');

    if (ticketNumber) {
      // Get specific ticket
      const { data: ticket, error } = await supabase
        .from('tickets')
        .select('*, booking:bookings(*)')
        .eq('ticket_number', ticketNumber)
        .single();

      if (error) throw error;
      return NextResponse.json({ ticket });
    }

    if (bookingId) {
      // Get all tickets for a booking
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*, booking:bookings(*)')
        .eq('booking_id', bookingId);

      if (error) throw error;
      return NextResponse.json({ tickets });
    }

    return NextResponse.json(
      { error: 'Please provide ticketNumber or bookingId' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Tickets fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { ticketNumber, action } = await request.json();

    if (action === 'use') {
      // Mark ticket as used
      const { data, error } = await supabase
        .from('tickets')
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq('ticket_number', ticketNumber)
        .select()
        .single();

      if (error) throw error;

      // Log analytics
      await supabase.from('analytics').insert([
        {
          event_type: 'ticket_used',
          event_data: { ticket_number: ticketNumber },
        },
      ]);

      return NextResponse.json({ success: true, ticket: data });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Ticket update error:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}