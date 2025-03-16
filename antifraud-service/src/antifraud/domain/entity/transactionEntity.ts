import { IsNumber, IsString, IsEnum } from 'class-validator';

export enum TransactionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class Transaction {
  @IsString()
  id: string;

  @IsNumber()
  value: number;

  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  constructor(id: string, value: number, status: TransactionStatus) {
    this.id = id;
    this.value = value;
    this.status = status;
  }
}
