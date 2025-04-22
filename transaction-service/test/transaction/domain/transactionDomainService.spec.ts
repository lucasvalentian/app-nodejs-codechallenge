import { Test, TestingModule } from '@nestjs/testing';
import { TransactionDomianService } from '../../../src/transaction/domain/service/TransactionService';
import { TransactionRepository } from '../../../src/transaction/domain/repository/TransactionRepository';
import { Transaction } from '../../../src/transaction/domain/entities/Transaction';

describe('TransactionDomianService', () => {
    let service: TransactionDomianService;
    let repository: TransactionRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionDomianService,
                {
                    provide: 'TransactionRepository',
                    useValue: {
                        saveTransaction: jest.fn(),
                        getTransactionByAccountExternalId: jest.fn(),
                        updateTransactionStatus: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TransactionDomianService>(TransactionDomianService);
        repository = module.get<TransactionRepository>('TransactionRepository');
    });

    it('should save a transaction', async () => {
        const transactionData = {
            accountExternalIdDebit: 'a1f4e567-b8f4-4d72-b3de-97b8e6d33a8t',
            accountExternalIdCredit: 'd1b5f423-458b-4b2d-a6f0-16e8c999a5y',
            tranferTypeId: 1,
            value: 1000,
        };

        const expectedTransaction: Transaction = {
            id: '30cffa6d-1726-47e8-8c83-b5aadd01e9ee',
            idDebit: 'a1f4e567-b8f4-4d72-b3de-97b8e6d33a8t',
            idCredit: 'd1b5f423-458b-4b2d-a6f0-16e8c999a5y',
            typeId: 1,
            value: 1000,
            status: 'PENDING',
            createdAt: new Date(),
        };

        jest.spyOn(repository, 'saveTransaction').mockResolvedValue(expectedTransaction);

        const result = await service.saveTransaction(transactionData);
        expect(result).toEqual(expectedTransaction);
        expect(repository.saveTransaction).toHaveBeenCalledWith(transactionData);
    });

    it('should update transaction status', async () => {
        const transactionId = 'txn-001';
        const status = 'COMPLETED';

        jest.spyOn(repository, 'updateTransactionStatus').mockResolvedValue();

        await service.updateTransactionStatus(transactionId, status);
        expect(repository.updateTransactionStatus).toHaveBeenCalledWith(transactionId, status);
    });

    it('should get transactions by account ID', async () => {
        const transactionId = '30cffa6d-1726-47e8-8c83-b5aadd01e9ee';
        const transactions = [
            {
                transactionExternalId: '30cffa6d-1726-47e8-8c83-b5aadd01e9ee',
                transactionType: { name: 'Transfer' },
                transactionStatus: { name: 'PENDING' },
                value: 1000,
                createdAt: '2024-08-31T12:00:00Z',
            },
        ];

        jest.spyOn(repository, 'getTransactionByAccountExternalId').mockResolvedValue(transactions);

        const result = await service.getTransaction({ transactionId });
        expect(result).toEqual(transactions);
        expect(repository.getTransactionByAccountExternalId).toHaveBeenCalledWith(transactionId);
    });
});
