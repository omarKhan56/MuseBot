import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendTicketEmail(
  toEmail: string,
  bookingDetails: any,
  qrCodeDataUrl: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: toEmail,
      subject: 'Your Museum Ticket - Booking Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0284c7;">Booking Confirmed!</h1>
          <p>Dear ${bookingDetails.visitor_name},</p>
          <p>Thank you for booking tickets with us. Here are your booking details:</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #0369a1; margin-top: 0;">Booking Details</h2>
            <p><strong>Booking ID:</strong> ${bookingDetails.id}</p>
            <p><strong>Visit Date:</strong> ${bookingDetails.visit_date}</p>
            <p><strong>Ticket Type:</strong> ${bookingDetails.ticket_type}</p>
            <p><strong>Quantity:</strong> ${bookingDetails.quantity}</p>
            <p><strong>Total Amount:</strong> ₹${bookingDetails.total_amount}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <img src="${qrCodeDataUrl}" alt="QR Code" style="max-width: 200px;" />
            <p style="color: #64748b; font-size: 14px;">Show this QR code at the museum entrance</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0;"><strong>Important:</strong></p>
            <ul style="margin: 10px 0;">
              <li>Please arrive 15 minutes before your visit time</li>
              <li>Carry a valid ID proof</li>
              <li>Museum timings: 9 AM - 6 PM (Closed Mondays)</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
            If you have any questions, please contact us at support@museum.com
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}