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
}
