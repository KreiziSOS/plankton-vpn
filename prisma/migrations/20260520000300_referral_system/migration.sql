ALTER TABLE "User" ADD COLUMN "bonusYearGranted" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "ReferralEarning" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amountTon" DECIMAL(20,9) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferralEarning_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ReferralEarning_paymentId_key" ON "ReferralEarning"("paymentId");
CREATE INDEX "ReferralEarning_userId_idx" ON "ReferralEarning"("userId");
CREATE INDEX "ReferralEarning_referralId_idx" ON "ReferralEarning"("referralId");
ALTER TABLE "ReferralEarning" ADD CONSTRAINT "ReferralEarning_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReferralEarning" ADD CONSTRAINT "ReferralEarning_referralId_fkey"
    FOREIGN KEY ("referralId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ReferralWithdrawal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amountTon" DECIMAL(20,9) NOT NULL,
    "walletAddr" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    CONSTRAINT "ReferralWithdrawal_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ReferralWithdrawal_userId_idx" ON "ReferralWithdrawal"("userId");
CREATE INDEX "ReferralWithdrawal_status_idx" ON "ReferralWithdrawal"("status");
ALTER TABLE "ReferralWithdrawal" ADD CONSTRAINT "ReferralWithdrawal_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
