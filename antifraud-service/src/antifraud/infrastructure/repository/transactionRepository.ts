import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entity/transactionEntity';

@Injectable()
export class TransactionRepository {
  private transactions: Transaction[] = [];

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactions;
}
}
