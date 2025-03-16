import { ApiProperty } from '@nestjs/swagger';

export class TransactionRequest {
  
  @ApiProperty({ 
    example: 'abc123', 
    description: 'ID de la cuenta de débito' 
  })
  accountExternalIdDebit: string;

  @ApiProperty({ 
    example: 'xyz456', 
    description: 'ID de la cuenta de crédito' 
  })
  accountExternalIdCredit: string;

  @ApiProperty({ 
    example: 1, 
    description: 'Tipo de transferencia (ejemplo: 1 para transferencia interna, 2 para externa)' 
  })
  tranferTypeId: number;

  @ApiProperty({ 
    example: 100.50, 
    description: 'Monto de la transacción' 
  })
  value: number;
}
