import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../../../../common/application/dto/ResponseDto';
import { Transaction } from '../../../domain/entities/Transaction';

export class TransactionResponse extends ResponseDto<Transaction> {
  @ApiProperty({ type: Transaction })
  data: Transaction;
}
