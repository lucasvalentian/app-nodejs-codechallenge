import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/db/methods/ConnectionPostgres';
import { TransactionRepository } from '../../domain/repository/TransactionRepository';
import { Transaction } from 'src/antifraud/domain/entities/Transaction';

@Injectable()
export class TransactionPrimaRepository implements TransactionRepository {
    private genericService: GenericService<'transaction'>;

    constructor() {
        this.genericService = new GenericService('transaction');
    }

    async saveTransaction(params: { 
        accountExternalIdDebit: string; 
        accountExternalIdCredit: string; 
        tranferTypeId: number; 
        value: number; 
    }): Promise<Transaction> {
        try {
            const newTransaction = await this.genericService.insert({
                idDebit: params.accountExternalIdDebit,
                idCredit: params.accountExternalIdCredit,
                typeId: params.tranferTypeId,
                value: params.value,
                status: 'PENDING'
            });

            if (!newTransaction.success) {
                throw new Error(newTransaction.error);
            }

            return newTransaction.data;
        } catch (error: any) {
            throw new Error(`Error al guardar la transacción: ${error.message}`);
        }
    }

    async getTransactionByAccountExternalId(accountExternalId: string): Promise<Transaction[]> {
        try {
            const transactions = await this.genericService.scan({
                OR: [
                    { idDebit: accountExternalId },
                    { idCredit: accountExternalId }
                ],
            });

            if (!transactions.success) {
                throw new Error(transactions.error);
            }

            return transactions.data;
        } catch (error: any) {
            throw new Error(`Error al obtener transacciones: ${error.message}`);
        }
    }
}
