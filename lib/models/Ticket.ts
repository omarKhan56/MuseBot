import mongoose, { Schema, Document } from 'mongoose';
 
export interface ITicket extends Document {
  booking_id: string;
  ticket_number: string;
  qr_code: string;
  is_used: boolean;
  used_at?: Date;
  created_at: Date;
}
 
const TicketSchema = new Schema<ITicket>({
  booking_id:    { type: String, required: true },
  ticket_number: { type: String, required: true, unique: true },
  qr_code:       { type: String, required: true },
  is_used:       { type: Boolean, default: false },
  used_at:       { type: Date },
  created_at:    { type: Date, default: Date.now },
});
 
export default mongoose.models.Ticket ||
  mongoose.model<ITicket>('Ticket', TicketSchema);
 