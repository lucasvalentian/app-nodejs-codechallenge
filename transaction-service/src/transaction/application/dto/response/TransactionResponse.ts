import { ResponseDto } from '../../../../common/application/dto/ResponseDto';
import { Transaction } from '../../../domain/entities/Transaction';

export interface TransactionResponse extends ResponseDto<Transaction> { }