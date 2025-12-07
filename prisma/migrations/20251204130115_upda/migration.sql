/*
  Warnings:

  - Added the required column `regionId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_regionId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "regionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "regionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
