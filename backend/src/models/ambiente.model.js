import { prisma } from "../lib/prisma.js";

export async function criarAmbiente(dados) {
  return prisma.ambiente.create({
    data: {
      nome: dados.nome,
      max_pessoas: Number(dados.max_pessoas),
      id_adm: Number(dados.id_adm),
    },
  });
}

export async function listarAmbientes() {
  return prisma.ambiente.findMany({
    include: {
      administrador: true,
      sensores: true,
    },
  });
}

export async function buscarAmbientePorId(id) {
  return prisma.ambiente.findUnique({
    where: {
      id_ambiente: Number(id),
    },
    include: {
      administrador: true,
      sensores: true,
    },
  });
}

export async function atualizarAmbiente(id, dados) {
  return prisma.ambiente.update({
    where: {
      id_ambiente: Number(id),
    },
    data: {
      ...dados,
      max_pessoas: dados.max_pessoas
        ? Number(dados.max_pessoas)
        : undefined,
      id_adm: dados.id_adm ? Number(dados.id_adm) : undefined,
    },
  });
}

export async function deletarAmbiente(id) {
  return prisma.ambiente.delete({
    where: {
      id_ambiente: Number(id),
    },
  });
}