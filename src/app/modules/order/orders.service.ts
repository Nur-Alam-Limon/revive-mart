
import { Transaction } from './orders.model';
import { Types } from 'mongoose';

// Service to create a new transaction (buying/selling an item)
export const createTransactionService = async (
  buyerID: Types.ObjectId,
  sellerID: Types.ObjectId,
  itemID: Types.ObjectId,
  status: 'pending' | 'completed'
) => {
  try {
    // Create a new transaction with the provided details
    const newTransaction = new Transaction({
      buyerID,
      sellerID,
      itemID,
      status,
    });

    // Save the new transaction to the database
    const savedTransaction = await newTransaction.save();

    return { success: true, transaction: savedTransaction };
  } catch (error: any) {
    throw new Error('Failed to create transaction: ' + error.message);
  }
};

// Service to fetch all transactions of a user (both purchases and sales)
export const getUserTransactionsService = async (userId: Types.ObjectId) => {
  try {
    // Fetch transactions where the user is either the buyer or the seller
    const transactions = await Transaction.find({
      $or: [{ buyerID: userId }, { sellerID: userId }],
    }).populate('buyerID sellerID itemID');  // Optionally populate the user and item details

    if (!transactions || transactions.length === 0) {
      throw new Error('No transactions found for the user');
    }

    return { success: true, transactions };
  } catch (error: any) {
    throw new Error('Failed to fetch transactions: ' + error.message);
  }
};

// Service to update the transaction status (e.g., mark as completed or pending)
export const updateTransactionStatusService = async (
  transactionId: Types.ObjectId,
  status: 'pending' | 'completed'
) => {
  try {
    // Find and update the transaction by its ID
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedTransaction) {
      throw new Error('Transaction not found');
    }

    return { success: true, transaction: updatedTransaction };
  } catch (error: any) {
    throw new Error('Failed to update transaction status: ' + error.message);
  }
};
