import { Transaction } from '../entities/Transaction';

export interface TransactionRepository {
    saveTransaction(params: { accountExternalIdDebit: string, accountExternalIdCredit: string, tranferTypeId: number, value: number }): Promise<Transaction>
    getTransactionByAccountExternalId(accountExternalId: string): Promise<Transaction[]>
}