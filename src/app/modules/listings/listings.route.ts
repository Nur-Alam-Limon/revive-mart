import { Router } from 'express';
import { 
  addListing, getListings, getListing, 
  updateListing, deleteListing 
} from './listings.controller';
import { verifyToken, authorizeRoles } from '../auth/auth.middleware';

const router = Router();

// Public routes
router.get('/', getListings);  // Fetch all available listings
router.get('/:id', getListing);  // Fetch a specific listing by ID

// Protected routes (User authentication required)
router.post('/', verifyToken, addListing);  // Create a new listing
router.put('/:id', verifyToken, updateListing);  // Update an existing listing
router.delete('/:id', verifyToken, deleteListing);  // Delete a listing

export default router;
