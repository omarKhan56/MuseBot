//app/api/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = await request.json();

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Update booking
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'completed',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq('id', bookingId);

    if (error) throw error;

    // Log analytics
    await supabase.from('analytics').insert([
      {
        event_type: 'payment_completed',
        event_data: { booking_id: bookingId, payment_id: razorpay_payment_id },
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}