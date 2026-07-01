import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function registrarAlerta(dadosAlerta) {
  return await prisma.logAlerta.create({
    data: {
      alerta_seguranca: true,
      mensagem: dadosAlerta.mensagem,
      id_sensor: parseInt(dadosAlerta.id_sensor),
    },
  });
}