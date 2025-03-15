import { Body, Controller, HttpException, Post, HttpCode, Get, Query } from '@nestjs/common';
import { TransactionAplicationService } from '../../application/service/TransactionService';
import { TransactionValidation } from '../../application/validation/TransactionValidation';
import { TransactionRequest } from '../../application/dto/request/TransactionRequest';
import { GetTransactionRequest } from 'src/antifraud/application/dto/request/GetTransactionRequest';

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

    @Get('')
    async getTransaction(@Query('transactionId') transactionId: string) {
   
        try {
            await this.transactionValidation.validateGetTransaction({ transactionId });
            return this.transactionService.getTransaction({ transactionId });


        } catch (error) {
            throw new HttpException({
                code: error.code,
                message: error.message,
                details: error.details
            }, error.httpStatus);
        }
    }
}