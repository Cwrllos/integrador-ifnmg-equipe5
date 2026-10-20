import { prisma } from "../lib/prisma.js";

export async function criarAdministrador(dados) {
  return prisma.administrador.create({
    data: {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      empresa: dados.empresa,
    },
  });
}

export async function listarAdministradores() {
  return prisma.administrador.findMany({
    include: {
      ambientes: true,
    },
  });
}

export async function buscarAdministradorPorId(id) {
  return prisma.administrador.findUnique({
    where: {
      id_adm: Number(id),
    },
    include: {
      ambientes: true,
    },
  });
}

export async function buscarAdministradorPorEmail(email) {
  return prisma.administrador.findUnique({
    where: {
      email,
    },
  });
}

export async function atualizarAdministrador(id, dados) {
  return prisma.administrador.update({
    where: {
      id_adm: Number(id),
    },
    data: dados,
  });
}

export async function deletarAdministrador(id) {
  return prisma.administrador.delete({
    where: {
      id_adm: Number(id),
    },
  });
}