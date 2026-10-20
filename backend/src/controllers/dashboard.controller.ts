import { buscarDashboardAmbiente } from "../models/dashboard.model.js";

export async function buscarDashboardAmbienteController(req, res) {
  try {
    const { idAmbiente } = req.params;

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