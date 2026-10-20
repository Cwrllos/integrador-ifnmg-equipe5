import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function criarSensor(dados) {
  return await prisma.sensor.create({
    data: {
      entrada: dados.entrada || 0,
      saida: dados.saida || 0,
      horario_inicio: dados.horario_inicio,
      horario_fim: dados.horario_fim,
      id_ambiente: parseInt(dados.id_ambiente),
    },
  });
}