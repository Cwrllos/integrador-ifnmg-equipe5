import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

export async function criarAmbiente(req: Request, res: Response) {
  try {
    const { nome, max_pessoas, id_adm } = req.body;

    if (!nome || !max_pessoas || !id_adm) {
      return res.status(400).json({
        erro: "Nome, capacidade máxima e id_adm são obrigatórios.",
      });
    }

    const ambiente = await prisma.ambiente.create({
      data: {
        nome,
        max_pessoas: Number(max_pessoas),
        id_adm: Number(id_adm),
      },
    });

    await prisma.ocupacao.create({
      data: {
        id_ambiente: ambiente.id_ambiente,
        ocupacao_atual: 0,
      },
    });

    return res.status(201).json({
      mensagem: "Ambiente criado com sucesso.",
      dados: ambiente,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao criar ambiente.",
    });
  }
}

export async function listarAmbientes(req: Request, res: Response) {
  try {
    const ambientes = await prisma.ambiente.findMany({
      include: {
        administrador: {
          select: {
            id_adm: true,
            nome: true,
            email: true,
          },
        },
        sensores: true,
        ocupacao: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    return res.json({
      dados: ambientes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao listar ambientes.",
    });
  }
}

export async function buscarAmbientePorId(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const ambiente = await prisma.ambiente.findUnique({
      where: {
        id_ambiente: Number(id),
      },
      include: {
        sensores: true,
        ocupacao: true,
        alertas: true,
      },
    });

    if (!ambiente) {
      return res.status(404).json({
        erro: "Ambiente não encontrado.",
      });
    }

    return res.json({
      dados: ambiente,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao buscar ambiente.",
    });
  }
}

export async function atualizarAmbiente(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nome, max_pessoas, id_adm } = req.body;

    if (!id) {
      return res.status(400).json({
        erro: "ID do ambiente é obrigatório.",
      });
    }

    const ambiente = await prisma.ambiente.update({
      where: {
        id_ambiente: Number(id),
      },
      data: {
        nome,
        max_pessoas:
          max_pessoas !== undefined ? Number(max_pessoas) : undefined,
        id_adm: id_adm !== undefined ? Number(id_adm) : undefined,
      },
    });

    return res.json({
      mensagem: "Ambiente atualizado com sucesso.",
      dados: ambiente,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao atualizar ambiente.",
    });
  }
}


export async function deletarAmbiente(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.ambiente.delete({
      where: {
        id_ambiente: Number(id),
      },
    });

    return res.json({
      mensagem: "Ambiente deletado com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao deletar ambiente.",
    });
  }
}