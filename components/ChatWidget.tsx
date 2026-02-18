//components/ChatWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Ticket, X, Sparkles } from 'lucide-react'; //Icon library for UI visuals.
import { ChatMessage } from '@/types'; //
import { useRouter } from 'next/navigation'; // Next.js router for navigation after booking. Used to navigate programmatically.

// This is the ChatWidget component used in the chat page of the museum ticketing system. It provides a chat interface where users can interact with the AI assistant to book their tickets. The component handles user input, displays chat messages, and manages the booking flow, including extracting booking details from user messages and confirming bookings before showing the manual booking form. It also includes loading states and animations for a smooth user experience.

export default function ChatWidget() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '👋 Hey there! Ready to book some tickets? I can help you with that!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const [bookingData, setBookingData] = useState({
    visitor_name: '',
    email: '',
    phone: '',
    visit_date: '',
    ticket_type: 'General Admission (Adult)',
    quantity: 1,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const ticketPrices: { [key: string]: number } = {
    'General Admission (Adult)': 200,
    'General Admission (Child)': 100,
    'Student (with ID)': 150,
    'Senior Citizen': 100,
    'VIP Tour': 500,
  };

  const totalAmount = ticketPrices[bookingData.ticket_type] * (bookingData.quantity || 1);
  // 🔥 Chatbot → Booking extraction helper
const extractBookingFromChat = (message: string) => {
  const lower = message.toLowerCase();

  // Quantity
  const qtyMatch = message.match(/\d+/);// meaanin of this is to extract the first number from the user's message, which is assumed to represent the quantity of tickets they want to book. If a number is found, it will be parsed as an integer; otherwise, it defaults to 1.
  const quantity = qtyMatch ? parseInt(qtyMatch[0]) : 1;

  // Ticket type
  let ticket_type = 'General Admission (Adult)';
  if (lower.includes('child')) ticket_type = 'General Admission (Child)';
  if (lower.includes('student')) ticket_type = 'Student (with ID)';
  if (lower.includes('senior')) ticket_type = 'Senior Citizen';
  if (lower.includes('vip')) ticket_type = 'VIP Tour';

  // Visit date
  let visit_date = '';
  if (lower.includes('tomorrow')) {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    visit_date = d.toISOString().split('T')[0];
  }

  return {
    quantity,
    ticket_type,
    visit_date,
  };
};


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,

          history: messages,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Check if user wants to book
      const lowerInput = userMessage.content.toLowerCase();
      // ❌ Handle cancel / edit before confirmation
if (
  awaitingConfirmation &&
  (lowerInput.includes('cancel') ||
   lowerInput.includes('no') ||
   lowerInput.includes('edit'))
) {
  setAwaitingConfirmation(false);

  setMessages((prev) => [
    ...prev,
    {
      role: 'assistant',
      content:
        '❌ No problem. Booking cancelled. You can start again whenever you’re ready.',
      timestamp: new Date(),
    },
  ]);

  setLoading(false);
  return; // ⛔ STOP further processing
}

      // ✅ Handle confirmation from user (yes / proceed / ok)
const confirmation =
  awaitingConfirmation &&
  ['yes', 'proceed', 'continue', 'ok'].includes(lowerInput);

if (confirmation) {
  setAwaitingConfirmation(false);
  setShowBookingForm(true);

  setMessages((prev) => [
    ...prev,
    {
      role: 'assistant',
      content: '✅ Great! Please review your booking details below.',
      timestamp: new Date(),
    },
  ]);

  setLoading(false);
  return; // ⛔ VERY IMPORTANT: stop here
}


const bookingIntent =
  lowerInput.includes('book') ||
  lowerInput.includes('reserve')||
  lowerInput.includes('buy') ||
  lowerInput.includes('purchase');

if (bookingIntent && !awaitingConfirmation) {
  const extracted = extractBookingFromChat(userMessage.content);

  setBookingData((prev) => ({
    ...prev,
    ticket_type: extracted.ticket_type,
    quantity: extracted.quantity,
    visit_date: extracted.visit_date || prev.visit_date,
  }));

  setMessages((prev) => [
    ...prev,
    {
      role: 'assistant',
      content:
        `🎟️ I can book ${extracted.quantity} ${extracted.ticket_type} ticket(s)` +
        `${extracted.visit_date ? ` for ${extracted.visit_date}` : ''}.  
Would you like to proceed? (Yes / Edit / Cancel)`,
      timestamp: new Date(),
    },
  ]);

  setAwaitingConfirmation(true);
}


    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oops! Something went wrong on my end. Mind trying that again?',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          total_amount: totalAmount,
          payment_status: 'pending',
          language: 'en',
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to payment page
        router.push(`/booking/${data.booking.id}`);
      } else {
        alert('Booking failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass rounded-3xl border-2 border-white/20 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-primary p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm animate-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              MuseBot Assistant
            </h2>
            <p className="text-sm text-white/80">Lightning fast booking ⚡</p>
          </div>
        </div>
        {!showBookingForm && (
  <button
    onClick={() => {
      setAwaitingConfirmation(false); // ✅ reset chatbot flow
      setShowBookingForm(true);        // ✅ open manual booking
    }}
    className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 text-sm font-semibold border border-white/30 hover:scale-105"
  >
    <Ticket className="w-4 h-4" />
    Book Now
  </button>
)}


      </div>

      {!showBookingForm ? (
        // Chat View
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-purple-50/50 to-white/50 backdrop-blur-sm">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 animate-slide-up ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-pink-500 to-purple-500'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 p-4 rounded-2xl shadow-lg max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3 animate-slide-up">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/20 p-4 bg-white/80 backdrop-blur-sm">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder="Type your message here..."
                className="flex-1 px-5 py-3 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-primary text-white px-7 py-3 rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 font-semibold hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        // Booking Form View
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-purple-50/50 to-white/50 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              🎫 Book Your Tickets
            </h3>
            <button
              onClick={() => setShowBookingForm(false)}
              className="text-gray-600 hover:text-gray-800 p-2 hover:bg-white/50 rounded-xl transition-all"
              title="Back to chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={bookingData.visitor_name}
                onChange={(e) =>
                  setBookingData({ ...bookingData, visitor_name: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={bookingData.email}
                onChange={(e) =>
                  setBookingData({ ...bookingData, email: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={bookingData.phone}
                onChange={(e) =>
                  setBookingData({ ...bookingData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
                placeholder="+91 9876543210"
              />
            </div>

            {/* Visit Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Visit Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={bookingData.visit_date}
                onChange={(e) =>
                  setBookingData({ ...bookingData, visit_date: e.target.value })
                }
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
              />
            </div>

            {/* Ticket Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ticket Type <span className="text-red-500">*</span>
              </label>
              <select
                value={bookingData.ticket_type}
                onChange={(e) =>
                  setBookingData({ ...bookingData, ticket_type: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
              >
                <option value="General Admission (Adult)">
                  General Admission (Adult) - ₹200
                </option>
                <option value="General Admission (Child)">
                  General Admission (Child) - ₹100
                </option>
                <option value="Student (with ID)">Student (with ID) - ₹150</option>
                <option value="Senior Citizen">Senior Citizen - ₹100</option>
                <option value="VIP Tour">VIP Tour - ₹500</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Tickets <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={bookingData.quantity}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
              />
            </div>

            {/* Total Amount */}
            <div className="glass-dark p-5 rounded-2xl border-2 border-purple-300 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Amount:</span>
                <span className="text-3xl font-bold text-white">₹{totalAmount}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-white px-6 py-4 rounded-2xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                '🎉 Proceed to Payment'
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> You'll receive your tickets via email immediately after payment!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}