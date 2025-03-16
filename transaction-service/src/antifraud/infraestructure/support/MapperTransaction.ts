import { TransactionResult } from '../../domain/interface/TransactionResult';

export class MapperAffiliatePhotoSupport {
    public static mapGetTransactionResult(data: any[]): TransactionResult[] {

        const mapper = (element: any) => {
            return {
                transactionExternalId: element.id,
                transactionType: {
                    name: element.typeId,
                },
                transactionStatus: {
                    name: element.status,
                },
                value: element.value,
                createdAt: element.createdAt,
            };
        };

        return data.map(mapper);

    }
}
