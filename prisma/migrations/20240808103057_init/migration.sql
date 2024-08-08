-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `activity` DROP FOREIGN KEY `Activity_userId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_ManagerId_fkey`;

-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `projectmemberassociation` DROP FOREIGN KEY `ProjectMemberAssociation_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `projectmemberassociation` DROP FOREIGN KEY `ProjectMemberAssociation_userId_fkey`;

-- DropForeignKey
ALTER TABLE `projectteamassociation` DROP FOREIGN KEY `ProjectTeamAssociation_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `projectteamassociation` DROP FOREIGN KEY `ProjectTeamAssociation_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_AssigneeId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_parentTaskId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `taskstatus` DROP FOREIGN KEY `TaskStatus_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `Team_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `teammember` DROP FOREIGN KEY `TeamMember_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `teammember` DROP FOREIGN KEY `TeamMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userskill` DROP FOREIGN KEY `UserSkill_skillId_fkey`;

-- DropForeignKey
ALTER TABLE `userskill` DROP FOREIGN KEY `UserSkill_userId_fkey`;
