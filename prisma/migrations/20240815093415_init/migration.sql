/*
  Warnings:

  - The values [TASK] on the enum `Authorization_moduleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `authorization` MODIFY `moduleType` ENUM('PROJECT', 'TASKMANAGER', 'TEAM') NOT NULL;
