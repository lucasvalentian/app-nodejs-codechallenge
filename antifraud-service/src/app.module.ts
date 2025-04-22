import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { KafkaConsumer } from './antifraud/infrastructure/controller/kafkaConsumer';
import { KafkaProducer } from './antifraud/infrastructure/kafka/kafkaProducer';
import { TransactionRepository } from './antifraud/infrastructure/repository/transactionRepository';
import { kafkaConfig } from './common/config/kafkaConfig';
import { ValidateTransactionUseCase } from './antifraud/application/usecases/transactionService';
import { KafkaProducerService } from './antifraud/infrastructure/kafka/KafkaProducerService';
import { PrometheusModule, makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ClientsModule.register([{ name: 'KAFKA_SERVICE', ...kafkaConfig }]),
    PrometheusModule.register(),
  ],
  controllers: [KafkaConsumer],
  providers: [
    KafkaProducer,
    TransactionRepository,
    ValidateTransactionUseCase,
    KafkaProducerService,
    makeCounterProvider({
      name: 'antifraud_kafka_messages_sent_total',
      help: 'Total de mensajes enviados exitosamente a Kafka en el contexto de antifraude',
    }),
    makeCounterProvider({
      name: 'antifraud_kafka_messages_failed_total',
      help: 'Total de mensajes fallidos al enviar a Kafka en el contexto de antifraude',
    }),
    makeHistogramProvider({
      name: 'antifraud_kafka_message_send_duration_seconds',
      help: 'Duración del envío de mensajes a Kafka en segundos en el contexto de antifraude',
      buckets: [0.1, 0.5, 1, 2, 5, 10],
    }),
    makeHistogramProvider({
      name: 'antifraud_kafka_message_size_bytes',
      help: 'Tamaño de los mensajes enviados a Kafka en bytes',
      buckets: [100, 500, 1000, 5000, 10000],
    }),
    makeCounterProvider({
      name: 'antifraud_kafka_message_retries_total',
      help: 'Total de reintentos realizados al enviar mensajes a Kafka en el contexto de antifraude',
    }),
    makeCounterProvider({
      name: 'antifraud_transactions_validated_total',
      help: 'Total de transacciones validadas',
    }),
    makeCounterProvider({
      name: 'antifraud_transactions_validation_errors_total',
      help: 'Total de errores durante la validación de transacciones',
    }),
  ],
})
export class AppModule { }
