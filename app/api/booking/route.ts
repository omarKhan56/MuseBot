//app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import Ticket from '@/lib/models/Ticket';
import Analytics from '@/lib/models/Analytics';
import QRCode from 'qrcode';
import { sendTicketEmail } from '@/lib/email';
 
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const bookingData = await request.json();
    console.log('Received booking data:', bookingData);
 
    // Validate required fields
    if (
      !bookingData.visitor_name ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.visit_date ||
      !bookingData.ticket_type ||
      !bookingData.quantity
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
 
    // Create booking in MongoDB
    const booking = await Booking.create({
      visitor_name:   bookingData.visitor_name,
      email:          bookingData.email,
      phone:          bookingData.phone,
      visit_date:     bookingData.visit_date,
      ticket_type:    bookingData.ticket_type,
      quantity:       bookingData.quantity,
      total_amount:   bookingData.total_amount,
      payment_status: bookingData.payment_status || 'pending',
      language:       bookingData.language || 'en',
    });
 
    console.log('Booking created:', booking._id.toString());
 
    // Generate tickets with QR codes
    const tickets: any[] = [];
    for (let i = 0; i < booking.quantity; i++) {
      const ticketNumber = `TICKET-${booking._id.toString()}-${i + 1}`;
      const qrData = JSON.stringify({
        ticketNumber,
        bookingId:   booking._id.toString(),
        visitorName: booking.visitor_name,
        visitDate:   booking.visit_date,
      });
 
      let qrCodeDataUrl: string;
      try {
        qrCodeDataUrl = await QRCode.toDataURL(qrData);
      } catch (qrError) {
        console.error('QR code generation error:', qrError);
        qrCodeDataUrl = 'QR_CODE_ERROR';
      }
 
      try {
        const ticket = await Ticket.create({
          booking_id:    booking._id.toString(),
          ticket_number: ticketNumber,
          qr_code:       qrCodeDataUrl,
        });
        tickets.push({
          ...ticket.toObject(),
          id: ticket._id.toString(),
        });
      } catch (ticketError) {
        console.error('Ticket creation error:', ticketError);
      }
    }
 
    console.log('Tickets created:', tickets.length);
 
    // Send email (don't fail the whole booking if email fails)
    if (tickets.length > 0) {
      try {
        await sendTicketEmail(booking.email, booking, tickets[0].qr_code);
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }
 
    // Log analytics (don't fail if analytics fails)
    try {
      await Analytics.create({
        event_type: 'booking_created',
        event_data: {
          booking_id:  booking._id.toString(),
          ticket_type: booking.ticket_type,
        },
      });
    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError);
    }
 
    const bookingObj = {
      ...booking.toObject(),
      id: booking._id.toString(),
    };
 
    return NextResponse.json({
      success: true,
      booking: bookingObj,
      tickets,
    });
  } catch (error: any) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}
 
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
 
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
 
    const bookings = await Booking.find({ email })
      .sort({ created_at: -1 })
      .lean();
 
    // Populate tickets for each booking
    const bookingsWithTickets = await Promise.all(
      bookings.map(async (booking: any) => {
        const Ticket = (await import('@/lib/models/Ticket')).default;
        const tickets = await Ticket.find({
          booking_id: booking._id.toString(),
        }).lean();
 
        return {
          ...booking,
          id: booking._id.toString(),
          _id: undefined,
          tickets: tickets.map((t: any) => ({
            ...t,
            id: t._id.toString(),
            _id: undefined,
          })),
        };
      })
    );
 
    return NextResponse.json({ bookings: bookingsWithTickets });
  } catch (error: any) {
    console.error('Booking fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
 