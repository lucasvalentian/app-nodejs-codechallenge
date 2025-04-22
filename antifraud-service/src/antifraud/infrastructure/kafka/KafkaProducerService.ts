import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { TransactionStatus } from '../../domain/entity/transactionEntity';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
    private kafka = new Kafka({
        clientId: 'antifraud-service',
        brokers: ['kafka:9092'],
    });

    private producer = this.kafka.producer({
        retry: {
            retries: 5,
            initialRetryTime: 300,
        },
    });

    constructor(
        @InjectMetric('antifraud_kafka_messages_sent_total') private readonly messagesSentCounter: Counter,
        @InjectMetric('antifraud_kafka_messages_failed_total') private readonly messagesFailedCounter: Counter,
        @InjectMetric('antifraud_kafka_message_send_duration_seconds') private readonly messageSendDuration: Histogram,
        @InjectMetric('antifraud_kafka_message_size_bytes') private readonly messageSizeHistogram: Histogram,
        @InjectMetric('antifraud_kafka_message_retries_total') private readonly messageRetriesCounter: Counter
    ) {
        console.log('Antifraud KafkaProducerService inicializado con métricas prefijadas');
    }

    async onModuleInit() {
        await this.producer.connect();
        console.log('Kafka Producer conectado');
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
        console.log('Kafka Producer desconectado');
    }

    async sendTransactionStatusUpdated(transactionId: string, status: TransactionStatus) {
        if (!transactionId || !status) {
            throw new Error('transactionId y status son requeridos');
        }

        const message = {
            topic: 'transaction.status-updated',
            messages: [
                {
                    key: transactionId,
                    value: JSON.stringify({ transactionId, status }),
                },
            ],
        };

        const messageSize = Buffer.byteLength(JSON.stringify(message.messages[0].value), 'utf-8');
        const end = this.messageSendDuration.startTimer();

        try {
            await this.sendWithRetries(message, 3); 
            this.messagesSentCounter.inc();
            this.messageSizeHistogram.observe(messageSize); 
            console.log(`Mensaje enviado a Kafka: ${JSON.stringify(message)}`);
        } catch (error) {
            this.messagesFailedCounter.inc();
            console.error(`Error al enviar mensaje a Kafka: ${error.message}`);
        } finally {
            end();
        }
    }

    private async sendWithRetries(message: any, retries: number) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                await this.producer.send(message);
                return; 
            } catch (error) {
                this.messageRetriesCounter.inc();
                console.warn(`Error al enviar mensaje. Intento ${attempt} de ${retries}: ${error.message}`);
                if (attempt < retries) {
                    await this.delay(1000 * attempt); 
                } else {
                    throw error; 
                }
            }
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
