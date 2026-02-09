//components/TicketCard.tsx
'use client';

import { Calendar, User, QrCode } from 'lucide-react';
import Link from 'next/link';

interface TicketCardProps {
  ticket: {
    id: string;
    ticket_number: string;
    is_used: boolean;
    booking: {
      visitor_name: string;
      visit_date: string;
      ticket_type: string;
    };
  };
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`h-2 ${ticket.is_used ? 'bg-red-500' : 'bg-green-500'}`}></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {ticket.ticket_number}
            </h3>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                ticket.is_used
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {ticket.is_used ? 'Used' : 'Valid'}
            </span>
          </div>
          <QrCode className="w-8 h-8 text-gray-400" />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{ticket.booking.visitor_name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{ticket.booking.visit_date}</span>
          </div>
          <p className="text-sm text-gray-600">{ticket.booking.ticket_type}</p>
        </div>

        <Link
          href={`/ticket/${ticket.id}`}
          className="block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          View Ticket
        </Link>
      </div>
    </div>
  );
}
