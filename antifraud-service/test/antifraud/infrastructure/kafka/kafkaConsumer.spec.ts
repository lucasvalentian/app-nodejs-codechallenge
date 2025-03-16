import { KafkaConsumer } from '../../../../src/antifraud/infrastructure/controller/kafkaConsumer';
import { ValidateTransactionUseCase } from '../../../../src/antifraud/application/usecases/transactionService';
import { TransactionRepository } from '../../../../src/antifraud/infrastructure/repository/transactionRepository';
import { Transaction, TransactionStatus } from '../../../../src/antifraud/domain/entity/transactionEntity';

describe('KafkaConsumer', () => {
  let kafkaConsumer: KafkaConsumer;
  let validateTransactionUseCaseMock: ValidateTransactionUseCase;
  let transactionRepositoryMock: TransactionRepository;

  beforeEach(() => {
    validateTransactionUseCaseMock = { execute: jest.fn() } as any;
    transactionRepositoryMock = { save: jest.fn() } as any;

    kafkaConsumer = new KafkaConsumer(validateTransactionUseCaseMock, transactionRepositoryMock);
  });

  it('should process transaction and call use case', async () => {
    const transactionData = { id: '720251ea-77be-4100-b2fe-89664fe282ee', value: 500 };
    
    await kafkaConsumer.handleTransaction(transactionData);

    expect(transactionRepositoryMock.save).toHaveBeenCalled();
    expect(validateTransactionUseCaseMock.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '720251ea-77be-4100-b2fe-89664fe282ee',
        value: 500,
        status: TransactionStatus.PENDING,
      })
    );
  });
});
