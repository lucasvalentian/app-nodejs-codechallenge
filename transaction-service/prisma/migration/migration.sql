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
 

 CREATE UNIQUE INDEX "Transaction_id_key" ON "Transaction"("id");
 
 CREATE INDEX "Transaction_idDebit_index" ON "Transaction"("idDebit");
 
 CREATE INDEX "Transaction_idCredit_index" ON "Transaction"("idCredit");