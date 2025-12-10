-- DropForeignKey
ALTER TABLE "TariffRegion" DROP CONSTRAINT "TariffRegion_tariffId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "telegramId" TEXT;

-- AddForeignKey
ALTER TABLE "TariffRegion" ADD CONSTRAINT "TariffRegion_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "Tariff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
