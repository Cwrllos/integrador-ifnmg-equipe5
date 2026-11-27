import bcrypt from "bcryptjs";

import {
  criarAdministrador,
  listarAdministradores,
  buscarAdministradorPorId,
  buscarAdministradorPorEmail,
  atualizarAdministrador,
  deletarAdministrador,
} from "../models/administrador.model.js";


function removerSenha(admin) {
  if (!admin) return null;
  const { senha, ...adminSemSenha } = admin;
  return adminSemSenha;
}

export async function cadastrarAdministrador(req, res) {
  try {
    const { nome, email, senha, departamento } = req.body;

    if (!nome || !email || !senha || !departamento) {
      return res.status(400).json({
        erro: "Nome, email, senha e departamento são obrigatórios.",
      });
    }

    const adminExistente = await buscarAdministradorPorEmail(email);

    if (adminExistente) {
      return res.status(409).json({
        erro: "Já existe um administrador com esse e-mail.",
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const admin = await criarAdministrador({ nome, email, senha: senhaHash, departamento });

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

export async function listarAdministradoresController(req, res) {
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

export async function buscarAdministradorController(req, res) {
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

export async function atualizarAdministradorController(req, res) {
  try {
    const { id } = req.params;

    const dadosAtualizacao = { ...req.body };

    if (dadosAtualizacao.senha) {
      dadosAtualizacao.senha = await bcrypt.hash(
        dadosAtualizacao.senha,
        10
      );
    }

    const adminAtualizado = await atualizarAdministrador(
      id,
      dadosAtualizacao
    );

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

export async function deletarAdministradorController(req, res) {
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
  export async function loginAdministradorController(req, res) {
  try {
    const { email, senha } = req.body ?? {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof senha !== "string" ||
      !senha
    ) {
      return res.status(400).json({
        erro: "Informe e-mail e senha válidos.",
      });
    }

    const administrador = await buscarAdministradorPorEmail(
      email.trim()
    );

    if (!administrador) {
      return res.status(401).json({
        erro: "E-mail ou senha inválidos.",
      });
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      administrador.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: "E-mail ou senha inválidos.",
      });
    }

    req.session.regenerate((erro) => {
  if (erro) {
    console.error("Erro ao criar sessão:", erro);

    return res.status(500).json({
      erro: "Não foi possível iniciar a sessão.",
    });
  }

  req.session.administradorId = administrador.id_adm;

  req.session.save((erro) => {
    if (erro) {
      console.error("Erro ao salvar sessão:", erro);

      return res.status(500).json({
        erro: "Não foi possível salvar a sessão.",
      });
    }

    return res.json({
      mensagem: "Login realizado com sucesso.",
      dados: removerSenha(administrador),
    });
  });
});
  } catch (error) {
    console.error("Erro na verificação de credenciais:", error);

    return res.status(500).json({
      erro: "Erro interno ao verificar credenciais.",
    });
  }
}

export async function atualizarMeuPerfilController(req, res) {
  try {
    const id = req.session.administradorId;
    const { nome, email } = req.body ?? {};

    if (
      typeof nome !== "string" ||
      typeof email !== "string" ||
      !nome.trim() ||
      !email.trim()
    ) {
      return res.status(400).json({
        erro: "Nome e e-mail são obrigatórios.",
      });
    }

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (
      nomeLimpo.length > 255 ||
      emailLimpo.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)
    ) {
      return res.status(400).json({
        erro: "Nome ou e-mail inválido.",
      });
    }

    const administrador = await atualizarAdministrador(id, {
      nome: nomeLimpo,
      email: emailLimpo,
    });

    return res.json({
      mensagem: "Perfil atualizado com sucesso.",
      dados: {
        id_adm: administrador.id_adm,
        nome: administrador.nome,
        email: administrador.email,
        departamento: administrador.departamento,
      },
    });
  } catch (erro) {
    if (erro.code === "P2002") {
      return res.status(409).json({
        erro: "Este e-mail já está cadastrado.",
      });
    }

    if (erro.code === "P2025") {
      return res.status(404).json({
        erro: "Administrador não encontrado.",
      });
    }

    console.error("Erro ao atualizar perfil:", erro);

    return res.status(500).json({
      erro: "Não foi possível atualizar o perfil.",
    });
  }
}

