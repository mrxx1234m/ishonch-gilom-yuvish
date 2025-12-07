/*
  Warnings:

  - Added the required column `category` to the `Tariff` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Services" AS ENUM ('GILAM', 'ODEYAL', 'MATRAS', 'PARDA');

-- AlterTable
ALTER TABLE "Tariff" ADD COLUMN     "category" "Services" NOT NULL;
