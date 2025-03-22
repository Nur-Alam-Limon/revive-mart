import { Request, Response } from 'express';
import { registerUser, loginUser, updateUserProfile, getUserByIdService, updateUserByIdService, deleteUserByIdService, getAllUserService } from './auth.service';

// Register User
export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ success: true, message: 'User registered successfully', user });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
};

// Login User
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.status(200).json({ success: true, token, user });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(401).json({ success: false, message: err.message });
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new Error('User not authenticated');
    const user = await updateUserProfile(req.user.id, req.body);
    res.status(200).json({ success: true, user });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get User By ID (Admin Only)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ success: false, message: err.message });
  }
};

// Get All Users (Admin Only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUserService();
    res.status(200).json({ success: true, users });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(404).json({ success: false, message: err.message });
  }
};

// Update User By ID (Admin Only)
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const user = await updateUserByIdService(req.params.id, req.body);
    res.status(200).json({ success: true, user });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete User By ID (Admin Only)
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    await deleteUserByIdService(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(400).json({ success: false, message: err.message });
  }
};
