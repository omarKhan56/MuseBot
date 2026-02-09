//types/index.ts
export interface Booking {
  id?: string;
  visitor_name: string;
  email: string;
  phone: string;
  visit_date: string;
  ticket_type: string;
  quantity: number;
  total_amount: number;
  payment_status: string;
  payment_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  language: string;
  created_at?: string;
  updated_at?: string;
}

export interface Ticket {
  id?: string;
  booking_id: string;
  ticket_number: string;
  qr_code: string;
  is_used: boolean;
  used_at?: string;
  created_at?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface TicketType {
  name: string;
  price: number;
  description: string;
}

export interface AnalyticsEvent {
  event_type: string;
  event_data: any;
}