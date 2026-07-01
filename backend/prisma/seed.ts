import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10);

  const administrador = await prisma.administrador.upsert({
    where: {
      email: "admin@campus.edu.br",
    },
    update: {
      nome: "Administrador",
      senha: senhaHash,
      empresa: "IFNMG",
    },
    create: {
      nome: "Administrador",
      email: "admin@campus.edu.br",
      senha: senhaHash,
      empresa: "IFNMG",
    },
  });

  const ambiente = await prisma.ambiente.upsert({
    where: {
      id_ambiente: 1,
    },
    update: {
      nome: "Laboratório TADS",
      max_pessoas: 200,
      id_adm: administrador.id_adm,
    },
    create: {
      nome: "Laboratório TADS",
      max_pessoas: 200,
      id_adm: administrador.id_adm,
    },
  });

  await prisma.ocupacao.upsert({
    where: {
      id_ambiente: ambiente.id_ambiente,
    },
    update: {
      ocupacao_atual: 0,
    },
    create: {
      id_ambiente: ambiente.id_ambiente,
      ocupacao_atual: 0,
    },
  });

  const sensorEntrada = await prisma.sensor.upsert({
    where: {
      id_ambiente_tipo: {
        id_ambiente: ambiente.id_ambiente,
        tipo: "ENTRADA",
      },
    },
    update: {
      horario_inicio: "08:00",
      horario_fim: "22:00",
    },
    create: {
      tipo: "ENTRADA",
      horario_inicio: "08:00",
      horario_fim: "22:00",
      id_ambiente: ambiente.id_ambiente,
    },
  });

  const sensorSaida = await prisma.sensor.upsert({
    where: {
      id_ambiente_tipo: {
        id_ambiente: ambiente.id_ambiente,
        tipo: "SAIDA",
      },
    },
    update: {
      horario_inicio: "08:00",
      horario_fim: "22:00",
    },
    create: {
      tipo: "SAIDA",
      horario_inicio: "08:00",
      horario_fim: "22:00",
      id_ambiente: ambiente.id_ambiente,
    },
  });

  console.log("Seed executado com sucesso!");
  console.log("--------------------------------");
  console.log("Administrador:");
  console.log("Email: admin@campus.edu.br");
  console.log("Senha: 123456");
  console.log("--------------------------------");
  console.log(`Ambiente: ${ambiente.nome}`);
  console.log(`ID do ambiente: ${ambiente.id_ambiente}`);
  console.log("--------------------------------");
  console.log(`Sensor ENTRADA ID: ${sensorEntrada.id_sensor}`);
  console.log(`Sensor SAIDA ID: ${sensorSaida.id_sensor}`);
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });