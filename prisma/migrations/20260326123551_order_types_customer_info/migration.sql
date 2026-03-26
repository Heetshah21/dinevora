-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "orderType" "OrderSource";

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "acceptsDelivery" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "acceptsDineIn" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "acceptsTakeaway" BOOLEAN NOT NULL DEFAULT true;
