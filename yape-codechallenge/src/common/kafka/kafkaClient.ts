import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class TransactionProducer implements OnModuleInit {
    private kafka = new Kafka({
        clientId: 'transaction-service',
        brokers: ['localhost:9092'],
    });

    private producer = this.kafka.producer();

    async onModuleInit() {
        await this.producer.connect();
    }

    async sendTransactionCreated(transaction: any) {
        await this.producer.send({
            topic: 'transaction-created',
            messages: [{ value: JSON.stringify(transaction) }],
        });
    }
}
