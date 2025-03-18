import { Document } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  condition: 'New' | 'Used';
  images: string[];
  userId: string;
  status: 'available' | 'sold';
}
