import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/db/methods/ConnectionPostgres';
import { TransactionRepository } from '../../domain/repository/TransactionRepository';
import { Transaction } from 'src/antifraud/domain/entities/Transaction';
import { TransactionResult } from 'src/antifraud/domain/interface/TransactionResult';
import { GenericRedisService } from '../../../common/redis/GenericRedisService';
import { MapperAffiliatePhotoSupport } from '../support/MapperTransaction';

@Injectable()
export class TransactionPrimaRepository implements TransactionRepository {
    private genericService: GenericService<'transaction'>;
    private redisService: GenericRedisService;

    constructor() {
        this.genericService = new GenericService('transaction');
        this.redisService = new GenericRedisService();
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

    async getTransactionByAccountExternalId(accountExternalId: string): Promise<TransactionResult[]> {

        try {
            const cachedTransactions = await this.redisService.get(accountExternalId);

            if (cachedTransactions.success && cachedTransactions.data) {
                return MapperAffiliatePhotoSupport.mapGetTransactionResult(cachedTransactions.data);
            }

            const transactions = await this.genericService.scan({
                OR: [
                    { idDebit: accountExternalId },
                    { idCredit: accountExternalId }
                ],
            });

            if (!transactions.success) {
                throw new Error(transactions.error);
            }

            return MapperAffiliatePhotoSupport.mapGetTransactionResult(transactions.data);
        } catch (error: any) {
            throw new Error(`Error al obtener transacciones: ${error.message}`);
        }
    }

    async updateTransactionStatus(transactionId: string, status: string): Promise<void> {
        try {
            const result = await this.genericService.update(transactionId, { status });

            if (!result.success) {
                throw new Error(`Error al actualizar la transacción: ${result.error}`);
            }

            console.log('Transacción actualizada con éxito:', result.data);
        } catch (error: any) {
            throw new Error(`Error al actualizar el estado de la transacción: ${error.message}`);
        }
    }

}
