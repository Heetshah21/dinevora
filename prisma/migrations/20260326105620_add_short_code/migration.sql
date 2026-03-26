/*
  Warnings:

  - A unique constraint covering the columns `[shortCode]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "shortCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_shortCode_key" ON "Restaurant"("shortCode");
