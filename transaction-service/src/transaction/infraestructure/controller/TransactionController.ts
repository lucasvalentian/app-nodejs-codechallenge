import { Body, Controller, HttpException, Post, HttpCode, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { TransactionAplicationService } from '../../application/service/TransactionService';
import { TransactionValidation } from '../../application/validation/TransactionValidation';
import { TransactionRequest } from '../../application/dto/request/TransactionRequest';
import { TransactionResponse } from '../../application/dto/response/TransactionResponse';
import { GetTransactionResponse } from '../../application/dto/response/GetTransactionResponse';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@ApiTags('Transactions')
@Controller('transaction')
export class TransactionController {
    private readonly logger = new Logger(TransactionController.name);

    constructor(
        private transactionService: TransactionAplicationService,
        private transactionValidation: TransactionValidation,
        @InjectMetric('transactions_created_total') private readonly transactionsCreatedCounter: Counter,
        @InjectMetric('transactions_retrieved_total') private readonly transactionsRetrievedCounter: Counter
    ) { }

    @Post('')
    @HttpCode(201)
    @ApiOperation({ summary: 'Registrar una transacción' })
    @ApiResponse({ status: 201, description: 'Transacción registrada con éxito', type: TransactionResponse })
    @ApiResponse({ status: 400, description: 'Solicitud inválida' })
    @ApiBody({ type: TransactionRequest })
    async saveTransaction(@Body() transaction: TransactionRequest): Promise<TransactionResponse> {
        this.logger.log('Iniciando registro de transacción');
        try {
            await this.transactionValidation.validateTransaction(transaction);
            const response = await this.transactionService.saveTransaction(transaction);

            this.transactionsCreatedCounter.inc();
            return response;
        } catch (error) {
            this.logger.error(`Error al registrar transacción: ${error.message}`, error.stack);
            throw new HttpException(
                {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                },
                error.httpStatus
            );
        }
    }

    @Get('')
    @ApiOperation({ summary: 'Obtener una transacción por ID' })
    @ApiResponse({ status: 200, description: 'Transacción encontrada', type: GetTransactionResponse })
    @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
    @ApiQuery({ name: 'transactionId', required: true, description: 'ID de la transacción' })
    async getTransaction(@Query('transactionId') transactionId: string): Promise<GetTransactionResponse> {
        this.logger.log(`Iniciando consulta de transacción con ID: ${transactionId}`);
        try {
            await this.transactionValidation.validateGetTransaction({ transactionId });
            const response = await this.transactionService.getTransaction({ transactionId });

            
            this.transactionsRetrievedCounter.inc();
            return response;
        } catch (error) {
            this.logger.error(`Error al consultar transacción: ${error.message}`, error.stack);
            throw new HttpException(
                {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                },
                error.httpStatus
            );
        }
    }
}