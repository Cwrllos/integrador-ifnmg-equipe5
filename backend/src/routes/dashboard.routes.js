
import { Router } from "express";

import {
  buscarDashboardAmbienteController,
  buscarOcupacaoPublicaController,
} from "../controllers/dashboard.controller.js";

import { exigirAutenticacao } from "../middlewares/autenticacao.middleware.js";

const router = Router();

// Consulta pública: não exige login
router.get(
  "/publico/ambiente/:idAmbiente",
  buscarOcupacaoPublicaController
);

// Dashboard administrativo: exige login
router.get(
  "/ambiente/:idAmbiente",
  exigirAutenticacao,
  buscarDashboardAmbienteController
);

export default router;
