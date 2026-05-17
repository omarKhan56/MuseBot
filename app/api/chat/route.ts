// app/api/chat/route.ts

// This is a backend API route in Next.js that handles chat interactions with a Groq-based chatbot. 
import { NextRequest, NextResponse } from 'next/server';
import { chatWithGroq } from '@/lib/groq';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import Ticket from '@/lib/models/Ticket';
import Analytics from '@/lib/models/Analytics';
import QRCode from 'qrcode';
import { sendTicketEmail } from '@/lib/email';

const TICKET_PRICES: { [key: string]: number } = {
  'General Admission (Adult)': 200,
  'General Admission (Child)': 100,
  'Student (with ID)':         150,
  'Senior Citizen':            100,
  'VIP Tour':                  500,
  'Group (10+ people)':        150,
};

function extractBookingData(text: string) {
  try {
    // Find BOOKING_DATA: and grab everything from the first { to the last }
    const start = text.indexOf('BOOKING_DATA:');
    if (start === -1) return null;

    const jsonStart = text.indexOf('{', start);
    const jsonEnd   = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) return null;

    const jsonStr = text.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Failed to extract booking data:', err);
    return null;
  }
}

function stripBookingData(text: string) {
  const start = text.indexOf('BOOKING_DATA:');
  if (start === -1) return text;
  return text.substring(0, start).trim();
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();
    const conversationHistory  = history.slice(1);

    const rawResponse = await chatWithGroq(message, conversationHistory);
    console.log('Raw AI response:', rawResponse);

    const hasBookingData = rawResponse.includes('BOOKING_DATA:');

    if (hasBookingData) {
      const displayMessage = stripBookingData(rawResponse);
      const bookingInfo    = extractBookingData(rawResponse);

      if (!bookingInfo) {
        console.error('Could not parse booking data from response');
        return NextResponse.json({ response: displayMessage });
      }

      console.log('Parsed booking info:', bookingInfo);

      // Validate required fields
      const required = ['visitor_name', 'email', 'phone', 'visit_date', 'ticket_type', 'quantity'];
      const missing  = required.filter((f) => !bookingInfo[f]);
      if (missing.length > 0) {
        console.error('Missing fields:', missing);
        return NextResponse.json({ response: displayMessage });
      }

      const total_amount =
        (TICKET_PRICES[bookingInfo.ticket_type] || 200) * Number(bookingInfo.quantity);

      await connectDB();

      // Create booking
      const booking = await Booking.create({
        visitor_name:   bookingInfo.visitor_name,
        email:          bookingInfo.email,
        phone:          String(bookingInfo.phone),
        visit_date:     bookingInfo.visit_date,
        ticket_type:    bookingInfo.ticket_type,
        quantity:       Number(bookingInfo.quantity),
        total_amount,
        payment_status: 'pending',
        language:       'en',
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

        let qrCodeDataUrl = 'QR_CODE_ERROR';
        try {
          qrCodeDataUrl = await QRCode.toDataURL(qrData);
        } catch (err) {
          console.error('QR error:', err);
        }

        try {
          const ticket = await Ticket.create({
            booking_id:    booking._id.toString(),
            ticket_number: ticketNumber,
            qr_code:       qrCodeDataUrl,
          });
          tickets.push({ ...ticket.toObject(), id: ticket._id.toString() });
        } catch (err) {
          console.error('Ticket creation error:', err);
        }
      }

      // Send email (non-blocking)
      if (tickets.length > 0) {
        sendTicketEmail(booking.email, booking, tickets[0].qr_code).catch((err) =>
          console.error('Email error:', err)
        );
      }

      // Log analytics (non-blocking)
      Analytics.create({
        event_type: 'booking_created',
        event_data: {
          booking_id:  booking._id.toString(),
          ticket_type: booking.ticket_type,
        },
      }).catch((err) => console.error('Analytics error:', err));

      return NextResponse.json({
        response:  displayMessage,
        bookingId: booking._id.toString(),
      });
    }

    // Normal chat — still collecting info
    return NextResponse.json({ response: rawResponse });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat message' },
      { status: 500 }
    );
  }
}