import { TransactionRepository } from '../../../../src/antifraud/infrastructure/repository/transactionRepository';
import { Transaction, TransactionStatus } from '../../../../src/antifraud/domain/entity/transactionEntity';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;

  beforeEach(() => {
    repository = new TransactionRepository();
  });

  it('should save and retrieve transactions', async () => {
    const transaction = new Transaction('720251ea-77be-4100-b2fe-89664fe282ee', 500, TransactionStatus.PENDING);

    await repository.save(transaction);
    const transactions = await repository.findAll();

    expect(transactions).toHaveLength(1);
    expect(transactions[0]).toEqual(transaction);
  });
});
