import { NextRequest, NextResponse } from 'next/server';
import { chatWithGroq } from '@/lib/groq';

function extractBookingData(message: string) {
  const lower = message.toLowerCase();

  const quantityMatch = message.match(/\d+/);
  const quantity = quantityMatch ? parseInt(quantityMatch[0]) : 1;

  let ticket_type = 'General Admission (Adult)';
  if (lower.includes('child')) ticket_type = 'General Admission (Child)';
  if (lower.includes('student')) ticket_type = 'Student (with ID)';
  if (lower.includes('senior')) ticket_type = 'Senior Citizen';
  if (lower.includes('vip')) ticket_type = 'VIP Tour';

  let visit_date = new Date();
  if (lower.includes('tomorrow')) {
    visit_date.setDate(visit_date.getDate() + 1);
  }

  return {
    ticket_type,
    quantity,
    visit_date: visit_date.toISOString().split('T')[0],
  };
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    const conversationHistory = history.slice(1);
    const response = await chatWithGroq(message, conversationHistory);

    const bookingIntent =
      message.toLowerCase().includes('book') ||
      message.toLowerCase().includes('ticket') ||
      message.toLowerCase().includes('buy');

    let extractedData = null;
    if (bookingIntent) {
      extractedData = extractBookingData(message);
    }

    return NextResponse.json({
      response,
      bookingIntent,
      extractedData,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
