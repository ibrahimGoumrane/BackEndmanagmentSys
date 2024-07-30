/*
  Warnings:

  - You are about to drop the column `skills` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `skills`;

-- CreateIndex
CREATE INDEX `User_name_idx` ON `User`(`name`);
