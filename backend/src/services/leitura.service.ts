import { prisma } from "../lib/prisma.js";

type OrigemLeitura = "API" | "SERIAL_USB";
type TipoLeitura = "ENTRADA" | "SAIDA";

type RegistrarLeituraDTO = {
  sensorId: number;
  tipoRecebido?: TipoLeitura;
  origem?: OrigemLeitura;
};

export async function registrarLeituraService({
  sensorId,
  tipoRecebido,
  origem = "API",
}: RegistrarLeituraDTO) {
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

    //if (!sensor.ativo) {
    //  throw new Error("SENSOR_INATIVO");
    //}

    if (tipoRecebido && tipoRecebido !== sensor.tipo) {
      throw new Error("TIPO_SENSOR_INVALIDO");
    }

    const leitura = await tx.leitura.create({
      data: {
        tipo: sensor.tipo,
        id_sensor: sensor.id_sensor,
        id_ambiente: sensor.id_ambiente,
        origem,
      },
    });

    const ocupacaoAtual = await tx.ocupacao.upsert({
      where: {
        id_ambiente: sensor.id_ambiente,
      },
      update: {},
      create: {
        id_ambiente: sensor.id_ambiente,
        ocupacao_atual: 0,
      },
    });

    const delta = sensor.tipo === "ENTRADA" ? 1 : -1;

    let novaOcupacao = ocupacaoAtual.ocupacao_atual + delta;

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
          alerta_seguranca: true,
          mensagem: `Lotação excedida em ${sensor.ambiente.nome}: ${novaOcupacao}/${sensor.ambiente.max_pessoas} pessoas.`,
        },
      });
    }

    return {
      leitura,
      ambiente: sensor.ambiente,
      ocupacao: ocupacaoAtualizada,
      alerta,
    };
  });
}

export async function listarLeiturasService(idAmbiente?: number) {
  return prisma.leitura.findMany({
    where: idAmbiente
      ? {
          id_ambiente: Number(idAmbiente),
        }
      : undefined,
    orderBy: {
      data_hora: "desc",
    },
    include: {
      sensor: true,
      ambiente: true,
    },
  });
}