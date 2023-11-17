/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Bot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `SMS` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Bot_name_key` ON `Bot`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `SMS_name_key` ON `SMS`(`name`);
