import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/db/methods/ConnectionPostgres';
import { TransactionRepository } from '../../domain/repository/TransactionRepository';
//import { Transaction } from 'src/transaction/domain/entities/Transaction';
import { Transaction } from '../../domain/entities/Transaction';
//import { TransactionResult } from 'src/transaction/domain/interface/TransactionResult';
import { TransactionResult } from '../../domain/interface/TransactionResult';
import { GenericRedisService } from '../../../common/redis/GenericRedisService';
import { MapperAffiliatePhotoSupport } from '../support/MapperTransaction';
import { statusCode } from './util/Constans';
//import { FailedEvent } from 'src/transaction/domain/interface/FailedEvent';
import { FailedEvent } from '../../domain/interface/FailedEvent';

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
                status: statusCode.PENDING,
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
                    { id: accountExternalId },
                    { idDebit: accountExternalId },
                    { idCredit: accountExternalId }
                ],
            });

            if (!transactions.success) {
                throw new Error(transactions.error);
            }

            await this.redisService.set(accountExternalId, transactions.data);

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

            await this.redisService.del(transactionId);
            console.log('Transacción actualizada con éxito:', result.data);
        } catch (error: any) {
            throw new Error(`Error al actualizar el estado de la transacción: ${error.message}`);
        }
    }

    async saveFailedTransaction(failedEvent: FailedEvent): Promise<void> {
        const failedEventService = new GenericService<'failedEvent'>('failedEvent');

        try {
            const result = await failedEventService.insert({
                transactionId: failedEvent.transactionId,
                error: failedEvent.error
            });

            if (!result.success) {
                throw new Error(`Error al guardar el evento fallido: ${result.error}`);
            }

            console.log('Evento fallido guardado con éxito:', result.data);
        } catch (error: any) {
            throw new Error(`Error al guardar el evento fallido: ${error.message}`);
        }
    }

}
