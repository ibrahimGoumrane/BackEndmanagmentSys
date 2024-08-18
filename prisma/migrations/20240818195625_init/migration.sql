-- DropForeignKey
ALTER TABLE `taskactivity` DROP FOREIGN KEY `TaskActivity_taskId_fkey`;

-- AddForeignKey
ALTER TABLE `TaskActivity` ADD CONSTRAINT `TaskActivity_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
