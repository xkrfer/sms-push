/*
  Warnings:

  - Added the required column `updated` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `SMS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bot` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `SMS` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated` DATETIME(3) NOT NULL;
