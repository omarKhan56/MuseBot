//components/ChatWidget.tsx

'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '@/types';
import { useRouter } from 'next/navigation';

export default function ChatWidget() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "👋 Hey there! I'm MuseBot — just tell me what you need and I'll book your tickets automatically! Try: \"2 adult tickets for this Saturday\"",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput]                     = useState('');
  const [loading, setLoading]                 = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || bookingInProgress) return;

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
        body: JSON.stringify({ message: input, history: messages }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Booking was created automatically — redirect to payment
      if (data.bookingId) {
        setBookingInProgress(true);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: '✅ Booking created! Taking you to the payment page now...',
              timestamp: new Date(),
            },
          ]);
        }, 300);

        setTimeout(() => {
          router.push(`/booking/${data.bookingId}`);
        }, 1800);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oops! Something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass rounded-3xl border-2 border-white/20 overflow-hidden shadow-2xl">

      {/* Header */}
      <div className="bg-gradient-primary p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm animate-glow">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">MuseBot Assistant</h2>
          <p className="text-sm text-white/80">
            {bookingInProgress ? '⏳ Processing your booking...' : 'I\'ll book your tickets automatically ⚡'}
          </p>
        </div>
        {bookingInProgress && (
          <div className="ml-auto w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-purple-50/50 to-white/50 backdrop-blur-sm">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-pink-500 to-purple-500'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}
            >
              {message.role === 'user'
                ? <User className="w-5 h-5 text-white" />
                : <Bot  className="w-5 h-5 text-white" />
              }
            </div>

            <div
              className={`flex-1 p-4 rounded-2xl shadow-lg max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {new Date(message.timestamp).toLocaleTimeString('en-GB', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" />
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce delay-100" />
                <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-bounce delay-200" />
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
            onKeyPress={(e) => e.key === 'Enter' && !loading && !bookingInProgress && handleSend()}
            placeholder={
              bookingInProgress
                ? 'Booking in progress...'
                : 'e.g. "2 adult tickets for this Saturday"'
            }
            disabled={loading || bookingInProgress}
            className="flex-1 px-5 py-3 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim() || bookingInProgress}
            className="bg-gradient-primary text-white px-7 py-3 rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 font-semibold hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}