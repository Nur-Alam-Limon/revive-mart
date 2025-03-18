import { UserModel } from './auth.model';
import { RegisterPayload, LoginPayload, UpdateProfilePayload } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '72h';

export const registerUser = async (payload: RegisterPayload) => {
  const { name, email, password, role = 'user' } = payload;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email, password: hashedPassword, role });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  
  return { token, user };
};

export const updateUserProfile = async (userId: string, payload: UpdateProfilePayload) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const user = await UserModel.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
  if (!user) throw new Error('User not found or update failed');
  return user;
};

export const getUserByIdService = async (id: string) => {
  const user = await UserModel.findById(id, '-password');
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUserByIdService = async (id: string, payload: UpdateProfilePayload) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  const user = await UserModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!user) throw new Error('User not found or update failed');
  return user;
};

export const deleteUserByIdService = async (id: string) => {
  const result = await UserModel.findByIdAndDelete(id);
  if (!result) throw new Error('User not found or delete failed');
  return result;
};
