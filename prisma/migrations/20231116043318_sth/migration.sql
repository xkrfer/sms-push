/*
  Warnings:

  - You are about to drop the column `headers` on the `Bot` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `Bot` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Bot` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Bot` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Bot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SMS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bot` DROP COLUMN `headers`,
    DROP COLUMN `method`,
    DROP COLUMN `status`,
    DROP COLUMN `url`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SMS` ADD COLUMN `userId` VARCHAR(191) NOT NULL;
