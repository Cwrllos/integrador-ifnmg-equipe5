/*
  Warnings:

  - You are about to drop the `Administrador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ambiente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Leitura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LogAlerta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sensor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Ambiente` DROP FOREIGN KEY `Ambiente_id_adm_fkey`;

-- DropForeignKey
ALTER TABLE `Leitura` DROP FOREIGN KEY `Leitura_id_sensor_fkey`;

-- DropForeignKey
ALTER TABLE `LogAlerta` DROP FOREIGN KEY `LogAlerta_id_sensor_fkey`;

-- DropForeignKey
ALTER TABLE `Sensor` DROP FOREIGN KEY `Sensor_id_ambiente_fkey`;

-- DropTable
DROP TABLE `Administrador`;

-- DropTable
DROP TABLE `Ambiente`;

-- DropTable
DROP TABLE `Leitura`;

-- DropTable
DROP TABLE `LogAlerta`;

-- DropTable
DROP TABLE `Sensor`;

-- CreateTable
CREATE TABLE `administradores` (
    `id_adm` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `empresa` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `administradores_email_key`(`email`),
    PRIMARY KEY (`id_adm`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ambientes` (
    `id_ambiente` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `max_pessoas` INTEGER NOT NULL,
    `id_adm` INTEGER NOT NULL,

    PRIMARY KEY (`id_ambiente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sensores` (
    `id_sensor` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('ENTRADA', 'SAIDA') NOT NULL,
    `horario_inicio` VARCHAR(191) NULL,
    `horario_fim` VARCHAR(191) NULL,
    `id_ambiente` INTEGER NOT NULL,

    UNIQUE INDEX `sensores_id_ambiente_tipo_key`(`id_ambiente`, `tipo`),
    PRIMARY KEY (`id_sensor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leituras` (
    `id_leitura` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` ENUM('ENTRADA', 'SAIDA') NOT NULL,
    `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_sensor` INTEGER NOT NULL,
    `id_ambiente` INTEGER NOT NULL,

    INDEX `leituras_id_sensor_idx`(`id_sensor`),
    INDEX `leituras_id_ambiente_idx`(`id_ambiente`),
    INDEX `leituras_data_hora_idx`(`data_hora`),
    PRIMARY KEY (`id_leitura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ocupacoes` (
    `id_ocupacao` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ambiente` INTEGER NOT NULL,
    `ocupacao_atual` INTEGER NOT NULL DEFAULT 0,
    `ultima_atualizacao` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ocupacoes_id_ambiente_key`(`id_ambiente`),
    PRIMARY KEY (`id_ocupacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs_alertas` (
    `id_alerta` INTEGER NOT NULL AUTO_INCREMENT,
    `alerta_seguranca` BOOLEAN NOT NULL DEFAULT true,
    `mensagem` VARCHAR(191) NOT NULL,
    `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_ambiente` INTEGER NOT NULL,

    INDEX `logs_alertas_id_ambiente_idx`(`id_ambiente`),
    PRIMARY KEY (`id_alerta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ambientes` ADD CONSTRAINT `ambientes_id_adm_fkey` FOREIGN KEY (`id_adm`) REFERENCES `administradores`(`id_adm`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sensores` ADD CONSTRAINT `sensores_id_ambiente_fkey` FOREIGN KEY (`id_ambiente`) REFERENCES `ambientes`(`id_ambiente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leituras` ADD CONSTRAINT `leituras_id_sensor_fkey` FOREIGN KEY (`id_sensor`) REFERENCES `sensores`(`id_sensor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `leituras` ADD CONSTRAINT `leituras_id_ambiente_fkey` FOREIGN KEY (`id_ambiente`) REFERENCES `ambientes`(`id_ambiente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ocupacoes` ADD CONSTRAINT `ocupacoes_id_ambiente_fkey` FOREIGN KEY (`id_ambiente`) REFERENCES `ambientes`(`id_ambiente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs_alertas` ADD CONSTRAINT `logs_alertas_id_ambiente_fkey` FOREIGN KEY (`id_ambiente`) REFERENCES `ambientes`(`id_ambiente`) ON DELETE RESTRICT ON UPDATE CASCADE;
