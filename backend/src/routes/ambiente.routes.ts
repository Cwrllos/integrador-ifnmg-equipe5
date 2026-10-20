import { Router } from "express";

import {
  criarAmbiente,
  listarAmbientes,
  buscarAmbientePorId,
  atualizarAmbiente,
  deletarAmbiente,
} from "../controllers/ambiente.controller.js";

const router = Router();

router.post("/", criarAmbiente);
router.get("/", listarAmbientes);
router.get("/:id", buscarAmbientePorId);
router.put("/:id", atualizarAmbiente);
router.delete("/:id", deletarAmbiente);

export default router;