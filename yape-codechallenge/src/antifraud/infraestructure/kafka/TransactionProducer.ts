import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class TransactionProducer implements OnModuleInit {
    private readonly kafka = new Kafka({
        clientId: 'transaction-service',
        brokers: ['localhost:9092'],
    });

    private readonly producer = this.kafka.producer();

    async onModuleInit() {
        await this.producer.connect();
        console.log('Kafka Producer conectado');
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

        await this.producer.send(message);
        console.log('Evento enviado a Kafka:', message);
    }

    async sendTransactionStatusUpdate(transactionId: string, status: string) {
        let attempts = 0;
        const maxRetries = 5;

        while (attempts < maxRetries) {
            try {
                await this.producer.connect();
                await this.producer.send({
                    topic: 'transaction.status-updated',
                    messages: [{ key: transactionId, value: JSON.stringify({ transactionId, status }) }]
                });

                console.log(`Estado de transacción actualizado y enviado a Kafka: ${JSON.stringify({ transactionId, status })}`);
                break;

            } catch (error) {
                console.error(`Error enviando mensaje a Kafka (intento ${attempts + 1}):`, error);
                attempts++;
                await new Promise(res => setTimeout(res, 5000));
            }
        }
    }
}
