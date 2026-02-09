//app/page.tsx
import Link from 'next/link';
import { MessageSquare, Ticket, BarChart3, Sparkles, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-white/10 border-b border-white/20">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center animate-glow">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">MuseBot</h1>
          </div>
          <Link
            href="/admin"
            className="glass px-6 py-2 rounded-full text-white hover:bg-white/20 transition-all duration-300"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="inline-block mb-4 px-4 py-2 glass rounded-full">
          <span className="text-white/90 text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI-Powered Ticketing System
          </span>
        </div>
        
        <h2 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Skip the Line,
          <br />
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Enter the Magic
          </span>
        </h2>
        
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Book museum tickets instantly with our intelligent chatbot. 
          Fast, simple, and completely automated.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/chat"
            className="group relative px-8 py-4 bg-white text-purple-600 rounded-2xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 text-lg font-semibold overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <MessageSquare className="w-6 h-6 relative z-10 group-hover:text-white transition-colors" />
            <span className="relative z-10 group-hover:text-white transition-colors">Start Booking</span>
          </Link>
          
          <Link
            href="/booking-simple"
            className="px-8 py-4 glass text-white rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center gap-3 text-lg font-semibold"
          >
            <Zap className="w-6 h-6" />
            Quick Book
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl hover:bg-white/20 transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-3">AI Assistant</h4>
            <p className="text-white/70">
              Chat naturally with our AI to book tickets in seconds
            </p>
          </div>

          <div className="glass p-8 rounded-3xl hover:bg-white/20 transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Ticket className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-3">Instant Tickets</h4>
            <p className="text-white/70">
              Get QR code tickets delivered to your email immediately
            </p>
          </div>

          <div className="glass p-8 rounded-3xl hover:bg-white/20 transition-all duration-300 group">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-3">Secure Payment</h4>
            <p className="text-white/70">
              Safe and encrypted payment processing with Razorpay
            </p>
          </div>
        </div>
      </section>

      {/* Ticket Types */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="glass-dark rounded-3xl p-10">
          <h3 className="text-4xl font-bold text-white text-center mb-12">
            Choose Your Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'General Admission (Adult)', price: '₹200', gradient: 'from-pink-500 to-purple-500' },
              { name: 'General Admission (Child)', price: '₹100', gradient: 'from-blue-500 to-cyan-500' },
              { name: 'Student (with ID)', price: '₹150', gradient: 'from-green-500 to-teal-500' },
              { name: 'Senior Citizen', price: '₹100', gradient: 'from-yellow-500 to-orange-500' },
              { name: 'VIP Tour', price: '₹500', gradient: 'from-red-500 to-pink-500' },
              { name: 'Group (10+ people)', price: '₹150/person', gradient: 'from-indigo-500 to-purple-500' },
            ].map((ticket, index) => (
              <div
                key={index}
                className="glass p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 border-2 border-white/10 hover:border-white/30 group cursor-pointer"
              >
                <div className={`w-full h-2 bg-gradient-to-r ${ticket.gradient} rounded-full mb-4`}></div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:scale-105 transition-transform">
                  {ticket.name}
                </h4>
                <p className="text-3xl font-bold text-white">{ticket.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="glass-dark rounded-3xl p-16">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Visit?
          </h3>
          <p className="text-xl text-white/80 mb-8">
            Book your tickets now and skip the queue!
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 rounded-2xl hover:shadow-2xl transition-all duration-300 text-xl font-bold hover:scale-105"
          >
            <MessageSquare className="w-6 h-6" />
            Start Booking Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 backdrop-blur-sm bg-black/20 border-t border-white/10 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60">&copy; 2024 MuseBot. All rights reserved.</p>
          <p className="text-white/40 text-sm mt-2">
            Museum Timings: 9 AM - 6 PM (Closed on Mondays)
          </p>
        </div>
      </footer>
    </main>
  );
}