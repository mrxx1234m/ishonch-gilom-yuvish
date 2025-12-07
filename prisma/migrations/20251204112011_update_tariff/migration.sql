/*
  Warnings:

  - You are about to drop the column `region` on the `TariffRegion` table. All the data in the column will be lost.
  - Added the required column `regionId` to the `TariffRegion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TariffRegion" DROP COLUMN "region",
ADD COLUMN     "regionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Regions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Regions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TariffRegion" ADD CONSTRAINT "TariffRegion_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
