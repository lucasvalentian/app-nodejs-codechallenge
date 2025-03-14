export interface Transaction {
    id: string;
    idDebit: string;
    idCredit: string;
    typeId: number;
    value: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    createdAt: Date;
  }
  