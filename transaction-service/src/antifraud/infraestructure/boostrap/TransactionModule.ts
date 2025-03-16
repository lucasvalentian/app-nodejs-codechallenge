import { Module } from '@nestjs/common';
import { TransactionController } from '../controller/TransactionController';
import { TransactionAplicationService } from '../../application/service/TransactionService';
import { TransactionValidation } from '../../application/validation/TransactionValidation';
import { TransactionDomianService } from '../../domain/service/TransactionService';
import { TransactionPrimaRepository } from '../repository/TransactionPrimaRepository';
import { TransactionProducer } from '../kafka/TransactionProducer';
import { TransactionConsumer } from '../kafka/TransactionConsumer';

@Module({
    controllers: [TransactionController],
    providers: [
        TransactionValidation,
        TransactionAplicationService,
        TransactionDomianService,
        TransactionProducer,
        TransactionConsumer,
        {
            provide: 'TransactionRepository',
            useClass: TransactionPrimaRepository,
        },
    ],
    exports: [TransactionConsumer, TransactionProducer], 
})
export class TransactionModule {}
