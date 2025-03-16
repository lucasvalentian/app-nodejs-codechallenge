import { Transaction } from '../entities/Transaction';
import { TransactionResult } from '../interface/TransactionResult';

export interface TransactionRepository {
    saveTransaction(params: { accountExternalIdDebit: string, accountExternalIdCredit: string, tranferTypeId: number, value: number }): Promise<Transaction>;
    getTransactionByAccountExternalId(accountExternalId: string): Promise<TransactionResult[]>;
    updateTransactionStatus(transactionId: string, status: string): Promise<void>;
}