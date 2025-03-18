import mongoose, { Schema } from 'mongoose';
import { IListing } from './listings.interface';

const ListingSchema = new Schema<IListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  condition: { type: String, enum: ['New', 'Used'], required: true },
  images: { type: [String], required: true },
  userId: { type: String, required: true },
  status: { type: String, enum: ['available', 'sold'], default: 'available' }
});

export const ListingModel = mongoose.model<IListing>('Listing', ListingSchema);
