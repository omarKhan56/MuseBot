//app/api/payment/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '../../../../lib/razorpay';



// This is a backend API route in Next.js that creates a Razorpay payment order for a booking. 
export async function POST(request: NextRequest) {
  try {
    const { amount, bookingId } = await request.json();

    const order = await createRazorpayOrder(amount, bookingId);

    return NextResponse.json(order);
  } catch (error) {
    console.error('Payment create error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}