import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Book Your Tickets
          </h1>
          <p className="text-gray-600">
            Chat with our AI assistant to book museum tickets instantly
          </p>
        </div>

        <ChatWidget />

        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong>Tip:</strong> You can ask questions like "I want to book 2 adult
            tickets for tomorrow" or "What ticket types are available?"
          </p>
        </div>
      </div>
    </div>
  );
}