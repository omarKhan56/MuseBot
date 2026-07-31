//app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
 
export async function GET(request: NextRequest) {
  try {
    await connectDB();
 
    const bookings = await Booking.find()
      .sort({ created_at: -1 })
      .limit(20)
      .lean();
 
    const formattedBookings = bookings.map((booking: any) => ({
      ...booking,
      id: booking._id.toString(),
      _id: undefined,
    }));
 
    return NextResponse.json({ bookings: formattedBookings });
  } catch (error) {
    console.error('Admin bookings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
 