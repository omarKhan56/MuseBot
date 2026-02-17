//app/ticket/[id]/page.tsx
'use client';

// This is a frontend file in Next.js that displays ticket details and a QR code for a museum ticket. 

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import Link from 'next/link';  // ✅ FIXED: Changed from 'link' to 'next/link'
import { Calendar, User, Mail, Phone, ArrowLeft, Download } from 'lucide-react';

export default function TicketPage() {
  const params = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      // In production, fetch from API
      // Mock data for now
      const mockTicket = {
        id: params.id,
        ticket_number: `TICKET-${params.id}`,
        booking: {
          visitor_name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          visit_date: '2024-02-15',
          ticket_type: 'General Admission (Adult)',
          quantity: 2,
          total_amount: 400,
        },
        qr_code: 'mock-qr-data',
        is_used: false,
      };
      setTicket(mockTicket);
      setLoading(false);
    } catch (error) {
      console.error('Ticket fetch error:', error);
      setLoading(false);
    }
  };

  const downloadTicket = () => {
    // In production, generate PDF ticket
    alert('Download feature - integrate with PDF library');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-800">Ticket not found</p>
          <Link href="/" className="text-primary-600 hover:underline mt-4 inline-block">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Museum Entry Ticket</h1>
            <p className="text-primary-100">Ticket #{ticket.ticket_number}</p>
          </div>

          {/* Ticket Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Visitor Name</p>
                    <p className="font-semibold text-gray-800">
                      {ticket.booking.visitor_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-800">
                      {ticket.booking.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-800">
                      {ticket.booking.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Visit Date</p>
                    <p className="font-semibold text-gray-800">
                      {ticket.booking.visit_date}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Ticket Type</p>
                  <p className="font-semibold text-gray-800">
                    {ticket.booking.ticket_type}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      ticket.is_used
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {ticket.is_used ? 'Used' : 'Valid'}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="border-t border-gray-200 pt-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code at the museum entrance
                </p>
                <div className="inline-block">
                  <QRCodeGenerator
                    value={JSON.stringify({
                      ticketNumber: ticket.ticket_number,
                      bookingId: ticket.booking.id,
                      visitorName: ticket.booking.visitor_name,
                      visitDate: ticket.booking.visit_date,
                    })}
                    size={250}
                  />
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Important Instructions
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please arrive 15 minutes before your visit time</li>
                <li>• Carry a valid government-issued ID proof</li>
                <li>• This ticket is non-transferable</li>
                <li>• Museum timings: 9 AM - 6 PM (Closed on Mondays)</li>
              </ul>
            </div>

            {/* Download Button */}
            <button
              onClick={downloadTicket}
              className="mt-6 w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <Download className="w-5 h-5" />
              Download Ticket (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}