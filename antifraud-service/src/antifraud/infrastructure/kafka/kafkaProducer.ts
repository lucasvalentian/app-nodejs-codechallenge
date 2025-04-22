import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from '../../domain/entity/transactionEntity';

@Injectable()
export class KafkaProducer {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) { }

  sendTransaction(transaction: Transaction) {
    try {
      if (!transaction || !transaction.id || !transaction.status) {
        throw new Error('El objeto transaction no tiene el formato esperado');
      }
      this.kafkaClient.emit('transaction.status-updated', transaction);
    } catch (error) {
      console.error(`Error al enviar mensaje a Kafka: ${error.message}`);
    }

  }
}
