🎟️ MuseBot – AI Museum Ticket Booking System

MuseBot is an AI-powered museum ticket booking platform that allows visitors to book tickets through a conversational chat interface, complete secure payments, receive QR-based entry tickets, and enables administrators to monitor bookings and analytics in real time.

Built using Next.js, Supabase, Razorpay, and AI chat integration, MuseBot provides a modern, automated ticketing solution.

🚀 Features
🤖 AI Chat Booking

Book tickets using natural language chat

Ask questions about ticket types & availability

Instant booking assistance

🎫 Ticket Management

Automatic ticket generation

Unique QR code for each ticket

Email delivery of tickets

Ticket validation & usage tracking

💳 Secure Payments

Razorpay payment integration

Payment verification & status tracking

Real-time payment updates

📊 Admin Dashboard

Real-time booking updates

Revenue & booking analytics

Payment status tracking

Popular ticket insights

📈 Analytics & Insights

Total bookings & revenue

Daily bookings statistics

Most popular ticket types

Event logging for system actions

🔄 Real-Time Updates

Supabase real-time subscriptions

Instant dashboard refresh

Live booking activity monitoring

🏗️ Tech Stack
Frontend

Next.js

React (Client Components)

Tailwind CSS

Lucide Icons

Backend & Database

Supabase (PostgreSQL + Realtime)

Next.js API Routes

Payments

Razorpay Payment Gateway

AI Integration

Groq AI chat integration

Utilities

QR Code generation

Email service integration

📂 Project Structure
app/
 ├── admin/                # Admin dashboard
 ├── api/
 │   ├── analytics/        # Analytics API
 │   ├── booking/          # Booking & ticket generation
 │   ├── chat/             # AI chat assistant
 │   ├── payment/          # Razorpay integration
 │   └── tickets/          # Ticket validation & retrieval
 ├── booking/[id]/         # Booking confirmation & payment
 ├── chat/                 # AI booking interface
 └── ticket/[id]/          # Ticket display & download

components/
 ├── AnalyticsDashboard
 ├── ChatWidget
 ├── PaymentButton
 ├── QRCodeGenerator

lib/
 ├── supabase.ts
 ├── razorpay.ts
 ├── groq.ts
 └── email.ts
⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/yourusername/musebot.git
cd musebot
2️⃣ Install dependencies
npm install
3️⃣ Environment Variables

Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

GROQ_API_KEY=your_key

EMAIL_SERVER_KEY=your_email_key
🗄️ Database Schema (Supabase)
bookings

id

visitor_name

email

phone

visit_date

ticket_type

quantity

total_amount

payment_status

created_at

tickets

id

booking_id

ticket_number

qr_code

is_used

used_at

analytics

id

event_type

event_data

created_at

🔄 Application Workflow
🧑 Visitor Flow

User opens chat interface.

AI assists with booking.

Booking record created.

Razorpay payment initiated.

Payment verified.

QR tickets generated.

Ticket emailed to visitor.

🛠️ Admin Flow

Admin dashboard loads.

Real-time booking data displayed.

Revenue & analytics updated automatically.

🔌 API Endpoints
Booking

POST /api/booking → Create booking & tickets

GET /api/booking?email= → Fetch user bookings

Payment

POST /api/payment/create → Create Razorpay order

POST /api/payment/verify → Verify payment

Tickets

GET /api/tickets?ticketNumber= → Get ticket

PUT /api/tickets → Mark ticket as used

Analytics

GET /api/analytics → Dashboard statistics

Chat

POST /api/chat → AI conversation
