/*
  Warnings:

  - You are about to drop the column `description` on the `activity` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `activity` table. All the data in the column will be lost.
  - Added the required column `activityType` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_taskId_fkey`;

-- AlterTable
ALTER TABLE `activity` DROP COLUMN `description`,
    DROP COLUMN `taskId`,
    ADD COLUMN `activityType` ENUM('CREATE', 'DELETE', 'UPDATE', 'JOIN', 'LEAVE') NOT NULL,
    ADD COLUMN `newValue` VARCHAR(191) NULL,
    ADD COLUMN `oldValue` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Activity_userId_id_idx` ON `Activity`(`userId`, `id`);
