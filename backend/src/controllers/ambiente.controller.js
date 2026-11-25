
import { prisma } from "../lib/prisma.js";

export async function criarAmbiente(req, res) {
  try {
    const { nome, max_pessoas, id_adm } = req.body;

   if (
  typeof nome !== "string" ||
  !nome.trim() ||
  !Number.isSafeInteger(Number(max_pessoas)) ||
  max_pessoas === null ||
  String(max_pessoas).trim() === "" ||
  Number(max_pessoas) <= 0 ||
  !Number.isSafeInteger(Number(id_adm)) ||
  id_adm === null ||
  String(id_adm).trim() === "" ||
  Number(id_adm) <= 0
) {
  return res.status(400).json({
    erro: "Informe um nome, uma capacidade máxima válida e um ID de administrador válido.",
  });
}

  const ambiente = await prisma.$transaction(async (tx) => {
   const novoAmbiente = await tx.ambiente.create({
    data: {
      nome: nome.trim(),
      max_pessoas: Number(max_pessoas),
      id_adm: Number(id_adm),
    },
  });

  await tx.ocupacao.create({
    data: {
      id_ambiente: novoAmbiente.id_ambiente,
      ocupacao_atual: 0,
    },
  });

  return novoAmbiente;
});

    return res.status(201).json({
      mensagem: "Ambiente criado com sucesso.",
      dados: ambiente,
    });
    } catch (error) {
    console.error(error);

    if (error.code === "P2003") {
      return res.status(400).json({
        erro: "O administrador informado não existe ou é inválido.",
      });
    }

    return res.status(500).json({
      erro: "Erro ao criar ambiente.",
    });
  }
}

export async function listarAmbientes(req, res) {
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

export async function buscarAmbientePorId(req, res) {
  try {
    const { id } = req.params;
        // Valida o ID do ambiente antes de consultar o banco
      if (
        !/^[1-9]\d*$/.test(id) ||
        !Number.isSafeInteger(Number(id))
      ) {
        return res.status(400).json({
          erro: "O ID do ambiente deve ser um número inteiro positivo válido.",
        });
      }
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

export async function atualizarAmbiente(req, res) {
  try {
    const { id } = req.params;
    const { nome, max_pessoas, id_adm } = req.body;
        // Valida o ID do ambiente antes de atualizar
    if (
      !/^[1-9]\d*$/.test(id) ||
      !Number.isSafeInteger(Number(id))
    ) {
      return res.status(400).json({
        erro: "O ID do ambiente deve ser um número inteiro positivo válido.",
      });
    }
    if (
  max_pessoas !== undefined &&
  (
    max_pessoas === null ||
    String(max_pessoas).trim() === "" ||
    !Number.isInteger(Number(max_pessoas)) ||
    Number(max_pessoas) <= 0
  )
) {
  return res.status(400).json({
    erro: "A capacidade máxima deve ser um número inteiro maior que zero.",
  });
}

if (
  nome !== undefined &&
  (typeof nome !== "string" || !nome.trim())
) {
  return res.status(400).json({
    erro: "O nome do ambiente deve ser válido.",
  });
}

if (
  id_adm !== undefined &&
  (
    id_adm === null ||
    String(id_adm).trim() === "" ||
    !Number.isInteger(Number(id_adm)) ||
    Number(id_adm) <= 0
  )
) {
  return res.status(400).json({
    erro: "O ID do administrador deve ser um número inteiro positivo.",
  });
}


    const ambiente = await prisma.ambiente.update({
      where: {
        id_ambiente: Number(id),
      },
      data: {
        nome: nome !== undefined ? nome.trim() : undefined,
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

  if (error.code === "P2025") {
    return res.status(404).json({
      erro: "Ambiente não encontrado.",
    });
  }

  return res.status(500).json({
    erro: "Erro ao atualizar ambiente.",
  });
}
}


export async function deletarAmbiente(req, res) {
  try {
    const { id } = req.params;
        // Valida o ID antes de tentar excluir o ambiente
    if (
      !/^[1-9]\d*$/.test(id) ||
      !Number.isSafeInteger(Number(id))
    ) {
      return res.status(400).json({
        erro: "O ID do ambiente deve ser um número inteiro positivo válido.",
      });
    }

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

  if (error.code === "P2003") {
    return res.status(409).json({
      erro: "Não é possível excluir este ambiente, pois existem registros vinculados a ele.",
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      erro: "Ambiente não encontrado.",
    });
    }

    return res.status(500).json({
    erro: "Erro ao deletar ambiente.",
  });
  }
}