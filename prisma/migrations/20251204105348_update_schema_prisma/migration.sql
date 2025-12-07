/*
  Warnings:

  - You are about to drop the column `pricePerM2` on the `Tariff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tariff" DROP COLUMN "pricePerM2";

-- CreateTable
CREATE TABLE "TariffRegion" (
    "id" SERIAL NOT NULL,
    "tariffId" INTEGER NOT NULL,
    "region" TEXT NOT NULL,
    "pricePerM2" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TariffRegion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TariffRegion" ADD CONSTRAINT "TariffRegion_tariffId_fkey" FOREIGN KEY ("tariffId") REFERENCES "Tariff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
