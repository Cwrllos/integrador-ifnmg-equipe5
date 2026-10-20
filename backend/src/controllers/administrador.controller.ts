import {
  criarAdministrador,
  listarAdministradores,
  buscarAdministradorPorId,
  buscarAdministradorPorEmail,
  atualizarAdministrador,
  deletarAdministrador,
} from "../models/administrador.model.js";

import type { Request, Response } from "express";

function removerSenha(admin) {
  if (!admin) return null;
  const { senha, ...adminSemSenha } = admin;
  return adminSemSenha;
}

export async function cadastrarAdministrador(req: Request, res: Response) {
  try {
    const { nome, email, senha, empresa } = req.body;

    if (!nome || !email || !senha || !empresa) {
      return res.status(400).json({
        erro: "Nome, email, senha e empresa são obrigatórios.",
      });
    }

    const adminExistente = await buscarAdministradorPorEmail(email);

    if (adminExistente) {
      return res.status(409).json({
        erro: "Já existe um administrador com esse e-mail.",
      });
    }

    const admin = await criarAdministrador({ nome, email, senha, empresa });

    return res.status(201).json({
      mensagem: "Administrador cadastrado com sucesso.",
      dados: removerSenha(admin),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro interno ao cadastrar administrador.",
    });
  }
}

export async function listarAdministradoresController(req: Request, res: Response) {
  try {
    const administradores = await listarAdministradores();

    return res.json({
      dados: administradores.map(removerSenha),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao listar administradores.",
    });
  }
}

export async function buscarAdministradorController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const admin = await buscarAdministradorPorId(id);

    if (!admin) {
      return res.status(404).json({
        erro: "Administrador não encontrado.",
      });
    }

    return res.json({
      dados: removerSenha(admin),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao buscar administrador.",
    });
  }
}

export async function atualizarAdministradorController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const adminAtualizado = await atualizarAdministrador(id, req.body);

    return res.json({
      mensagem: "Administrador atualizado com sucesso.",
      dados: removerSenha(adminAtualizado),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao atualizar administrador.",
    });
  }
}

export async function deletarAdministradorController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await deletarAdministrador(id);

    return res.json({
      mensagem: "Administrador deletado com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao deletar administrador.",
    });
  }
}