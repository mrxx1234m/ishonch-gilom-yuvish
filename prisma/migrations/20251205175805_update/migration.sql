/*
  Warnings:

  - The values [MATRAS] on the enum `Services` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Services_new" AS ENUM ('GILAM', 'ODEYAL', 'PARDA', 'KORPACHA', 'MEBEL', 'BRUSCHATKA', 'BASSEYN', 'FASAD');
ALTER TABLE "Tariff" ALTER COLUMN "category" TYPE "Services_new" USING ("category"::text::"Services_new");
ALTER TYPE "Services" RENAME TO "Services_old";
ALTER TYPE "Services_new" RENAME TO "Services";
DROP TYPE "Services_old";
COMMIT;
