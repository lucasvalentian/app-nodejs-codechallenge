import { Injectable, Inject, Logger } from '@nestjs/common';
import { Transaction } from '../entities/Transaction';
import { TransactionRepository } from '../repository/TransactionRepository';
import { TransactionResult } from '../interface/TransactionResult';

@Injectable()
export class TransactionDomianService {
    constructor(
        @Inject('TransactionRepository') private transactionRepository: TransactionRepository,
    ) { }

    async saveTransaction(params: { accountExternalIdDebit: string, accountExternalIdCredit: string, tranferTypeId: number, value: number }): Promise<Transaction> {
        return this.transactionRepository.saveTransaction(params);
    }

    async updateTransactionStatus(transactionId: string, status: string): Promise<void> {
        return this.transactionRepository.updateTransactionStatus(transactionId, status);
    }

    async getTransaction(params: { transactionId: string }): Promise<TransactionResult[]> {
        const transactionId = params.transactionId;
        return this.transactionRepository.getTransactionByAccountExternalId(transactionId);
    }
    async saveFailedEvent(transactionId: string, error: string): Promise<void> {
        await this.transactionRepository.saveFailedTransaction({
            transactionId,
            error
        });
    }
}