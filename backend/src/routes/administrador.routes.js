import { Router } from "express";
import { exigirAutenticacao } from "../middlewares/autenticacao.middleware.js";
import { buscarAdministradorPorId } from "../models/administrador.model.js";

import {
  cadastrarAdministrador,
  listarAdministradoresController,
  buscarAdministradorController,
  atualizarAdministradorController,
  deletarAdministradorController,
  loginAdministradorController,
  atualizarMeuPerfilController,
} from "../controllers/administrador.controller.js";

const router = Router();

router.post("/login", loginAdministradorController);
router.get("/sessao", exigirAutenticacao, (req, res) => {
  return res.json({
    autenticado: true,
    administradorId: req.session.administradorId,
  });
});
router.post("/logout", exigirAutenticacao, (req, res) => {
  req.session.destroy((erro) => {
    if (erro) {
      return res.status(500).json({
        erro: "Não foi possível encerrar a sessão.",
      });
    }

    res.clearCookie("occupacontrol.sid", {
      path: "/",
    });

    return res.json({
      mensagem: "Logout realizado com sucesso.",
    });
  });
});
router.post("/", exigirAutenticacao, cadastrarAdministrador);
router.get("/me", exigirAutenticacao, async (req, res) => {
  try {
    const administrador = await buscarAdministradorPorId(
      req.session.administradorId
    );

    if (!administrador) {
      return res.status(404).json({
        erro: "Administrador não encontrado.",
      });
    }

    return res.json({
      dados: {
        id_adm: administrador.id_adm,
        nome: administrador.nome,
        email: administrador.email,
        departamento: administrador.departamento,
      },
    });
  } catch (erro) {
    console.error("Erro ao consultar perfil:", erro);

    return res.status(500).json({
      erro: "Não foi possível consultar o perfil.",
    });
  }
});

router.put("/me", exigirAutenticacao, atualizarMeuPerfilController);

router.get("/", exigirAutenticacao, listarAdministradoresController);
router.get("/:id", exigirAutenticacao, buscarAdministradorController);
//router.put("/:id", exigirAutenticacao, atualizarAdministradorController);
//router.delete("/:id", exigirAutenticacao, deletarAdministradorController);

export default router;