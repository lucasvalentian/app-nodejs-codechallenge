import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class GenericService<T extends keyof PrismaClient> {
    private model: PrismaClient[T];

    constructor(modelName: T) {
        this.model = prisma[modelName];
    }

    async insert(data: any) {
        try {
            const newRecord = await (this.model as any).create({ data });
            return { success: true, data: newRecord };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    async obtain(id: string) {
        try {
            const record = await (this.model as any).findUnique({ where: { id } });

            if (!record) {
                return { success: false, error: 'Record not found' };
            }

            return { success: true, data: record };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    async scan(where: any = {}) {
        try {
            const records = await (this.model as any).findMany({ where });
            return { success: true, data: records };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }

    async update(id: string, data: any) {
        try {
            const updatedRecord = await (this.model as any).update({
                where: { id },
                data,
            });

            return { success: true, data: updatedRecord };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }
}
