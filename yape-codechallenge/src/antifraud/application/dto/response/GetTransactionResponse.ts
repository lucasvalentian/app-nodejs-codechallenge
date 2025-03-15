import { ResponseDto } from '../../../../common/application/dto/ResponseDto';
import { TransactionResult } from '../../../domain/interface/TransactionResult';

export interface GetTransactionResponse extends ResponseDto<TransactionResult[]> { }