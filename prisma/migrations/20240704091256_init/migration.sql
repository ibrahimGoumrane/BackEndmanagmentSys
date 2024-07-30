/*
  Warnings:

  - You are about to drop the column `teamId` on the `project` table. All the data in the column will be lost.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_teamId_fkey`;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `teamId`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `skills` VARCHAR(191) NULL;
