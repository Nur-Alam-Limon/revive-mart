import { Request, Response } from 'express';
import { ITransactionCreate, ITransactionUpdate } from './orders.interface';
import { Transaction } from './orders.model';

// Create a new transaction (buying/selling an item)
export const createTransaction = async (req: Request<{}, {}, ITransactionCreate>, res: Response) => {
  try {
    const { buyerID, sellerID, itemID, status } = req.body;
    
    const newTransaction = new Transaction({
      buyerID,
      sellerID,
      itemID,
      status,
    });

    await newTransaction.save();
    res.status(201).json({ success: true, transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create transaction' });
  }
};

// Get all transactions of a user (both sales and purchases)
export const getUserTransactions = async (req: Request<{ userId: string }, {}, {}>, res: Response) => {
  try {
    const userId = req.params.userId;
    
    const transactions = await Transaction.find({
      $or: [{ buyerID: userId }, { sellerID: userId }]
    });

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
};

// Update transaction status (mark as completed or pending)
export const updateTransactionStatus = async (req: Request<{ id: string }, {}, ITransactionUpdate>, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const transactionId = req.params.id;

    // Update the transaction status in the database
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { status },
      { new: true }
    );

    if (!updatedTransaction) {
      // If transaction not found, return an error response
      res.status(404).json({ success: false, message: 'Transaction not found' });
      return; // Ensure no further code execution after sending a response
    }

    // If transaction was updated, return the updated transaction
    res.status(200).json({ success: true, transaction: updatedTransaction });
  } catch (error) {
    // Catch any errors during the process and send an error response
    res.status(500).json({ success: false, message: 'Failed to update transaction status' });
  }
};

