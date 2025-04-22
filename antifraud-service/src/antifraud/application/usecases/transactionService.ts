import { Injectable } from '@nestjs/common';
import { Transaction, TransactionStatus } from '../../domain/entity/transactionEntity';
import { KafkaProducerService } from 'antifraud/infrastructure/kafka/KafkaProducerService';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class ValidateTransactionUseCase {

  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    @InjectMetric('antifraud_transactions_validated_total') private readonly transactionsValidatedCounter: Counter,
    @InjectMetric('antifraud_transactions_validation_errors_total') private readonly validationErrorsCounter: Counter
  ) { }
  async execute(transaction: Transaction): Promise<void> {
    try {

      if (!transaction || !transaction.id || transaction.value === undefined) {
        throw new Error('El objeto transaction no tiene el formato esperado');
      }

      const status = transaction.value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.ACCEPTED;
      this.transactionsValidatedCounter.inc();
      await this.kafkaProducerService.sendTransactionStatusUpdated(transaction.id, status);
      console.log(
        `Transacción validada: ID=${transaction.id}, Valor=${transaction.value}, Estado=${status}`
      );
    } catch (error) {

      this.validationErrorsCounter.inc();
      console.error(`Error al validar la transacción: ${error.message}`);
    }
  }
}
