import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from '../../domain/entity/transactionEntity';

@Injectable()
export class KafkaProducer {
  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  sendTransaction(transaction: Transaction) {
    this.kafkaClient.emit('transaction.status-updated', transaction);
  }
}
