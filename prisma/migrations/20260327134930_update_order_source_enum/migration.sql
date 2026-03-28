/*
  Warnings:

  - The values [ONLINE] on the enum `OrderSource` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderSource_new" AS ENUM ('IN_STORE', 'TAKEAWAY', 'DELIVERY', 'KIOSK');
ALTER TABLE "Order" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "source" TYPE "OrderSource_new" USING ("source"::text::"OrderSource_new");
ALTER TABLE "Order" ALTER COLUMN "orderType" TYPE "OrderSource_new" USING ("orderType"::text::"OrderSource_new");
ALTER TYPE "OrderSource" RENAME TO "OrderSource_old";
ALTER TYPE "OrderSource_new" RENAME TO "OrderSource";
DROP TYPE "OrderSource_old";
ALTER TABLE "Order" ALTER COLUMN "source" SET DEFAULT 'TAKEAWAY';
COMMIT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "source" SET DEFAULT 'TAKEAWAY';
