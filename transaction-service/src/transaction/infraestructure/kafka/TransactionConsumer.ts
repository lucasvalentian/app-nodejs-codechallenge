import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { TransactionDomianService } from '../../domain/service/TransactionService';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class TransactionConsumer implements OnModuleInit, OnModuleDestroy {
    private kafka = new Kafka({
        clientId: 'antifraud-service',
        brokers: ['kafka:9092'],
    });

    private consumer = this.kafka.consumer({ groupId: 'antifraud-group' });

    constructor(
        private transactionDomainService: TransactionDomianService,
        @InjectMetric('processed_messages_total') private processedMessagesCounter: Counter,
        @InjectMetric('message_processing_errors_total') private messageProcessingErrorsCounter: Counter,
        @InjectMetric('message_processing_duration_seconds') private messageProcessingDuration: Histogram
    ) { }

    async onModuleInit() {
        try {
            await this.consumer.connect();
            console.log('Consumer conectado a Kafka');
            await this.consumer.subscribe({ topic: 'transaction.status-updated', fromBeginning: false });

            await this.consumer.run({
                eachBatch: async ({ batch }) => {
                    const promises = batch.messages.map(async (message) => {
                        await this.processMessageWithRetries(message, 3);
                    });

                    await Promise.all(promises);
                },
            });
        } catch (error) {
            console.error(`Error al conectar el consumer: ${error.message}`);
            setTimeout(() => this.onModuleInit(), 5000);
        }
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
        console.log('Consumer desconectado de Kafka');
    }

    private async processMessageWithRetries(message: any, retries: number) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this.processMessage(message);
                return;
            } catch (error) {
                console.warn(`Error procesando mensaje. Intento ${attempt} de ${retries}: ${error.message}`);
                if (attempt < retries) {
                    await this.delay(1000 * attempt);
                } else {
                    console.error('No se pudo procesar el mensaje después de varios intentos.');
                }
            }
        }
    }

    private async processMessage(message: any) {
        const end = this.messageProcessingDuration.startTimer();
        try {
            const parsedMessage = JSON.parse(message.value.toString());

            if (!parsedMessage.transactionId || !parsedMessage.status) {
                throw new Error('Mensaje inválido: faltan campos requeridos');
            }

            await this.transactionDomainService.updateTransactionStatus(parsedMessage.transactionId, parsedMessage.status);
            this.processedMessagesCounter.inc();
        } catch (error) {
            this.messageProcessingErrorsCounter.inc();
            console.error(`Error procesando mensaje: ${error.message}`);
            await this.transactionDomainService.saveFailedEvent(message.key?.toString() || 'unknown', error.message);
            throw error;
        } finally {
            end();
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
