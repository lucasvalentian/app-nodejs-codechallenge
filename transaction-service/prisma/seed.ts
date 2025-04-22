import { PrismaClient, Status } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('Iniciando el seed...');

    // Insertar en la tabla Transaction
    const transaction = await prisma.transaction.create({
        data: {
            idDebit: 'a1f4e567-b8f4-4d72-b3de-97b8e6d33a8d',
            idCredit: 'd1b5f423-458b-4b2d-a6f0-16e8c999a57d',
            typeId: 1,
            value: 1000,
            status: Status.PENDING,
        }
    });

    console.log('✅ Seed Transaction ejecutado correctamente');

    await prisma.failedEvent.create({
        data: {
            transactionId: transaction.id,
            error: 'Error en la transacción',
        }
    });

    console.log('✅ Seed FailedEvent ejecutado correctamente');
}

main()
    .catch(e => {
        console.error('❌ Error ejecutando seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
