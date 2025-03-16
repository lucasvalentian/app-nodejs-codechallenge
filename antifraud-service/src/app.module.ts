import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { KafkaConsumer } from './antifraud/infrastructure/controller/kafkaConsumer';
import { KafkaProducer } from './antifraud/infrastructure/kafka/kafkaProducer';
import { TransactionRepository } from './antifraud/infrastructure/repository/transactionRepository';
import { kafkaConfig } from './common/config/kafkaConfig';
import { ValidateTransactionUseCase } from './antifraud/application/usecases/transactionService';
import { KafkaProducerService } from './antifraud/infrastructure/kafka/kafkaProducerService';

@Module({
  imports: [ClientsModule.register([{ name: 'KAFKA_SERVICE', ...kafkaConfig }])],
  controllers: [KafkaConsumer],
  providers: [KafkaProducer, TransactionRepository, ValidateTransactionUseCase,KafkaProducerService],
})
export class AppModule {}
