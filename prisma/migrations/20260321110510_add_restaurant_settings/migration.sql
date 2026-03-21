-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "servicePercent" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "taxPercent" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "upiId" TEXT;
