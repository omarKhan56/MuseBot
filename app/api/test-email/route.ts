import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'omaralikhan5616@gmail.com', // ← PUT YOUR REAL EMAIL HERE
      subject: 'Test Email from MuseBot',
      html: '<h1>Email is working! ✅</h1><p>Resend is configured correctly.</p>',
    });

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent! Check your inbox.',
      data 
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}