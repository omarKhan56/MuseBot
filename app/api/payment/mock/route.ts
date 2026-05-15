import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const { bookingId } = body;

    await Booking.findByIdAndUpdate(bookingId, {
      payment_status: 'paid',
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}