ALTER TABLE "User" ADD COLUMN "refCode" TEXT;

CREATE UNIQUE INDEX "User_refCode_key" ON "User"("refCode");
