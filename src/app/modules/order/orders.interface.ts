import { ITransaction } from "./orders.model";

export interface ITransactionCreate {
  buyerID: string;  // ObjectId as string
  sellerID: string; // ObjectId as string
  itemID: string;   // ObjectId as string
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
}

export interface ITransactionUpdate {
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
}

export interface ITransactionResponse {
  success: boolean;
  transaction: ITransaction;
}
