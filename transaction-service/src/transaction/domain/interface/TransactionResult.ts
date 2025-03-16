import { ApiProperty } from '@nestjs/swagger';

export class TransactionResult {
  @ApiProperty({ example: 'abc123' })
  transactionExternalId: string;

  @ApiProperty({ example: { name: 'Transferencia Bancaria' } })
  transactionType: {
    name: string;
  };

  @ApiProperty({ example: { name: 'COMPLETED' } })
  transactionStatus: {
    name: string;
  };

  @ApiProperty({ example: 150.75 })
  value: number;

  @ApiProperty({ example: '2024-08-30T12:00:00Z' })
  createdAt: string;
}
