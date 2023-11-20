-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `BotSMS` DROP FOREIGN KEY `BotSMS_botId_fkey`;

-- DropForeignKey
ALTER TABLE `BotSMS` DROP FOREIGN KEY `BotSMS_smsId_fkey`;

-- DropForeignKey
ALTER TABLE `LogDetail` DROP FOREIGN KEY `LogDetail_logId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `_BotSMS` DROP FOREIGN KEY `_BotSMS_A_fkey`;

-- DropForeignKey
ALTER TABLE `_BotSMS` DROP FOREIGN KEY `_BotSMS_B_fkey`;

-- AlterTable
ALTER TABLE `Bot` ADD COLUMN `rule` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SMS` ADD COLUMN `rule` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `BotSMS_smsId_idx` ON `BotSMS`(`smsId`);

-- RenameIndex
ALTER TABLE `Account` RENAME INDEX `Account_userId_fkey` TO `Account_userId_idx`;

-- RenameIndex
ALTER TABLE `BotSMS` RENAME INDEX `BotSMS_botId_fkey` TO `BotSMS_botId_idx`;

-- RenameIndex
ALTER TABLE `LogDetail` RENAME INDEX `LogDetail_logId_fkey` TO `LogDetail_logId_idx`;

-- RenameIndex
ALTER TABLE `Session` RENAME INDEX `Session_userId_fkey` TO `Session_userId_idx`;
