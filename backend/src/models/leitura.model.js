import { prisma } from "../lib/prisma.js";

export async function registrarLeitura({ sensorId, tipoRecebido }) {
  return prisma.$transaction(async (tx) => {
    const sensor = await tx.sensor.findUnique({
      where: {
        id_sensor: Number(sensorId),
      },
      include: {
        ambiente: true,
      },
    });

    if (!sensor) {
      throw new Error("SENSOR_NAO_ENCONTRADO");
    }

    if (tipoRecebido && tipoRecebido !== sensor.tipo) {
      throw new Error("TIPO_SENSOR_INVALIDO");
    }

    const tipo = sensor.tipo;

    const leitura = await tx.leitura.create({
      data: {
        tipo,
        id_sensor: sensor.id_sensor,
        id_ambiente: sensor.id_ambiente,
      },
    });

    let ocupacao = await tx.ocupacao.findUnique({
      where: {
        id_ambiente: sensor.id_ambiente,
      },
    });

    if (!ocupacao) {
      ocupacao = await tx.ocupacao.create({
        data: {
          id_ambiente: sensor.id_ambiente,
          ocupacao_atual: 0,
        },
      });
    }

    const delta = tipo === "ENTRADA" ? 1 : -1;

    let novaOcupacao = ocupacao.ocupacao_atual + delta;

    if (novaOcupacao < 0) {
      novaOcupacao = 0;
    }

    const ocupacaoAtualizada = await tx.ocupacao.update({
      where: {
        id_ambiente: sensor.id_ambiente,
      },
      data: {
        ocupacao_atual: novaOcupacao,
      },
    });

    let alerta = null;

    if (novaOcupacao > sensor.ambiente.max_pessoas) {
      alerta = await tx.logAlerta.create({
        data: {
          id_ambiente: sensor.id_ambiente,
          mensagem: `Lotação excedida no ambiente ${sensor.ambiente.nome}: ${novaOcupacao}/${sensor.ambiente.max_pessoas} pessoas.`,
          alerta_seguranca: true,
        },
      });
    }

    return {
      leitura,
      ocupacao: ocupacaoAtualizada,
      alerta,
      ambiente: sensor.ambiente,
    };
  });
}

export async function listarLeituras() {
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

export async function listarLeiturasPorAmbiente(idAmbiente) {
  return prisma.leitura.findMany({
    where: {
      id_ambiente: Number(idAmbiente),
    },
    orderBy: {
      data_hora: "desc",
    },
    include: {
      sensor: true,
    },
  });
}