import { ValidateTransactionUseCase } from '../../../src/antifraud/application/usecases/transactionService';
import { KafkaProducerService } from '../../../src/antifraud/infrastructure/kafka/kafkaProducerService';
import { Transaction, TransactionStatus } from '../../../src/antifraud/domain/entity/transactionEntity';
import { Counter } from 'prom-client';

describe('ValidateTransactionUseCase', () => {
    let validateTransactionUseCase: ValidateTransactionUseCase;
    let kafkaProducerServiceMock: KafkaProducerService;
    let transactionsValidatedCounterMock: Counter;
    let validationErrorsCounterMock: Counter;

    beforeEach(() => {        
        kafkaProducerServiceMock = {
            sendTransactionStatusUpdated: jest.fn(),
        } as any;

        transactionsValidatedCounterMock = {
            inc: jest.fn(),
        } as any;

        validationErrorsCounterMock = {
            inc: jest.fn(),
        } as any;

        
        validateTransactionUseCase = new ValidateTransactionUseCase(
            kafkaProducerServiceMock,
            transactionsValidatedCounterMock,
            validationErrorsCounterMock
        );
    });

    it('should reject transactions with value greater than 1500', async () => {
        const transaction = new Transaction('720251ea-77be-4100-b2fe-89664fe282ee', 1500, TransactionStatus.PENDING);

        await validateTransactionUseCase.execute(transaction);

        expect(kafkaProducerServiceMock.sendTransactionStatusUpdated).toHaveBeenCalledWith(
            '720251ea-77be-4100-b2fe-89664fe282ee',
            TransactionStatus.REJECTED
        );
        expect(transactionsValidatedCounterMock.inc).toHaveBeenCalled();
    });

    it('should accept transactions with value 1000 or less', async () => {
        const transaction = new Transaction('30cffa6d-1726-47e8-8c83-b5aadd01e9ee', 1000, TransactionStatus.PENDING);

        await validateTransactionUseCase.execute(transaction);

        expect(kafkaProducerServiceMock.sendTransactionStatusUpdated).toHaveBeenCalledWith(
            '30cffa6d-1726-47e8-8c83-b5aadd01e9ee',
            TransactionStatus.ACCEPTED
        );
        expect(transactionsValidatedCounterMock.inc).toHaveBeenCalled();
    });

    it('should increment validationErrorsCounter on error', async () => {
        const transaction = null;
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

        await validateTransactionUseCase.execute(transaction);

        expect(validationErrorsCounterMock.inc).toHaveBeenCalled();
        expect(kafkaProducerServiceMock.sendTransactionStatusUpdated).not.toHaveBeenCalled();


        consoleErrorMock.mockRestore();
    });
});