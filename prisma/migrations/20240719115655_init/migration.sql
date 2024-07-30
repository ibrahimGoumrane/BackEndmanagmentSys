-- AlterTable
ALTER TABLE `task` ADD COLUMN `description` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `taskstatus` ADD COLUMN `projectId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `TaskStatus` ADD CONSTRAINT `TaskStatus_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
