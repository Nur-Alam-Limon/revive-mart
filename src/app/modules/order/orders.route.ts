import { Router } from 'express';
import { createTransaction, getAllTransactions, getPurchaseHistory, getSellHistory, getUserTransactions, initiatePayment, initiatePaymentCancel, initiatePaymentFailure, initiatePaymentSuccess, updateTransactionStatus } from './orders.controller';
import { authorizeRoles, verifyToken } from '../auth/auth.middleware';


const router = Router();

// Create a new transaction (buying/selling an item)
router.post('/', verifyToken, createTransaction);

// Get all transactions of a user (both sales and purchases)
router.get('/:userId', verifyToken, getUserTransactions);
// Admin Route: Get all transactions
router.get('/transactions',verifyToken, authorizeRoles('admin'), getAllTransactions);

// User Route: Get purchase history by buyerID
router.get('/transactions/purchase/:buyerId',verifyToken, getPurchaseHistory);

// User Route: Get sell history by sellerID
router.get('/transactions/sell/:sellerId',verifyToken, getSellHistory);
// Update transaction status (mark as completed or pending)
router.put('/:id', verifyToken, authorizeRoles('admin'), updateTransactionStatus);
router.post("/initiate-payment", verifyToken, initiatePayment);
router.post("/ssl/success/:id", initiatePaymentSuccess);
router.post('/ssl/fail', initiatePaymentFailure);
router.post('/ssl/cancel', initiatePaymentCancel);

export default router;
