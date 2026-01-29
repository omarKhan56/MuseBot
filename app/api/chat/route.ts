import { NextRequest, NextResponse } from 'next/server';
import { chatWithGroq } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    const conversationHistory = history.slice(1);

    // Just use the simple chat function
    const response = await chatWithGroq(message, conversationHistory);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}