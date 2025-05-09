import { Injectable } from '@nestjs/common';
const Joi = require('joi');
import { TransactionRequest } from '../dto/request/TransactionRequest';
import { validate } from '../../../common/application/validation/Validator';
import { GetTransactionRequest } from '../dto/request/GetTransactionRequest';

@Injectable()
export class TransactionValidation {
    async validateTransaction(transaction: TransactionRequest) {
        const schema = Joi.object({
            accountExternalIdDebit: Joi.string().required(),
            accountExternalIdCredit: Joi.string().required(),
            tranferTypeId: Joi.number().required(),
            value: Joi.number().min(0.01).required(),
        }).custom((value, helpers) => {
            if (value.accountExternalIdDebit === value.accountExternalIdCredit) {
                return helpers.error('any.invalid', { message: 'Las cuentas de débito y crédito no pueden ser iguales.' });
            }
            return value;
        });

        await validate(schema, transaction);
    }

    async validateGetTransaction(transactionId: GetTransactionRequest) {
        const schema = Joi.object({
            transactionId: Joi.string().required()
        });

        await validate(schema, transactionId);
    }
}
