import { ApiProperty } from '@nestjs/swagger';

export class Transaction {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'abc123' })
  idDebit: string;

  @ApiProperty({ example: 'xyz456' })
  idCredit: string;

  @ApiProperty({ example: 1 })
  typeId: number;

  @ApiProperty({ example: 100.50 })
  value: number;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'COMPLETED', 'FAILED'] })
  status: 'PENDING' | 'COMPLETED' | 'FAILED';

  @ApiProperty({ example: '2024-08-30T12:00:00Z' })
  createdAt: Date;
}
