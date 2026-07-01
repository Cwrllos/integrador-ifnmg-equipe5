import { Router } from "express";

import { buscarDashboardAmbienteController } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/ambiente/:idAmbiente", buscarDashboardAmbienteController);

export default router;