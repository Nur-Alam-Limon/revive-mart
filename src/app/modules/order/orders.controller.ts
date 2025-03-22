import { Request, Response } from 'express';
import { ITransactionCreate, ITransactionUpdate } from './orders.interface';
import { Transaction } from './orders.model';
import SSLCommerzPayment from 'sslcommerz-lts';
import { ListingModel } from '../listings/listings.model';

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

export const initiatePaymentSuccess = async (req: Request, res: Response) => {
  try {
    const { tran_id } = req.body;

    // Find and update all transactions with the same tran_id to completed
    const updatedTransactions = await Transaction.updateMany(
      { tran_id },
      { status: "completed" }
    );

    if (updatedTransactions.matchedCount === 0) {
      res.status(404).json({ success: false, message: "No transactions found with the provided tran_id" });
    }

    res.status(200).json({ success: true, message: "Payment successful", transactions: updatedTransactions });
  } catch (error) {
    console.error("Payment Success Handling Error:", error);
    res.status(500).json({ success: false, message: "Server Error while processing payment success" });
  }
};

export const initiatePaymentFailure = async (req: Request, res: Response) => {
  try {
    const { tran_id } = req.body;

    // Find and update all transactions with the same tran_id to failed
    const updatedTransactions = await Transaction.updateMany(
      { tran_id },
      { status: "failed" }
    );

    if (updatedTransactions.matchedCount === 0) {
      res.status(404).json({ success: false, message: "No transactions found with the provided tran_id" });
    }

    res.status(200).json({ success: true, message: "Payment failed", transactions: updatedTransactions });
  } catch (error) {
    console.error("Payment Failure Handling Error:", error);
    res.status(500).json({ success: false, message: "Server Error while processing payment failure" });
  }
};

export const initiatePaymentCancel = async (req: Request, res: Response) => {
  try {
    const { tran_id } = req.body;

    // Find and update all transactions with the same tran_id to cancelled
    const updatedTransactions = await Transaction.updateMany(
      { tran_id },
      { status: "cancelled" }
    );

    if (updatedTransactions.matchedCount === 0) {
      res.status(404).json({ success: false, message: "No transactions found with the provided tran_id" });
    }

    res.status(200).json({ success: true, message: "Payment cancelled", transactions: updatedTransactions });
  } catch (error) {
    console.error("Payment Cancel Handling Error:", error);
    res.status(500).json({ success: false, message: "Server Error while processing payment cancellation" });
  }
};

export const initiatePayment = async (req: Request, res: Response) => {
  const { total_amount, currency, tran_id, success_url, fail_url, cancel_url, customer, itemIDs } = req.body;

  const store_id = process.env.SSL_STORE_ID || "nuralam098";
  const store_passwd = process.env.SSL_STORE_PASSWORD || "nlimon";
  const is_live = false;

  const paymentData = {
    total_amount: parseInt(total_amount),
    currency: currency || "BDT",
    tran_id,
    success_url,
    fail_url,
    cancel_url,
    ipn_url: "http://localhost:3000/ipn",
    shipping_method: "Courier",
    product_name: "Products",
    product_category: "Various",
    product_profile: "general",
    cus_name: customer.name,
    cus_email: customer.email,
    cus_phone: customer.phone,
    cus_add1: customer.address,
    cus_city: "Dhaka",
    cus_postcode: "1762",
    cus_country: "Bangladesh",
    ship_name: customer.name,
    ship_add1: customer.address,
    ship_city: "Dhaka",
    ship_postcode: "1762",
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  try {
    // Fetch listings to get seller IDs
    const listings = await ListingModel.find({ _id: { $in: itemIDs } });

    if (listings.length === 0) {
      res.status(404).json({ success: false, message: "No valid items found in the cart." });
    }

    // Save each transaction to the database before redirecting
    for (const listing of listings) {
      await Transaction.create({
        buyerID: customer.buyerID,
        sellerID: listing.userId,
        itemID: listing._id,
        tran_id,
        total_amount: listing.price,
        status: "pending",
      });
    }

    // Initialize the payment
    const apiResponse = await sslcz.init(paymentData);

    if (apiResponse.status === "SUCCESS" && apiResponse.GatewayPageURL) {
      res.status(200).json({ success: true, GatewayPageURL: apiResponse.GatewayPageURL });
    } else {
      res.status(400).json({ success: false, message: "Failed to initiate payment", error: apiResponse });
    }
  } catch (error) {
    console.error("Error in payment initiation:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get all transactions (admin only)
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get purchase history by buyerID
export const getPurchaseHistory = async (req: Request, res: Response) => {
  const { buyerId } = req.params;

  try {
    const transactions = await Transaction.find({ buyerID: buyerId });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get sell history by sellerID
export const getSellHistory = async (req: Request, res: Response) => {
  const { sellerId } = req.params;

  try {
    const transactions = await Transaction.find({ sellerID: sellerId });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error('Error fetching sell history:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


