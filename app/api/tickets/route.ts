//app/api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ticket from '@/lib/models/Ticket';
import Booking from '@/lib/models/Booking';
import Analytics from '@/lib/models/Analytics';
 
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const ticketNumber = searchParams.get('ticketNumber');
    const bookingId    = searchParams.get('bookingId');
 
    if (ticketNumber) {
      // Get specific ticket by ticket number
      const ticket = await Ticket.findOne({ ticket_number: ticketNumber }).lean() as any;
      if (!ticket) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      }
 
      const booking = await Booking.findById(ticket.booking_id).lean() as any;
 
      return NextResponse.json({
        ticket: {
          ...ticket,
          id: ticket._id.toString(),
          _id: undefined,
          booking: booking
            ? { ...booking, id: booking._id.toString(), _id: undefined }
            : null,
        },
      });
    }
 
    if (bookingId) {
      // Get all tickets for a booking
      const tickets = await Ticket.find({ booking_id: bookingId }).lean();
      const booking = await Booking.findById(bookingId).lean() as any;
 
      return NextResponse.json({
        tickets: tickets.map((t: any) => ({
          ...t,
          id: t._id.toString(),
          _id: undefined,
          booking: booking
            ? { ...booking, id: booking._id.toString(), _id: undefined }
            : null,
        })),
      });
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
    await connectDB();
    const { ticketNumber, action } = await request.json();
 
    if (action === 'use') {
      // Mark ticket as used
      const ticket = await Ticket.findOneAndUpdate(
        { ticket_number: ticketNumber },
        { is_used: true, used_at: new Date() },
        { new: true }
      ).lean() as any;
 
      if (!ticket) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      }
 
      // Log analytics
      await Analytics.create({
        event_type: 'ticket_used',
        event_data: { ticket_number: ticketNumber },
      });
 
      return NextResponse.json({
        success: true,
        ticket: {
          ...ticket,
          id: ticket._id.toString(),
          _id: undefined,
        },
      });
    }
 
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Ticket update error:', error);
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
 