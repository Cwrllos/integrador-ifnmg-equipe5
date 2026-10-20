import { prisma } from "../lib/prisma.js";

export async function buscarDashboardAmbiente(idAmbiente) {
  const hoje = new Date();

  const inicioDoDia = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
    0,
    0,
    0
  );

  const fimDoDia = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
    23,
    59,
    59
  );

  const ambiente = await prisma.ambiente.findUnique({
    where: {
      id_ambiente: Number(idAmbiente),
    },
    include: {
      ocupacao: true,
    },
  });

  if (!ambiente) {
    throw new Error("AMBIENTE_NAO_ENCONTRADO");
  }

  const [entradasHoje, saidasHoje, alertasRecentes, ultimasLeituras] =
    await Promise.all([
      prisma.leitura.count({
        where: {
          id_ambiente: Number(idAmbiente),
          tipo: "ENTRADA",
          data_hora: {
            gte: inicioDoDia,
            lte: fimDoDia,
          },
        },
      }),

      prisma.leitura.count({
        where: {
          id_ambiente: Number(idAmbiente),
          tipo: "SAIDA",
          data_hora: {
            gte: inicioDoDia,
            lte: fimDoDia,
          },
        },
      }),

      prisma.logAlerta.findMany({
        where: {
          id_ambiente: Number(idAmbiente),
        },
        orderBy: {
          data_hora: "desc",
        },
        take: 5,
      }),

      prisma.leitura.findMany({
        where: {
          id_ambiente: Number(idAmbiente),
        },
        orderBy: {
          data_hora: "desc",
        },
        take: 10,
      }),
    ]);

  return {
    ambiente: {
      id_ambiente: ambiente.id_ambiente,
      nome: ambiente.nome,
      max_pessoas: ambiente.max_pessoas,
    },
    ocupacao_atual: ambiente.ocupacao?.ocupacao_atual ?? 0,
    entradas_hoje: entradasHoje,
    saidas_hoje: saidasHoje,
    alertas_recentes: alertasRecentes,
    ultimas_leituras: ultimasLeituras,
  };
}