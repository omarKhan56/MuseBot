import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import QRCode from 'qrcode';
import { sendTicketEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    console.log('Received booking data:', bookingData);

    // Validate required fields
    if (!bookingData.visitor_name || !bookingData.email || !bookingData.phone || 
        !bookingData.visit_date || !bookingData.ticket_type || !bookingData.quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          visitor_name: bookingData.visitor_name,
          email: bookingData.email,
          phone: bookingData.phone,
          visit_date: bookingData.visit_date,
          ticket_type: bookingData.ticket_type,
          quantity: bookingData.quantity,
          total_amount: bookingData.total_amount,
          payment_status: bookingData.payment_status || 'pending',
          language: bookingData.language || 'en',
        }
      ])
      .select()
      .single();

    if (bookingError) {
      console.error('Supabase booking error:', bookingError);
      return NextResponse.json(
        { success: false, error: bookingError.message },
        { status: 500 }
      );
    }

    console.log('Booking created:', booking);

    // Generate tickets with QR codes
    const tickets = [];
    for (let i = 0; i < booking.quantity; i++) {
      const ticketNumber = `TICKET-${booking.id}-${i + 1}`;
      const qrData = JSON.stringify({
        ticketNumber,
        bookingId: booking.id,
        visitorName: booking.visitor_name,
        visitDate: booking.visit_date,
      });

      let qrCodeDataUrl;
      try {
        qrCodeDataUrl = await QRCode.toDataURL(qrData);
      } catch (qrError) {
        console.error('QR code generation error:', qrError);
        qrCodeDataUrl = 'QR_CODE_ERROR'; // Fallback
      }

      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert([
          {
            booking_id: booking.id,
            ticket_number: ticketNumber,
            qr_code: qrCodeDataUrl,
          },
        ])
        .select()
        .single();

      if (ticketError) {
        console.error('Ticket creation error:', ticketError);
      } else {
        tickets.push(ticket);
      }
    }

    console.log('Tickets created:', tickets.length);

    // Send email (optional - don't fail if email fails)
    if (tickets.length > 0) {
      try {
        await sendTicketEmail(booking.email, booking, tickets[0].qr_code);
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Don't fail the whole booking if email fails
      }
    }

    // Log analytics
    try {
      await supabase.from('analytics').insert([
        {
          event_type: 'booking_created',
          event_data: { booking_id: booking.id, ticket_type: booking.ticket_type },
        },
      ]);
    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError);
      // Don't fail if analytics fails
    }

    return NextResponse.json({ 
      success: true, 
      booking, 
      tickets 
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
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, tickets(*)')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error('Booking fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}