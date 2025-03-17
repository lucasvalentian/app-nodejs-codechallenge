import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { TransactionStatus } from '../../domain/entity/transactionEntity';

@Injectable()
export class KafkaProducerService {
    private kafka = new Kafka({
        clientId: 'antifraud-service',
        brokers: ['kafka:9092'],
    });

    private producer = this.kafka.producer();

    async onModuleInit() {
        await this.producer.connect();
    }

    async sendTransactionStatusUpdated(transactionId: string, status: TransactionStatus) {
        const message = {
            topic: 'transaction.status-updated',
            messages: [
                {
                    key: transactionId,
                    value: JSON.stringify({ transactionId, status }),
                },
            ],
        };

        await this.producer.send(message);
    }
}
