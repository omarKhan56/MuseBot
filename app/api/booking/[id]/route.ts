import { NextResponse } from 'next/server';

import dbConnect from '@/lib/mongodb';

import Booking from '@/lib/models/Booking';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const booking = await Booking.findById(
      params.id
    );

    if (!booking) {
      return NextResponse.json({
        success: false,
        message: 'Booking not found',
      });
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error(error);

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