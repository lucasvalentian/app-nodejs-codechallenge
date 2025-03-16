import { Controller } from '@nestjs/common';
import {  MessagePattern, Payload } from '@nestjs/microservices';
import { Transaction, TransactionStatus } from '../../domain/entity/transactionEntity';
import { ValidateTransactionUseCase } from '../../application/usecases/transactionService';
import { TransactionRepository } from '../repository/transactionRepository';


@Controller()
export class KafkaConsumer {
  constructor(
    private readonly validateTransactionUseCase: ValidateTransactionUseCase,
    private readonly transactionRepository: TransactionRepository
  ) {}

  @MessagePattern('transaction.created')
  async handleTransaction(@Payload() transactionData: any) {
    try {
      const transaction = new Transaction(
        transactionData.id,
        transactionData.value,
        TransactionStatus.PENDING
      );

      await this.transactionRepository.save(transaction);

      await this.validateTransactionUseCase.execute(transaction);
    } catch (error) {
      console.error(`Error procesando transacción: ${error.message}`);
    }
  }
}