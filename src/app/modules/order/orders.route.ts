import { Router } from 'express';
import { createTransaction, getUserTransactions, updateTransactionStatus } from './orders.controller';
import { authorizeRoles, verifyToken } from '../auth/auth.middleware';


const router = Router();

// Create a new transaction (buying/selling an item)
router.post('/', verifyToken, createTransaction);

// Get all transactions of a user (both sales and purchases)
router.get('/:userId', verifyToken, getUserTransactions);

// Update transaction status (mark as completed or pending)
router.put('/:id', verifyToken, authorizeRoles('admin'), updateTransactionStatus);

export default router;
