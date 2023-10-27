/*
  Warnings:

  - You are about to alter the column `price` on the `Products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(20,2)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Products` MODIFY `price` DOUBLE NOT NULL;
