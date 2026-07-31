// lib/models/Analytics.ts
import mongoose, { Schema, Document } from 'mongoose';
 
export interface IAnalytics extends Document {
  event_type: string;
  event_data: any;
  created_at: Date;
}
 
const AnalyticsSchema = new Schema<IAnalytics>({
  event_type: { type: String, required: true },
  event_data: { type: Schema.Types.Mixed },
  created_at: { type: Date, default: Date.now },
});
 
export default mongoose.models.Analytics ||
  mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);