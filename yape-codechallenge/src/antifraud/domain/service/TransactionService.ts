import { Injectable, Inject, Logger } from '@nestjs/common';
import { Transaction } from '../entities/Transaction';
import { TransactionRepository } from '../repository/TransactionRepository';

@Injectable()
export class TransactionDomianService {
    constructor(
        @Inject('TransactionRepository') private transactionRepository: TransactionRepository,
    ) { }

    async saveTransaction(params: { accountExternalIdDebit: string, accountExternalIdCredit: string, tranferTypeId: number, value: number }): Promise<Transaction> {
        return this.transactionRepository.saveTransaction(params);
    }
}