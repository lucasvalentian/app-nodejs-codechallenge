import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { TransactionProducer } from './TransactionProducer';
import { TransactionDomianService } from '../../domain/service/TransactionService';

@Injectable()
export class TransactionConsumer implements OnModuleInit {
    private kafka = new Kafka({
        clientId: 'antifraud-service',
        brokers: ['kafka:9092'],
    });

    private consumer = this.kafka.consumer({ groupId: 'antifraud-group' });

    constructor(
        private transactionProducer: TransactionProducer,
        private transactionDomainService: TransactionDomianService
    ) {}

    async onModuleInit() {
        try {
            await this.consumer.connect();
            console.log('Consumer conectado a Kafka');
            await this.consumer.subscribe({ topic: 'transaction.status-updated', fromBeginning: false });

            await this.consumer.run({
                eachMessage: async ({ message }) => {
                    try {
                        const { transactionId, status } = JSON.parse(message.value.toString());

                        await this.transactionDomainService.updateTransactionStatus(transactionId, status);
                    } catch (error) {
                        console.error(`Error procesando mensaje: ${error.message}`);
                    }
                }
            });
        } catch (error) {
            console.error(`Error al conectar el consumer: ${error.message}`);
            setTimeout(() => this.onModuleInit(), 5000);
        }
    }
}
