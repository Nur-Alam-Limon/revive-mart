import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string;  
  address?: string; 
  profilePic?: string;
}

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true},
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, required: false },  
  address: { type: String, required: false }, // Optional field
  profilePic: { type: String, required: false },
}, { timestamps: true });

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
