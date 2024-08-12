-- CreateTable
CREATE TABLE `Authorization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `moduleId` INTEGER NOT NULL,
    `moduleType` ENUM('TASK', 'PROJECT', 'TEAM') NOT NULL,
    `action` ENUM('DELETE', 'UPDATE', 'CREATE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Authorization_userId_idx`(`userId`),
    INDEX `Authorization_moduleId_moduleType_idx`(`moduleId`, `moduleType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Authorization` ADD CONSTRAINT `Authorization_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
