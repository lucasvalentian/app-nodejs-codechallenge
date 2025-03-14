export interface TransactionResult {
    transactionExternalId: string;
    transactionType: {
      name: string;
    };
    transactionStatus: {
      name: string;
    };
    value: number;
    createdAt: string;
  }
  