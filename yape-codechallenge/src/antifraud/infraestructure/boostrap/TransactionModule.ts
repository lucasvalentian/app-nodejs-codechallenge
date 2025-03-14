import { Module } from '@nestjs/common';
import { TransactionController } from '../controller/TransactionController';
import { TransactionAplicationService } from '../../application/service/TransactionService';
import { TransactionValidation } from '../../application/validation/TransactionValidation';
import { TransactionDomianService } from '../../domain/service/TransactionService';
import { TransactionPrimaRepository } from '../repository/TransactionPrimaRepository';

@Module({
    controllers: [TransactionController],
    providers: [
        TransactionValidation,
        TransactionAplicationService,
        TransactionDomianService,
        {
            provide: 'TransactionRepository',
            useClass: TransactionPrimaRepository
        }],
})

export class TransactionModule { }
