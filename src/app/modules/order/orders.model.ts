import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
  buyerID: mongoose.Types.ObjectId;
  sellerID: mongoose.Types.ObjectId;
  itemID: mongoose.Types.ObjectId;
  status: 'pending' | 'completed';
  timestamp: Date;
}

const transactionSchema = new Schema<ITransaction>({
  buyerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sellerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemID: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export { Transaction, ITransaction };
