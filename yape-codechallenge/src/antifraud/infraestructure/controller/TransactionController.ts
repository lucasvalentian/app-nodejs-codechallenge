import { Body, Controller, HttpException, Post, HttpCode } from '@nestjs/common';
import { TransactionAplicationService } from '../../application/service/TransactionService';
import { TransactionValidation } from '../../application/validation/TransactionValidation';
import { TransactionRequest } from '../../application/dto/request/TransactionRequest';

@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionAplicationService, private transactionValidation: TransactionValidation) { }

    @Post('')
    @HttpCode(201)
    async saveTransaction(@Body() transaction: any) {
        try {

            await this.transactionValidation.validateTransaction(transaction as TransactionRequest);
            return this.transactionService.saveTransaction(transaction as TransactionRequest);

        } catch (error) {
            throw new HttpException({
                code: error.code,
                message: error.message,
                details: error.details
            }, error.httpStatus);
        }
    }
}