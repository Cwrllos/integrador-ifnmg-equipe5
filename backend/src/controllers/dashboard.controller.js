import { buscarDashboardAmbiente } from "../models/dashboard.model.js";
import { buscarOcupacaoPublica } from "../models/dashboard.model.js";
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
  } catch (error) {
    console.error(error);

    if (error.message === "AMBIENTE_NAO_ENCONTRADO") {
      return res.status(404).json({
        erro: "Ambiente não encontrado.",
      });
    }

    return res.status(500).json({
      erro: "Erro ao buscar dados do dashboard.",
    });
  }
}

export async function buscarOcupacaoPublicaController(req, res) {
  try {
    const { idAmbiente } = req.params;

    const id = Number(idAmbiente);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "Identificador do ambiente inválido.",
      });
    }

    const dados = await buscarOcupacaoPublica(id);

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
