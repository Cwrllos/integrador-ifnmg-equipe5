
import {
  buscarDashboardAmbiente,
  buscarOcupacaoPublica,
  buscarDashboardSemanal,
  buscarDashboardMensal,
} from "../models/dashboard.model.js";

// RELATÓRIO DIÁRIO
export async function buscarDashboardAmbienteController(req, res) {
  try {
    const { idAmbiente } = req.params;

    if (
      !/^[1-9]\d*$/.test(idAmbiente) ||
      !Number.isSafeInteger(Number(idAmbiente))
    ) {
      return res.status(400).json({
        erro: "O ID do ambiente deve ser um número inteiro positivo válido.",
      });
    }

    const dashboard = await buscarDashboardAmbiente(idAmbiente);

    return res.json({
      dados: dashboard,
    });
  } catch (erro) {
    console.error("Erro ao buscar relatório diário:", erro);

    if (erro.message === "AMBIENTE_NAO_ENCONTRADO") {
      return res.status(404).json({
        erro: "Ambiente não encontrado.",
      });
    }

    return res.status(500).json({
      erro: "Erro ao buscar dados do dashboard.",
    });
  }
}

// CONSULTA PÚBLICA
export async function buscarOcupacaoPublicaController(req, res) {
  try {
    const { idAmbiente } = req.params;

    if (
      !/^[1-9]\d*$/.test(idAmbiente) ||
      !Number.isSafeInteger(Number(idAmbiente))
    ) {
      return res.status(400).json({
        erro: "Identificador do ambiente inválido.",
      });
    }

    const dados = await buscarOcupacaoPublica(Number(idAmbiente));

    if (!dados) {
      return res.status(404).json({
        erro: "Ambiente não encontrado.",
      });
    }

    return res.json({
      dados,
    });
  } catch (erro) {
    console.error("Erro na consulta pública:", erro);

    return res.status(500).json({
      erro: "Não foi possível consultar a ocupação.",
    });
  }
}

// RELATÓRIO SEMANAL
export async function buscarDashboardSemanalController(req, res) {
  try {
    const { idAmbiente } = req.params;

    if (
      !/^[1-9]\d*$/.test(idAmbiente) ||
      !Number.isSafeInteger(Number(idAmbiente))
    ) {
      return res.status(400).json({
        erro: "O ID do ambiente deve ser um número inteiro positivo válido.",
      });
    }

    const dashboard = await buscarDashboardSemanal(idAmbiente);

    return res.json({
      dados: dashboard,
    });
  } catch (erro) {
    console.error("Erro ao buscar relatório semanal:", erro);

    if (erro.message === "AMBIENTE_NAO_ENCONTRADO") {
      return res.status(404).json({
        erro: "Ambiente não encontrado.",
      });
    }

    return res.status(500).json({
      erro: "Não foi possível buscar o relatório semanal.",
    });
  }
}
// RELATÓRIO MENSAL
export async function buscarDashboardMensalController(req, res) {
  try {
    const { idAmbiente } = req.params;
    
    if (
      !/^[1-9]\d*$/.test(idAmbiente) ||
      !Number.isSafeInteger(Number(idAmbiente))
    ) {
      return res.status(400).json({
        erro: "O ID do ambiente deve ser um número inteiro positivo válido.",
      });
    }

    const dashboard = await buscarDashboardMensal(idAmbiente);

    return res.json({
      dados: dashboard,
    });
  } catch (erro) {
    console.error("Erro ao buscar relatório mensal:", erro);

    if (erro.message === "AMBIENTE_NAO_ENCONTRADO") {
      return res.status(404).json({
        erro: "Ambiente não encontrado.",
      });
    }

    return res.status(500).json({
      erro: "Não foi possível buscar o relatório mensal.",
    });
  }
}