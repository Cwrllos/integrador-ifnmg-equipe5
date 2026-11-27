
import { Router } from "express";

import {
  buscarDashboardAmbienteController,
  buscarOcupacaoPublicaController,
  buscarDashboardSemanalController,
  buscarDashboardMensalController,
} from "../controllers/dashboard.controller.js";

import { exigirAutenticacao } from "../middlewares/autenticacao.middleware.js";

const router = Router();

// CONSULTA PÚBLICA — não exige login
router.get(
  "/publico/ambiente/:idAmbiente",
  buscarOcupacaoPublicaController
);

// RELATÓRIO DIÁRIO — exige login
router.get(
  "/ambiente/:idAmbiente",
  exigirAutenticacao,
  buscarDashboardAmbienteController
);

// RELATÓRIO SEMANAL — exige login
router.get(
  "/semanal/ambiente/:idAmbiente",
  exigirAutenticacao,
  buscarDashboardSemanalController
);

// RELATÓRIO MENSAL — exige login
router.get(
  "/mensal/ambiente/:idAmbiente",
  exigirAutenticacao,
  buscarDashboardMensalController
);

export default router;
