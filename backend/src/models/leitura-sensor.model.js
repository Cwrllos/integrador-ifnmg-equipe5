import { prisma } from "../lib/prisma.js";

export async function salvarLeituraSensor(dadosSensor) {
  const sensorId = Number(dadosSensor.sensorId ?? dadosSensor.id_sensor);

  const sensor = await prisma.sensor.findUnique({
    where: {
      id_sensor: sensorId,
    },
    include: {
      ambiente: true,
    },
  });

  if (!sensor) {
    throw new Error("SENSOR_NAO_ENCONTRADO");
  }

  const leitura = await prisma.leitura.create({
    data: {
      tipo: sensor.tipo,
      id_sensor: sensor.id_sensor,
      id_ambiente: sensor.id_ambiente,
      origem: dadosSensor.origem ?? "API",
    },
  });

  return leitura;
}

export async function listarLeiturasSensor() {
  return prisma.leitura.findMany({
    orderBy: {
      data_hora: "desc",
    },
    include: {
      sensor: true,
      ambiente: true,
    },
  });
}

export async function buscarUltimaLeituraSensor() {
  return prisma.leitura.findFirst({
    orderBy: {
      data_hora: "desc",
    },
    include: {
      sensor: true,
      ambiente: true,
    },
  });
}

export async function listarLeiturasPorSensor(id_sensor) {
  return prisma.leitura.findMany({
    where: {
      id_sensor: Number(id_sensor),
    },
    orderBy: {
      data_hora: "desc",
    },
    include: {
      sensor: true,
      ambiente: true,
    },
  });
}