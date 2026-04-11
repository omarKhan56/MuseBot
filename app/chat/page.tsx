//app/chat/page.tsx
import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// This is the chat page of the museum ticketing system. It features a header with a back button, an introduction to the AI assistant, and the ChatWidget component where users can interact with the chatbot to book their tickets. The page also includes a tip section to guide users on how to use the chatbot effectively.
//this is frontend file in Next.js

//this file basically just renders the chat interface and provides a link back to the homepage. The actual chatbot functionality is handled by the ChatWidget component, which is imported at the top. The page is styled with Tailwind CSS to create a visually appealing and user-friendly interface for booking museum tickets through the chatbot.
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