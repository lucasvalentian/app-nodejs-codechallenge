-- CreateTable
CREATE TABLE "FailedEvent" (
    "id" SERIAL NOT NULL,
    "transactionId" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FailedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FailedEvent_transactionId_idx" ON "FailedEvent"("transactionId");
