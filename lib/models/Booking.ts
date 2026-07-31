// lib/models/Booking.ts

import mongoose, { Schema, Document } from 'mongoose';
 
export interface IBooking extends Document {
  visitor_name: string;
  email: string;
  phone: string;
  visit_date: string;
  ticket_type: string;
  quantity: number;
  total_amount: number;
  payment_status: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  language: string;
  created_at: Date;
  updated_at: Date;
}
 
const BookingSchema = new Schema<IBooking>({
  visitor_name: { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String, required: true },
  visit_date:   { type: String, required: true },
  ticket_type:  { type: String, required: true },
  quantity:     { type: Number, required: true },
  total_amount: { type: Number, required: true },
  payment_status:       { type: String, default: 'pending' },
  razorpay_order_id:    { type: String },
  razorpay_payment_id:  { type: String },
  razorpay_signature:   { type: String },
  language:    { type: String, default: 'en' },
  created_at:  { type: Date, default: Date.now },
  updated_at:  { type: Date, default: Date.now },
});
 
export default mongoose.models.Booking ||
  mongoose.model<IBooking>('Booking', BookingSchema);