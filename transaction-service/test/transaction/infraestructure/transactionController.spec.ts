import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../../src/transaction/infraestructure/controller/TransactionController';
import { TransactionAplicationService } from '../../../src/transaction/application/service/TransactionService';
import { TransactionValidation } from '../../../src/transaction/application/validation/TransactionValidation';

describe('TransactionController', () => {
    let controller: TransactionController;
    let service: TransactionAplicationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionController],
            providers: [
                {
                    provide: TransactionAplicationService,
                    useValue: {
                        saveTransaction: jest.fn(),
                        getTransaction: jest.fn(),
                    },
                },
                {
                    provide: TransactionValidation,
                    useValue: {
                        validateTransaction: jest.fn(),
                        validateGetTransaction: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TransactionController>(TransactionController);
        service = module.get<TransactionAplicationService>(TransactionAplicationService);
    });

    it('should call saveTransaction', async () => {
        const transactionRequest = {
            accountExternalIdDebit: '123',
            accountExternalIdCredit: '456',
            tranferTypeId: 1,
            value: 100
        };

        const transactionResponse = {
            code: 200,
            message: "OK",
            data: {
                id: "30cffa6d-1726-47e8-8c83-b5aadd01e9ee",
                idDebit: "a1f4e567-b8f4-4d72-b3de-97b8e6d33a8t",
                idCredit: "d1b5f423-458b-4b2d-a6f0-16e8c999a5y",
                typeId: 1,
                value: 900,
                status: 'PENDING' as 'PENDING',
                createdAt: new Date("2025-03-16T18:16:38.111Z") 
            }
        };

        jest.spyOn(service, 'saveTransaction').mockResolvedValue(transactionResponse);

        const result = await controller.saveTransaction(transactionRequest);
        expect(result).toEqual(transactionResponse);
        expect(service.saveTransaction).toHaveBeenCalledWith(transactionRequest);
    });

    it('should call getTransaction', async () => {
        const transactionId = 'txn-001';
        const response = {
            code: 200,
            message: "Transaction retrieved successfully",
            data: [
                {
                    transactionExternalId: transactionId,
                    transactionType: { name: "TRANSFER" },
                    transactionStatus: { name: "REJECTED" },
                    value: 2000,
                    createdAt: "2025-03-15T00:32:20.426Z"
                }
            ]
        };

        jest.spyOn(service, 'getTransaction').mockResolvedValue(response);

        const result = await controller.getTransaction(transactionId);
        expect(result).toEqual(response);
        expect(service.getTransaction).toHaveBeenCalledWith({ transactionId });
    });
});
