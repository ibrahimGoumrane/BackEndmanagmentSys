/*
  Warnings:

  - You are about to drop the column `title` on the `task` table. All the data in the column will be lost.
  - Added the required column `name` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task` DROP COLUMN `title`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
