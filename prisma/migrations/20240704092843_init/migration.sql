-- CreateIndex
CREATE INDEX `Permission_value_idx` ON `Permission`(`value`);

-- CreateIndex
CREATE INDEX `Project_name_idx` ON `Project`(`name`);

-- CreateIndex
CREATE INDEX `Status_name_idx` ON `Status`(`name`);

-- CreateIndex
CREATE INDEX `Team_name_idx` ON `Team`(`name`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- CreateIndex
CREATE INDEX `User_password_idx` ON `User`(`password`);

-- RenameIndex
ALTER TABLE `activity` RENAME INDEX `Activity_taskId_fkey` TO `Activity_taskId_idx`;

-- RenameIndex
ALTER TABLE `activity` RENAME INDEX `Activity_userId_fkey` TO `Activity_userId_idx`;

-- RenameIndex
ALTER TABLE `comment` RENAME INDEX `Comment_taskId_fkey` TO `Comment_taskId_idx`;

-- RenameIndex
ALTER TABLE `comment` RENAME INDEX `Comment_userId_fkey` TO `Comment_userId_idx`;

-- RenameIndex
ALTER TABLE `projectmemberassociation` RENAME INDEX `ProjectMemberAssociation_projectId_fkey` TO `ProjectMemberAssociation_projectId_idx`;

-- RenameIndex
ALTER TABLE `projectmemberassociation` RENAME INDEX `ProjectMemberAssociation_userId_fkey` TO `ProjectMemberAssociation_userId_idx`;

-- RenameIndex
ALTER TABLE `projectmemberpermission` RENAME INDEX `ProjectMemberPermission_permissionId_fkey` TO `ProjectMemberPermission_permissionId_idx`;

-- RenameIndex
ALTER TABLE `projectmemberpermission` RENAME INDEX `ProjectMemberPermission_projectId_fkey` TO `ProjectMemberPermission_projectId_idx`;

-- RenameIndex
ALTER TABLE `projectmemberpermission` RENAME INDEX `ProjectMemberPermission_userId_fkey` TO `ProjectMemberPermission_userId_idx`;

-- RenameIndex
ALTER TABLE `projectteamassociation` RENAME INDEX `ProjectTeamAssociation_projectId_fkey` TO `ProjectTeamAssociation_projectId_idx`;

-- RenameIndex
ALTER TABLE `projectteamassociation` RENAME INDEX `ProjectTeamAssociation_teamId_fkey` TO `ProjectTeamAssociation_teamId_idx`;

-- RenameIndex
ALTER TABLE `task` RENAME INDEX `Task_AssigneId_fkey` TO `Task_AssigneId_idx`;

-- RenameIndex
ALTER TABLE `task` RENAME INDEX `Task_statusId_fkey` TO `Task_statusId_idx`;

-- RenameIndex
ALTER TABLE `teammember` RENAME INDEX `TeamMember_teamId_fkey` TO `TeamMember_teamId_idx`;

-- RenameIndex
ALTER TABLE `teammember` RENAME INDEX `TeamMember_userId_fkey` TO `TeamMember_userId_idx`;
