/*
  Warnings:

  - Added the required column `smsName` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `botId` to the `LogDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Log` ADD COLUMN `smsName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `LogDetail` ADD COLUMN `botId` INTEGER NOT NULL;
