//app/ticket/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

export default function TicketPage() {
  const params = useParams();

  const [ticket, setTicket] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const response = await fetch(
        `/api/booking/${params.id}`
      );

      const data = await response.json();

      if (data.success) {
        setTicket(data.booking);
      }
    } catch (error) {
      console.error('Ticket fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">
          Loading ticket...
        </p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold text-red-500">
          Ticket not found
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Museum Ticket
        </h1>

        <div className="space-y-5">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-500">
              Visitor Name
            </p>
            <p className="text-xl font-semibold">
              {ticket.visitor_name}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-500">
              Email
            </p>
            <p className="text-xl font-semibold">
              {ticket.email}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-500">
              Phone
            </p>
            <p className="text-xl font-semibold">
              {ticket.phone}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-500">
              Visit Date
            </p>
            <p className="text-xl font-semibold">
              {ticket.visit_date}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl">
            <p className="text-sm text-gray-500">
              Ticket Type
            </p>
            <p className="text-xl font-semibold">
              {ticket.ticket_type}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-5 rounded-2xl text-white shadow-lg">
            <p className="text-sm opacity-80">
              Payment Status
            </p>

            <p className="text-3xl font-bold mt-2">
              {ticket.payment_status}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}