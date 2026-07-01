-- CreateTable
CREATE TABLE `Administrador` (
    `id_adm` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `empresa` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Administrador_email_key`(`email`),
    PRIMARY KEY (`id_adm`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ambiente` (
    `id_ambiente` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `max_pessoas` INTEGER NOT NULL,
    `id_adm` INTEGER NOT NULL,

    PRIMARY KEY (`id_ambiente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sensor` (
    `id_sensor` INTEGER NOT NULL AUTO_INCREMENT,
    `entrada` INTEGER NOT NULL,
    `saida` INTEGER NOT NULL,
    `horario_inicio` VARCHAR(50) NOT NULL,
    `horario_fim` VARCHAR(50) NOT NULL,
    `id_ambiente` INTEGER NOT NULL,

    PRIMARY KEY (`id_sensor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leitura` (
    `id_leitura` INTEGER NOT NULL AUTO_INCREMENT,
    `entrada` INTEGER NOT NULL,
    `saida` INTEGER NOT NULL,
    `id_sensor` INTEGER NOT NULL,

    PRIMARY KEY (`id_leitura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogAlerta` (
    `id_log_alerta` INTEGER NOT NULL AUTO_INCREMENT,
    `alerta_seguranca` BOOLEAN NOT NULL,
    `mensagem` VARCHAR(255) NOT NULL,
    `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_sensor` INTEGER NOT NULL,

    PRIMARY KEY (`id_log_alerta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ambiente` ADD CONSTRAINT `Ambiente_id_adm_fkey` FOREIGN KEY (`id_adm`) REFERENCES `Administrador`(`id_adm`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sensor` ADD CONSTRAINT `Sensor_id_ambiente_fkey` FOREIGN KEY (`id_ambiente`) REFERENCES `Ambiente`(`id_ambiente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leitura` ADD CONSTRAINT `Leitura_id_sensor_fkey` FOREIGN KEY (`id_sensor`) REFERENCES `Sensor`(`id_sensor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogAlerta` ADD CONSTRAINT `LogAlerta_id_sensor_fkey` FOREIGN KEY (`id_sensor`) REFERENCES `Sensor`(`id_sensor`) ON DELETE RESTRICT ON UPDATE CASCADE;
