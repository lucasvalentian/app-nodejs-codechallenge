import { Body, Controller, HttpException, Post, HttpCode, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { TransactionAplicationService } from '../../application/service/TransactionService';
import { TransactionValidation } from '../../application/validation/TransactionValidation';
import { TransactionRequest } from '../../application/dto/request/TransactionRequest';
import { TransactionResponse } from '../../application/dto/response/TransactionResponse';
import { GetTransactionResponse } from 'src/transaction/application/dto/response/GetTransactionResponse';

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
    constructor(private transactionService: TransactionAplicationService, private transactionValidation: TransactionValidation) { }

    @Post('')
    @HttpCode(201)
    @ApiOperation({ summary: 'Registrar una transacción' })
    @ApiResponse({ status: 201, description: 'Transacción registrada con éxito', type: TransactionResponse })
    @ApiResponse({ status: 400, description: 'Solicitud inválida' })
    @ApiBody({ type: TransactionRequest })
    async saveTransaction(@Body() transaction: any) {
        console.log("🚀 ~ TransactionController ~ saveTransaction ~ transaction:", transaction)
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
    @ApiOperation({ summary: 'Obtener una transacción por ID' })
    @ApiResponse({ status: 200, description: 'Transacción encontrada', type: GetTransactionResponse })
    @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
    @ApiQuery({ name: 'transactionId', required: true, description: 'ID de la transacción' })
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