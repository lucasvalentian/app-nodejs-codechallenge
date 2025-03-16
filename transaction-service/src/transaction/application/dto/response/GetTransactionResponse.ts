import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../../../common/application/dto/ResponseDto';
import { TransactionResult } from '../../../domain/interface/TransactionResult';

export class GetTransactionResponse extends ResponseDto<TransactionResult[]> {
  @ApiProperty({ type: [TransactionResult] })
  data: TransactionResult[];
}
