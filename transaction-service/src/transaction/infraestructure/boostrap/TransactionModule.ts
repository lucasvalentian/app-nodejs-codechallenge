import { Module } from '@nestjs/common';
import { TransactionController } from '../controller/TransactionController';
import { TransactionAplicationService } from '../../application/service/TransactionService';
import { TransactionValidation } from '../../application/validation/TransactionValidation';
import { TransactionDomianService } from '../../domain/service/TransactionService';
import { TransactionPrimaRepository } from '../repository/TransactionPrimaRepository';
import { TransactionProducer } from '../kafka/TransactionProducer';
import { TransactionConsumer } from '../kafka/TransactionConsumer';
import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
    imports: [PrometheusModule.register()],
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
        makeCounterProvider({
            name: 'kafka_events_sent_total',
            help: 'Total de eventos enviados exitosamente a Kafka',
        }),
        makeCounterProvider({
            name: 'kafka_events_failed_total',
            help: 'Total de eventos fallidos al enviar a Kafka',
        }),
        makeHistogramProvider({
            name: 'kafka_event_processing_duration_seconds',
            help: 'Duración del procesamiento de eventos en segundos',
            buckets: [0.1, 0.5, 1, 2, 5, 10],
        }),

        makeCounterProvider({
            name: 'processed_messages_total',
            help: 'Total de mensajes procesados correctamente',
        }),
        makeCounterProvider({
            name: 'message_processing_errors_total',
            help: 'Total de errores al procesar mensajes',
        }),
        makeHistogramProvider({
            name: 'message_processing_duration_seconds',
            help: 'Duración del procesamiento de cada mensaje en segundos',
            buckets: [0.1, 0.5, 1, 2, 5, 10],
        }),
        makeCounterProvider({
            name: 'transactions_created_total',
            help: 'Total de transacciones creadas',
        }),
        makeCounterProvider({
            name: 'transactions_retrieved_total',
            help: 'Total de transacciones consultadas',
        }),
    ],
    exports: [TransactionConsumer, TransactionProducer],
})
export class TransactionModule { }
