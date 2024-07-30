/*
  Warnings:

  - You are about to drop the column `AssigneId` on the `task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_AssigneId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `AssigneId`,
    ADD COLUMN `AssigneeId` INTEGER NULL,
    ADD COLUMN `parentTaskId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Task_AssigneeId_idx` ON `Task`(`AssigneeId`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_AssigneeId_fkey` FOREIGN KEY (`AssigneeId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_parentTaskId_fkey` FOREIGN KEY (`parentTaskId`) REFERENCES `Task`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
