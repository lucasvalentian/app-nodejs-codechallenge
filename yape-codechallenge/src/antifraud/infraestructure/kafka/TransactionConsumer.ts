import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { TransactionProducer } from './TransactionProducer';
import { TransactionDomianService } from '../../domain/service/TransactionService';

@Injectable()
export class TransactionConsumer implements OnModuleInit {
    private kafka = new Kafka({
        clientId: 'antifraud-service',
        brokers: ['localhost:9092'],
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
            await this.consumer.subscribe({ topic: 'transaction.created', fromBeginning: false });

            await this.consumer.run({
                eachMessage: async ({ message }) => {
                    try {
                        const transaction = JSON.parse(message.value.toString());
                        console.log(`🔍 Procesando transacción: ${transaction.id}`);

                        const status = transaction.value > 1000 ? 'REJECTED' : 'ACCEPTED';
                        console.log(`🔄 Estado asignado: ${status}`);

                        await this.transactionDomainService.updateTransactionStatus(transaction.id, status);
                        console.log(`✅ Estado actualizado en la base de datos`);

                        await this.transactionProducer.sendTransactionStatusUpdate(transaction.id, status);
                    } catch (error) {
                        console.error(`❌ Error procesando mensaje: ${error.message}`);
                    }
                }
            });
        } catch (error) {
            console.error(`❌ Error al conectar el consumer: ${error.message}`);
            setTimeout(() => this.onModuleInit(), 5000); // Reintento cada 5 segundos
        }
    }
}
