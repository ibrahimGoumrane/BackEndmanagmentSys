-- AlterTable
ALTER TABLE `authorization` MODIFY `moduleType` ENUM('TASK', 'PROJECT', 'TASKMANAGER', 'TEAM') NOT NULL;
