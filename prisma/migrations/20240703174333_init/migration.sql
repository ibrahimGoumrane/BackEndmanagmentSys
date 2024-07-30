/*
  Warnings:

  - You are about to drop the column `userId` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `projectmemberassociation` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `teammember` table. All the data in the column will be lost.
  - Added the required column `ManagerId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AssigneId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `StoryPoint` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skills` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_userId_fkey`;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `userId`,
    ADD COLUMN `ManagerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `projectmemberassociation` DROP COLUMN `role`;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `AssigneId` INTEGER NOT NULL,
    ADD COLUMN `StoryPoint` VARCHAR(191) NOT NULL,
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `label` VARCHAR(191) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `teammember` DROP COLUMN `role`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `skills` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_ManagerId_fkey` FOREIGN KEY (`ManagerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_AssigneId_fkey` FOREIGN KEY (`AssigneId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
