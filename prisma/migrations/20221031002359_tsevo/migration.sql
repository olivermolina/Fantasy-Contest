-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CC', 'ACH', 'Paypal', 'FTX', 'OTHERS');

-- AlterEnum
ALTER TYPE "AppSettingName" ADD VALUE 'REFERRAL_CREDIT_AMOUNT';

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceLocation" TEXT NOT NULL,
    "sessionRequestRaw" TEXT,
    "completeSessionRequestRaw" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionResponse" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "reasonCodes" TEXT NOT NULL,
    "sessionResponseRaw" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "statusMessage" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountProcess" DECIMAL(65,30) NOT NULL,
    "amountBonus" DECIMAL(65,30) NOT NULL,
    "transactionCurrency" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionStatus" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "statusMessage" TEXT,
    "transactionType" "TransactionType" NOT NULL,
    "transactionScore" DECIMAL(65,30) NOT NULL,
    "transactionMethod" TEXT NOT NULL,
    "transactionMethodType" "PaymentMethodType" NOT NULL,
    "transactionMethodAccount" TEXT NOT NULL,
    "approvalDateTime" TIMESTAMP(3) NOT NULL,
    "statusDateTime" TIMESTAMP(3) NOT NULL,
    "processDateTime" TIMESTAMP(3),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionResponse" ADD CONSTRAINT "SessionResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionStatus" ADD CONSTRAINT "TransactionStatus_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
