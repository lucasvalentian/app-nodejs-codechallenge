import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { TransactionDomianService } from '../../domain/service/TransactionService';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class TransactionProducer implements OnModuleInit, OnModuleDestroy {
    private readonly kafka = new Kafka({
        clientId: 'transaction-service',
        brokers: ['kafka:9092'],
    });

    private readonly producer: Producer = this.kafka.producer({
        retry: {
            retries: 5,
            initialRetryTime: 300,
        },
    });

    private readonly eventQueue: Array<{ message: any; attempts: number }> = [];

    constructor(
        private readonly transactionDomainService: TransactionDomianService,
        @InjectMetric('kafka_events_sent_total') private readonly eventsSentCounter: Counter,
        @InjectMetric('kafka_events_failed_total') private readonly eventsFailedCounter: Counter,
        @InjectMetric('kafka_event_processing_duration_seconds') private readonly eventProcessingDuration: Histogram
    ) { }

    async onModuleInit() {
        await this.producer.connect();
        console.log('Kafka Producer conectado');
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
        console.log('Kafka Producer desconectado');
    }

    async sendTransactionCreatedEvent(transaction: {
        id: string;
        idDebit: string;
        idCredit: string;
        typeId: number;
        value: number;
        status: string;
    }) {
        const message = {
            topic: 'transaction.created',
            messages: [
                {
                    key: transaction.id,
                    value: JSON.stringify(transaction),
                },
            ],
        };

        this.eventQueue.push({ message, attempts: 3 });
        this.processQueue();
    }

    private async processQueue() {
        const promises = [];

        while (this.eventQueue.length > 0) {
            const { message, attempts } = this.eventQueue.shift();

            const promise = this.producer
                .send(message)
                .then(() => {
                    this.eventsSentCounter.inc();
                })
                .catch(async (error) => {
                    console.error('Error al enviar evento a Kafka:', error.message);

                    if (attempts > 1) {
                        this.eventQueue.push({ message, attempts: attempts - 1 });
                        console.warn(`Reintentando enviar el evento. Intentos restantes: ${attempts - 1}`);
                        await this.delay(1000);
                    } else {
                        console.error('No se pudo enviar el evento después de varios intentos.');
                        this.eventsFailedCounter.inc();
                        await this.transactionDomainService.saveFailedEvent(message.messages[0].key, error.message);
                    }
                });

            promises.push(promise);
        }

        const end = this.eventProcessingDuration.startTimer();
        await Promise.all(promises);
        end();
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
