-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "idDebit" TEXT NOT NULL,
    "idCredit" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idDebit_key" ON "Transaction"("idDebit");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idCredit_key" ON "Transaction"("idCredit");
