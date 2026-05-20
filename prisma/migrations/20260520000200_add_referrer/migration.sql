ALTER TABLE "User" ADD COLUMN "referrerId" TEXT;
ALTER TABLE "User" ADD COLUMN "referredAt" TIMESTAMP(3);
ALTER TABLE "User" ADD CONSTRAINT "User_referrerId_fkey"
  FOREIGN KEY ("referrerId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "User_referrerId_idx" ON "User"("referrerId");
