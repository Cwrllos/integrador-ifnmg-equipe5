import { Router } from "express";

import {
  cadastrarAdministrador,
  listarAdministradoresController,
  buscarAdministradorController,
  atualizarAdministradorController,
  deletarAdministradorController,
} from "../controllers/administrador.controller.js";

const router = Router();

router.post("/", cadastrarAdministrador);
router.get("/", listarAdministradoresController);
router.get("/:id", buscarAdministradorController);
router.put("/:id", atualizarAdministradorController);
router.delete("/:id", deletarAdministradorController);

export default router;