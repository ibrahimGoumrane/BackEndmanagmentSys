/*
  Warnings:

  - You are about to drop the column `estimatedDuration` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projectmemberpermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `projectmemberpermission` DROP FOREIGN KEY `ProjectMemberPermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `projectmemberpermission` DROP FOREIGN KEY `ProjectMemberPermission_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `projectmemberpermission` DROP FOREIGN KEY `ProjectMemberPermission_userId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_statusId_fkey`;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `estimatedDuration`,
    MODIFY `statusId` INTEGER NULL DEFAULT 0,
    MODIFY `endDate` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `parentId`,
    MODIFY `statusId` INTEGER NULL;

-- DropTable
DROP TABLE `permission`;

-- DropTable
DROP TABLE `projectmemberpermission`;

-- DropTable
DROP TABLE `status`;

-- CreateTable
CREATE TABLE `ProjectStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    INDEX `ProjectStatus_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaskStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    INDEX `TaskStatus_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `ProjectStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `TaskStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
