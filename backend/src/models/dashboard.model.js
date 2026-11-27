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
// RELATÓRIO SEMANAL
export async function buscarDashboardSemanal(idAmbiente) {
  const id = Number(idAmbiente);

  const ambiente = await prisma.ambiente.findUnique({
    where: { id_ambiente: id },
  });

  if (!ambiente) {
    throw new Error("AMBIENTE_NAO_ENCONTRADO");
  }

  const hoje = new Date();

  // Segunda-feira da semana atual
  const inicioSemana = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate()
  );

  const diaSemana = (inicioSemana.getDay() + 6) % 7;
  inicioSemana.setDate(inicioSemana.getDate() - diaSemana);

  // Segunda-feira da próxima semana
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(fimSemana.getDate() + 7);

  const leituras = await prisma.leitura.findMany({
    where: {
      id_ambiente: id,
      tipo: {
        in: ["ENTRADA", "SAIDA"],
      },
      data_hora: {
        gte: inicioSemana,
        lt: fimSemana,
      },
    },
    select: {
      tipo: true,
      data_hora: true,
    },
  });

  const dias = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const movimentacaoPorDia = dias.map((dia) => ({
    dia,
    entradas: 0,
    saidas: 0,
  }));

  let totalEntradas = 0;
  let totalSaidas = 0;

  for (const leitura of leituras) {
    const data = new Date(leitura.data_hora);
    const indiceDia = (data.getDay() + 6) % 7;

    if (leitura.tipo === "ENTRADA") {
      movimentacaoPorDia[indiceDia].entradas++;
      totalEntradas++;
    } else if (leitura.tipo === "SAIDA") {
      movimentacaoPorDia[indiceDia].saidas++;
      totalSaidas++;
    }
  }

  return {
    ambiente: {
      id_ambiente: ambiente.id_ambiente,
      nome: ambiente.nome,
      max_pessoas: ambiente.max_pessoas,
    },
    periodo: {
      inicio: inicioSemana,
      fim_exclusivo: fimSemana,
    },
    total_entradas: totalEntradas,
    total_saidas: totalSaidas,
    total_movimentacoes: totalEntradas + totalSaidas,
    movimentacao_por_dia: movimentacaoPorDia,
  };
}

// RELATÓRIO MENSAL
export async function buscarDashboardMensal(idAmbiente) {
  const id = Number(idAmbiente);

  const ambiente = await prisma.ambiente.findUnique({
    where: { id_ambiente: id },
  });

  if (!ambiente) {
    throw new Error("AMBIENTE_NAO_ENCONTRADO");
  }

  const hoje = new Date();

  // Primeiro dia do mês atual
  const inicioMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    1
  );

  // Primeiro dia do próximo mês (limite exclusivo)
  const fimMes = new Date(
    hoje.getFullYear(),
    hoje.getMonth() + 1,
    1
  );

  const leituras = await prisma.leitura.findMany({
    where: {
      id_ambiente: id,
      tipo: {
        in: ["ENTRADA", "SAIDA"],
      },
      data_hora: {
        gte: inicioMes,
        lt: fimMes,
      },
    },
    select: {
      tipo: true,
      data_hora: true,
    },
  });

  const quantidadeDias = new Date(
    hoje.getFullYear(),
    hoje.getMonth() + 1,
    0
  ).getDate();

  const movimentacaoPorDia = Array.from(
    { length: quantidadeDias },
    (_, indice) => ({
      dia: indice + 1,
      entradas: 0,
      saidas: 0,
    })
  );

  let totalEntradas = 0;
  let totalSaidas = 0;

  for (const leitura of leituras) {
    const indice = new Date(leitura.data_hora).getDate() - 1;

    if (leitura.tipo === "ENTRADA") {
      movimentacaoPorDia[indice].entradas++;
      totalEntradas++;
    } else if (leitura.tipo === "SAIDA") {
      movimentacaoPorDia[indice].saidas++;
      totalSaidas++;
    }
  }

  return {
    ambiente: {
      id_ambiente: ambiente.id_ambiente,
      nome: ambiente.nome,
      max_pessoas: ambiente.max_pessoas,
    },
    periodo: {
      inicio: inicioMes,
      fim_exclusivo: fimMes,
    },
    total_entradas: totalEntradas,
    total_saidas: totalSaidas,
    total_movimentacoes: totalEntradas + totalSaidas,
    movimentacao_por_dia: movimentacaoPorDia,
  };
}

