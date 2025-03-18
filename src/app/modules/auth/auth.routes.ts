import { Router } from 'express';
import { 
  register, login, updateProfile, 
  getUserById, updateUserById, deleteUserById 
} from './auth.controller';
import { verifyToken, authorizeRoles } from './auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (Users must be authenticated)
router.put('/profile', verifyToken, updateProfile);

// User Management Routes (Admin Only)
router.get('/users/:id', verifyToken, authorizeRoles('admin'), getUserById);
router.put('/users/:id', verifyToken, authorizeRoles('admin'), updateUserById);
router.delete('/users/:id', verifyToken, authorizeRoles('admin'), deleteUserById);

export default router;
