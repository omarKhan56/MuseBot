🏛️ MuseBot - AI-Powered Museum Ticketing System
<div align="center">
Show Image
Show Image
Show Image
Show Image
A modern, full-stack museum ticket booking platform with AI chatbot assistance, real-time analytics, and seamless payment integration.
Live Demo • Documentation • Report Bug • Request Feature
</div>

📋 Table of Contents

Overview
Features
Tech Stack
Architecture
Getting Started
Environment Variables
Project Structure


🎯 Overview
MuseBot is a cutting-edge museum ticketing system that revolutionizes the visitor experience through:

🤖 AI-Powered Chatbot - Natural language booking with Groq AI (LLaMA 3.1)
🎫 Digital Tickets - QR code-based tickets with instant email delivery
📊 Real-time Analytics - Live dashboard with booking statistics and revenue tracking
💳 Payment Integration - Secure payments via Razorpay
🌐 Multilingual Support - Available in English, Hindi, Spanish, and French
📱 Responsive Design - Beautiful glassmorphism UI that works on all devices


✨ Features
🤖 AI Chatbot Assistant

Natural Language Processing - Chat naturally about tickets, prices, and timings
Context-Aware Responses - Maintains conversation history for coherent interactions
Instant Booking Assistance - Guides users through the entire booking process
Multilingual Support - Responds in user's preferred language

🎫 Smart Booking System

One-Click Booking - Streamlined form with auto-calculation of total amount
Multiple Ticket Types:

General Admission (Adult) - ₹200
General Admission (Child) - ₹100
Student (with ID) - ₹150
Senior Citizen - ₹100
VIP Tour - ₹500


Date Selection - Calendar-based visit date picker
Quantity Management - Book multiple tickets in one transaction
QR Code Generation - Unique QR code for each ticket

📧 Automated Email System

Instant Confirmation - Beautiful HTML emails sent immediately after booking
Booking Details - Complete information including QR codes
Resend Integration - Reliable email delivery via Resend API
Branded Templates - Professional email design matching UI theme


📊 Admin Dashboard

Real-time Analytics:

Total bookings count
Total revenue generated
Today's bookings
Most popular ticket type


Bookings Table - Complete list of all bookings with filters
Live Updates - Supabase real-time subscriptions for instant data refresh
Export Capabilities - Download booking data (coming soon)

🎨 Modern UI/UX

Glassmorphism Design - Beautiful frosted glass effects
Gradient Accents - Purple-pink gradient theme throughout
Smooth Animations - Floating elements, hover effects, transitions
Dark Theme - Easy on the eyes with custom color palette
Responsive Layout - Mobile-first design that adapts to all screen sizes
Custom Tailwind Config - Extended theme with custom utilities

🔒 Security Features

Row Level Security (RLS) - Supabase database policies
Environment Variables - All secrets stored securely
Payment Signature Verification - Prevents payment tampering
Input Validation - Server-side and client-side validation
HTTPS Only - Secure connections enforced


🛠️ Tech Stack
Frontend

Next.js 14 - React framework with App Router
React 18 - UI library with Server Components
TypeScript - Type-safe JavaScript
Tailwind CSS - Utility-first CSS framework
Lucide React - Beautiful icon library

Backend

Next.js API Routes - Serverless API endpoints
Supabase - PostgreSQL database with real-time capabilities
Groq AI - LLaMA 3.1-8b-instant model for chatbot
Resend - Transactional email service
Razorpay - Payment gateway for India

Additional Libraries

qrcode - QR code generation for tickets
@supabase/supabase-js - Supabase JavaScript client
groq-sdk - Groq AI SDK

Deployment

Vercel - Hosting and serverless functions
GitHub - Version control and CI/CD


🏗️ Architecture
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│              (React 18 + TypeScript)                    │
└──────────────┬──────────────────────────────────────────┘
               │ HTTPS Requests
               ▼
┌──────────────────────────────────────────────────────────┐
│                  VERCEL EDGE NETWORK                     │
│                (CDN + Serverless Functions)              │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────┐
│              NEXT.JS 14 APPLICATION                      │
│  ┌────────────────────┐    ┌─────────────────────────┐  │
│  │  FRONTEND (Pages)  │    │  BACKEND (API Routes)   │  │
│  │  • app/page.tsx    │    │  • /api/chat            │  │
│  │  • app/chat        │    │  • /api/booking         │  │
│  │  • app/admin       │    │  • /api/payment/*       │  │
│  │  • Components      │    │  • /api/tickets         │  │
│  └────────────────────┘    └─────────────────────────┘  │
└────┬──────────┬──────────┬──────────┬──────────────────┘
     │          │          │          │
┌────▼────┐ ┌──▼──────┐ ┌─▼────────┐ ┌▼─────────┐
│SUPABASE │ │ GROQ AI │ │  RESEND  │ │ RAZORPAY │
│PostgreSQL│ │ LLaMA   │ │  Email   │ │ Payment  │
└─────────┘ └─────────┘ └──────────┘ └──────────┘
