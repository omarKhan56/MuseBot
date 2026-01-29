"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Ticket } from "lucide-react";
import { ChatMessage } from "@/types";
import { useRouter } from "next/navigation";

export default function ChatWidget() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! Welcome to our museum. I can help you book tickets. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    visitor_name: "",
    email: "",
    phone: "",
    visit_date: "",
    ticket_type: "General Admission (Adult)",
    quantity: 1,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const ticketPrices: { [key: string]: number } = {
    "General Admission (Adult)": 200,
    "General Admission (Child)": 100,
    "Student (with ID)": 150,
    "Senior Citizen": 100,
    "VIP Tour": 500,
  };

  const totalAmount =
    ticketPrices[bookingData.ticket_type] * bookingData.quantity;

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Check if user wants to book
      const lowerInput = input.toLowerCase();
      if (
        lowerInput.includes("book") ||
        lowerInput.includes("ticket") ||
        lowerInput.includes("buy") ||
        lowerInput.includes("purchase")
      ) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Great! I'll help you book tickets. Please click the 'Book Tickets' button below to fill in your details.",
              timestamp: new Date(),
            },
          ]);
        }, 500);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
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
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          total_amount: totalAmount,
          payment_status: "pending",
          language: "en",
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to payment page
        router.push(`/booking/${data.booking.id}`);
      } else {
        alert("Booking failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-xl border border-gray-200">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bot className="w-6 h-6" />
            Museum Assistant
          </h2>
          <p className="text-sm text-primary-100">
            Ask me anything about tickets!
          </p>
        </div>
        {!showBookingForm && (
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2 text-sm font-semibold"
          >
            <Ticket className="w-4 h-4" />
            Book Tickets
          </button>
        )}
      </div>

      {!showBookingForm ? (
        // Chat View
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`flex-1 p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-primary-100"
                        : "text-gray-500"
                    }`}
                  >
                   {message.timestamp.toTimeString().slice(0, 5)}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gray-700" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        // Booking Form View
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Book Your Tickets
            </h3>
            <button
              onClick={() => setShowBookingForm(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Chat
            </button>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={bookingData.visitor_name}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    visitor_name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={bookingData.email}
                onChange={(e) =>
                  setBookingData({ ...bookingData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={bookingData.phone}
                onChange={(e) =>
                  setBookingData({ ...bookingData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+91 9876543210"
              />
            </div>

            {/* Visit Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visit Date *
              </label>
              <input
                type="date"
                required
                value={bookingData.visit_date}
                onChange={(e) =>
                  setBookingData({ ...bookingData, visit_date: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Ticket Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticket Type *
              </label>
              <select
                value={bookingData.ticket_type}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    ticket_type: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="General Admission (Adult)">
                  General Admission (Adult) - ₹200
                </option>
                <option value="General Admission (Child)">
                  General Admission (Child) - ₹100
                </option>
                <option value="Student (with ID)">
                  Student (with ID) - ₹150
                </option>
                <option value="Senior Citizen">Senior Citizen - ₹100</option>
                <option value="VIP Tour">VIP Tour - ₹500</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Tickets *
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
                    quantity: parseInt(e.target.value) || 1, // Fix: Default to 1 if NaN
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Total */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="text-lg font-semibold text-gray-800">
                Total Amount:{" "}
                <span className="text-primary-600">₹{totalAmount}</span>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {loading ? "Creating Booking..." : "Proceed to Payment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
