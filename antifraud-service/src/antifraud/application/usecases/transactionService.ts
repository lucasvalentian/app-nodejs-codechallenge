import { Injectable } from '@nestjs/common';
import { Transaction, TransactionStatus } from '../../domain/entity/transactionEntity';
import { KafkaProducerService } from '../../infrastructure/kafka/kafkaProducerService';

@Injectable()
export class ValidateTransactionUseCase {

  constructor(private readonly kafkaProducerService: KafkaProducerService) {}
  async execute(transaction: Transaction): Promise<void>  {
    const status = transaction.value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.ACCEPTED;
    await this.kafkaProducerService.sendTransactionStatusUpdated(transaction.id, status);
  }
}
