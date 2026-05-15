import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';

import Booking from '@/lib/models/Booking';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Total paid bookings
    const totalBookings =
      await Booking.countDocuments({
        payment_status: 'paid',
      });

    // Total revenue
    const revenueResult =
      await Booking.aggregate([
        {
          $match: {
            payment_status: 'paid',
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: '$total_amount',
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]?.total || 0;

    // Today's bookings
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayBookings =
      await Booking.countDocuments({
        payment_status: 'paid',
        createdAt: {
          $gte: today,
        },
      });

    // Most popular ticket
    const ticketTypeResult =
      await Booking.aggregate([
        {
          $match: {
            payment_status: 'paid',
          },
        },
        {
          $group: {
            _id: '$ticket_type',
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $limit: 1,
        },
      ]);

    const popularTicket =
      ticketTypeResult[0]?._id || 'N/A';

    return NextResponse.json({
      totalBookings,
      totalRevenue,
      todayBookings,
      popularTicket,
    });
  } catch (error) {
    console.error(
      'Analytics API error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Failed to fetch analytics',
      },
      {
        status: 500,
      }
    );
  }
}