import { Injectable } from '@nestjs/common';
import CustomException from '../../../common/application/exception/CustomException';
import { EXCEPTION_MESSAGES } from '../../../common/application/exception/Constants';
import { HttpConstants } from '../../../common/constants/HttpConstants';
import { TransactionProducer } from '../../infraestructure/kafka/TransactionProducer';
import { TransactionDomianService } from '../../domain/service/TransactionService';
import { TransactionRequest } from '../dto/request/TransactionRequest';
import { TransactionResponse } from '../dto/response/TransactionResponse';
import { GetTransactionResponse } from '../dto/response/GetTransactionResponse';
import { GetTransactionRequest } from '../dto/request/GetTransactionRequest';

@Injectable()
export class TransactionAplicationService {
    constructor(private transactionDomainService: TransactionDomianService, private transactionProducer: TransactionProducer) { }

    async saveTransaction(transaction: TransactionRequest): Promise<TransactionResponse> {
        let attempts = 3;
        while (attempts > 0) {
            try {
                const response = await this.transactionDomainService.saveTransaction({
                    accountExternalIdDebit: transaction.accountExternalIdDebit,
                    accountExternalIdCredit: transaction.accountExternalIdCredit,
                    tranferTypeId: transaction.tranferTypeId,
                    value: transaction.value
                });

                await this.transactionProducer.sendTransactionCreatedEvent(response);

                return {
                    code: HttpConstants.OK.CODE,
                    message: HttpConstants.OK.MESSAGE,
                    data: response
                };

            } catch (exception) {
                console.error(`Error al intentar guardar la transacción. Intento ${3 - attempts + 1} de 3:`, exception.message);
                attempts--;
                if (attempts === 0) {
                    throw new CustomException({
                        code: exception.code,
                        message: EXCEPTION_MESSAGES.COULD_NOT_COMPLETE,
                        httpStatus: exception.httpCode,
                        details: exception.message,
                        exception
                    });
                }
                
                console.warn(`Reintentando guardar la transacción. Intentos restantes: ${attempts}`);
            }
        }
    }

    async getTransaction(transactionId: GetTransactionRequest): Promise<GetTransactionResponse> {
        try {
            const response = await this.transactionDomainService.getTransaction({
                transactionId: transactionId.transactionId
            });

            return {
                code: HttpConstants.OK.CODE,
                message: HttpConstants.OK.MESSAGE,
                data: response
            };

        } catch (exception) {
            throw new CustomException({
                code: exception.code,
                message: EXCEPTION_MESSAGES.COULD_NOT_COMPLETE,
                httpStatus: exception.httpCode,
                details: exception.message,
                exception
            });
        }
    }
}