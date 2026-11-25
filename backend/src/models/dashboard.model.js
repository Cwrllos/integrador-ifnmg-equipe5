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

  const inicioDoProximoDia = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate() + 1
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

  const [
  entradasHoje,
  saidasHoje,
  alertasRecentes,
  ultimasLeituras,
  leiturasHoje,
] = await Promise.all([
      prisma.leitura.count({
        where: {
          id_ambiente: Number(idAmbiente),
          tipo: "ENTRADA",
          data_hora: {
            gte: inicioDoDia,
            lt: inicioDoProximoDia,
          },
        },
      }),

      prisma.leitura.count({
        where: {
          id_ambiente: Number(idAmbiente),
          tipo: "SAIDA",
          data_hora: {
            gte: inicioDoDia,
            lt: inicioDoProximoDia,
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
      prisma.leitura.findMany({
  where: {
    id_ambiente: Number(idAmbiente),
    tipo: {
      in: ["ENTRADA", "SAIDA"],
    },
    data_hora: {
      gte: inicioDoDia,
      lt: inicioDoProximoDia,
    },
  },
  select: {
    tipo: true,
    data_hora: true,
  },
}),
    ]);

const movimentacaoPorHora = Array.from({ length: 24 }, (_, hora) => ({
  hora: `${String(hora).padStart(2, "0")}:00`,
  entradas: 0,
  saidas: 0,
}));

for (const leitura of leiturasHoje) {
  const hora = new Date(leitura.data_hora).getHours();

  if (leitura.tipo === "ENTRADA") {
    movimentacaoPorHora[hora].entradas++;
  } else if (leitura.tipo === "SAIDA") {
    movimentacaoPorHora[hora].saidas++;
  }
}

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
    movimentacao_por_hora: movimentacaoPorHora,
  };
}


export async function buscarOcupacaoPublica(idAmbiente) {
  const ambiente = await prisma.ambiente.findUnique({
    where: {
      id_ambiente: Number(idAmbiente),
    },
    include: {
      ocupacao: true,
    },
  });

  if (!ambiente) {
    return null;
  }

  const ocupacaoAtual = ambiente.ocupacao?.ocupacao_atual ?? 0;
  const capacidade = ambiente.max_pessoas;
  const vagasDisponiveis = Math.max(0, capacidade - ocupacaoAtual);

  const percentualOcupacao =
    capacidade > 0
      ? Math.round((ocupacaoAtual / capacidade) * 100)
      : 0;

  return {
    id_ambiente: ambiente.id_ambiente,
    nome: ambiente.nome,
    ocupacao_atual: ocupacaoAtual,
    capacidade_maxima: capacidade,
    vagas_disponiveis: vagasDisponiveis,
    percentual_ocupacao: percentualOcupacao,
  };
}
