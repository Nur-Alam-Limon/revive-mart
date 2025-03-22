import { Document } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  price: number;
  condition: 'New' | 'Used';
  image: string;
  userId: string;
  status: 'available' | 'sold';
  email: string;
}
