
import {
  obterTemaSalvo,
  salvarTema,
  buscarMeuPerfil,
  atualizarMeuPerfil,
  buscarStatusSistema,
  buscarAnaliseMensal,
} from "../models/configuracoes.model.js";

import { ConfiguracoesView } from "../views/configuracoes.view.js";

const view = new ConfiguracoesView();


let consultandoStatus = false;

async function carregarStatusSistema() {
  if (consultandoStatus) return;

  const painel = document.getElementById("painelStatusSistema");

  if (!painel) return;

  consultandoStatus = true;

  try {
    const dados = await buscarStatusSistema();
    view.renderizarStatusSistema(dados);
  } catch (erro) {
    console.error("Erro ao consultar status:", erro);

    painel.textContent =
      `Não foi possível consultar o status do sistema: ${erro.message}`;
  } finally {
    consultandoStatus = false;
  }
}


let carregandoAnalise = false;

async function carregarAnaliseMensal() {
  if (carregandoAnalise) return;

  const painel = document.getElementById("painelAnaliseDados");

  if (!painel) return;

  carregandoAnalise = true;

  try {
    const dados = await buscarAnaliseMensal(1);

    view.renderizarAnaliseMensal(dados);
  } catch (erro) {
    console.error("Erro ao carregar análise mensal:", erro);

    painel.textContent =
      `Não foi possível carregar a análise: ${erro.message}`;
  } finally {
    carregandoAnalise = false;
  }
}


function selecionarTema(tema) {
  salvarTema(tema);
  view.aplicarTema(tema);
}


async function salvarPerfil() {
  const botao = document.getElementById("botaoSalvarPerfil");

  try {
    const dados = view.obterDadosPerfil();
    view.validarPerfil(dados);

    view.definirEstadoSalvamento(botao, true);

    const resultado = await atualizarMeuPerfil(dados);

    view.preencherPerfil(resultado.dados);
    alert(resultado.mensagem || "Perfil atualizado com sucesso!");
  } catch (erro) {
    console.error("Erro ao salvar perfil:", erro);
    alert(erro.message || "Não foi possível salvar as alterações.");
  } finally {
    if (botao) {
      view.definirEstadoSalvamento(botao, false);
    }
  }
}

async function iniciarConfiguracoes() {
  try {
    const resposta = await fetch(
      "http://127.0.0.1:3000/administradores/sessao",
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!resposta.ok) {
      window.location.replace("../auth/login.html");
      return;
    }
    // Busca os dados reais do administrador autenticado
    try {
      const perfil = await buscarMeuPerfil();
      view.preencherPerfil(perfil);
    } catch (erro) {
      console.error("Erro ao carregar perfil:", erro);
      alert("Não foi possível carregar os dados do administrador.");
    }

    // Aplica o tema salvo após verificar a sessão
    view.aplicarTema(obterTemaSalvo());

    // Carrega os indicadores quando o administrador abre a aba Status.
    
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.addEventListener("click", () => {
        const acao = item.getAttribute("onclick") ?? "";

        if (acao.includes("'status'")) {
          carregarStatusSistema();
        }

        if (acao.includes("'analise'")) {
          carregarAnaliseMensal();
        }
      });
    });



    // Atualiza o status a cada 10 segundos,
    // somente enquanto a aba Status estiver aberta.
    setInterval(() => {
      const abaStatus = document.getElementById("aba-status");

      if (abaStatus && !abaStatus.classList.contains("hidden")) {
        carregarStatusSistema();
      }
    }, 10000);


    // Botão Modo Claro
    view.botaoClaro?.addEventListener("click", () => {
      selecionarTema("claro");
    });

    // Botão Modo Escuro
    view.botaoEscuro?.addEventListener("click", () => {
      selecionarTema("escuro");
    });
    const botaoSair = document.getElementById("botaoSair");

    botaoSair?.addEventListener("click", async (evento) => {
        evento.preventDefault();
        await fazerLogout();
    });

    const botaoSalvar = document.getElementById("botaoSalvarPerfil");

      botaoSalvar?.addEventListener("click", (evento) => {
        evento.preventDefault();
        salvarPerfil();
      });

  } catch (erro) {
    console.error("Erro ao verificar sessão:", erro);
    window.location.replace("../auth/login.html");
  }

async function fazerLogout() {
  try {
    const resposta = await fetch(
      "http://127.0.0.1:3000/administradores/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!resposta.ok) {
      throw new Error("Não foi possível encerrar a sessão.");
    }

    window.location.replace("../auth/login.html");
  } catch (erro) {
    console.error("Erro ao sair:", erro);
    alert("Não foi possível sair do sistema. Tente novamente.");
  }
}

}

// Inicia as configurações uma única vez
iniciarConfiguracoes();
