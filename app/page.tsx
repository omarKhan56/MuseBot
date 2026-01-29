import Link from 'next/link';
import { MessageSquare, Ticket, BarChart3, Globe } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">
            Museum Ticketing
          </h1>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to Our Museum
        </h2>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Book your tickets instantly with our AI-powered chatbot. Skip the
          queues, enjoy seamless booking, and get instant confirmation!
        </p>

        {/* UPDATED BUTTONS */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/chat"
            className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-lg font-semibold shadow-lg"
          >
            <MessageSquare className="w-6 h-6" />
            Book with Chatbot
          </Link>

          <Link
            href="/booking-simple"
            className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-lg font-semibold shadow-lg"
          >
            <Ticket className="w-6 h-6" />
            Quick Test Booking
          </Link>

          <Link
            href="/admin"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-lg font-semibold shadow-lg border-2 border-primary-600"
          >
            <BarChart3 className="w-6 h-6" />
            Admin Dashboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Us?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold mb-3">AI Chatbot</h4>
            <p className="text-gray-600">
              Chat naturally with our AI assistant to book tickets instantly
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold mb-3">Instant Tickets</h4>
            <p className="text-gray-600">
              Get QR code tickets delivered to your email immediately
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold mb-3">Multilingual</h4>
            <p className="text-gray-600">
              Book in your preferred language – English, Hindi, Spanish, French
            </p>
          </div>
        </div>
      </section>

      {/* Ticket Types */}
      <section className="container mx-auto px-4 py-20 bg-white rounded-lg shadow-lg my-10">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Ticket Types
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'General Admission (Adult)', price: '₹200' },
            { name: 'General Admission (Child)', price: '₹100' },
            { name: 'Student (with ID)', price: '₹150' },
            { name: 'Senior Citizen', price: '₹100' },
            { name: 'VIP Tour', price: '₹500' },
            { name: 'Group (10+ people)', price: '₹150/person' },
          ].map((ticket, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 p-6 rounded-lg hover:border-primary-500 transition-colors"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {ticket.name}
              </h4>
              <p className="text-2xl font-bold text-primary-600">
                {ticket.price}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Museum Ticketing System. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Timings: 9 AM – 6 PM (Closed on Mondays)
          </p>
        </div>
      </footer>
    </main>
  );
}
