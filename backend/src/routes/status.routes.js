import { Router } from "express";

import { consultarStatusSistema } from "../controllers/status.controller.js";
import { exigirAutenticacao } from "../middlewares/autenticacao.middleware.js";

const router = Router();

// Somente administradores autenticados podem consultar o status.
router.get("/", exigirAutenticacao, consultarStatusSistema);

export default router;
