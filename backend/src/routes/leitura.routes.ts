import { Router } from "express";

import {
  registrarLeitura,
  listarLeituras,
} from "../controllers/leitura.controller.js";

const router = Router();

router.post("/", registrarLeitura);
router.get("/", listarLeituras);

export default router;