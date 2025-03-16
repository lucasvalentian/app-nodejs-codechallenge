import { Test, TestingModule } from '@nestjs/testing';
import { TransactionAplicationService } from '../../../src/transaction/application/service/TransactionService';
import { TransactionDomianService } from '../../../src/transaction/domain/service/TransactionService';
import { TransactionProducer } from '../../../src/transaction/infraestructure/kafka/TransactionProducer';
import { Transaction } from 'src/transaction/domain/entities/Transaction';

describe('TransactionAplicationService', () => {
    let service: TransactionAplicationService;
    let domainService: TransactionDomianService;
    let producer: TransactionProducer;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionAplicationService,
                {
                    provide: TransactionDomianService,
                    useValue: {
                        saveTransaction: jest.fn(),
                        getTransaction: jest.fn(),
                    },
                },
                {
                    provide: TransactionProducer,
                    useValue: {
                        sendTransactionCreatedEvent: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TransactionAplicationService>(TransactionAplicationService);
        domainService = module.get<TransactionDomianService>(TransactionDomianService);
        producer = module.get<TransactionProducer>(TransactionProducer);
    });

    it('should save a transaction and produce an event', async () => {
        const transactionRequest = {
            accountExternalIdDebit: 'a1f4e567-b8f4-4d72-b3de-97b8e6d33a8t',
            accountExternalIdCredit: 'd1b5f423-458b-4b2d-a6f0-16e8c999a5y',
            tranferTypeId: 1,
            value: 1000,
        };

        const transactionResponse: Transaction  = {
            id: '30cffa6d-1726-47e8-8c83-b5aadd01e9ee',
            idDebit: 'a1f4e567-b8f4-4d72-b3de-97b8e6d33a8t',
            idCredit: 'd1b5f423-458b-4b2d-a6f0-16e8c999a5y',
            typeId: 1,
            value: 1000,
            status: 'PENDING',
            createdAt: new Date(),
        };

        jest.spyOn(domainService, 'saveTransaction').mockResolvedValue(transactionResponse);
        jest.spyOn(producer, 'sendTransactionCreatedEvent').mockResolvedValue();

        const result = await service.saveTransaction(transactionRequest);
        expect(result.data).toEqual(transactionResponse);
        expect(domainService.saveTransaction).toHaveBeenCalledWith(transactionRequest);
        expect(producer.sendTransactionCreatedEvent).toHaveBeenCalledWith(transactionResponse);
    });

    it('should get a transaction', async () => {
        const transactionId = '30cffa6d-1726-47e8-8c83-b5aadd01e9ee';
        const response = [
            {
                transactionExternalId: transactionId,
                transactionType: { name: 'Transfer' },
                transactionStatus: { name: 'COMPLETED' },
                value: 1000,
                createdAt: '2024-08-31T12:00:00Z',
            },
        ];

        jest.spyOn(domainService, 'getTransaction').mockResolvedValue(response);

        const result = await service.getTransaction({ transactionId });
        expect(result.data).toEqual(response);
        expect(domainService.getTransaction).toHaveBeenCalledWith({ transactionId });
    });
});
