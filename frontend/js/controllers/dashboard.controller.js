
// CONTROLLER: coordena Model e View do Dashboard.

import {
  buscarDadosDashboard,
  buscarDadosDashboardSemanal,
  buscarDadosDashboardMensal,
  encerrarSessao,
} from "../models/dashboard.model.js";

import {
  mostrarRelatorio,
  renderizarDashboard,
  mostrarErroDashboard,
  renderizarGraficoMovimentacao,
  renderizarHorarioPico,
  renderizarBarraOcupacao,
  renderizarDashboardSemanal,
  renderizarDashboardMensal,
} from "../views/dashboard.view.js";

const ID_AMBIENTE = 1;
const INTERVALO_ATUALIZACAO = 10000;

let relatorioAtivo = "diario";
let carregando = false;
let versaoNavegacao = 0;

// Verifica se o administrador está autenticado.
async function verificarSessao() {
  try {
    const resposta = await fetch(
      "http://127.0.0.1:3000/administradores/sessao",
      {
        credentials: "include",
      }
    );

    if (!resposta.ok) {
      window.location.replace("../auth/login.html");
      return false;
    }

    return true;
  } catch (erro) {
    console.error("Erro ao verificar sessão:", erro);
    window.location.replace("../auth/login.html");
    return false;
  }
}

// Atualiza apenas o relatório selecionado.
async function atualizarRelatorioAtivo() {
  if (carregando) return;

  carregando = true;

  const tipo = relatorioAtivo;
  const versao = versaoNavegacao;

  try {
    if (tipo === "diario") {
      const dados = await buscarDadosDashboard(ID_AMBIENTE);

      // Evita atualizar uma tela que deixou de estar ativa.
      if (versao !== versaoNavegacao) return;

      renderizarDashboard(dados);
      renderizarGraficoMovimentacao(dados.movimentacao_por_hora);
      renderizarHorarioPico(dados.movimentacao_por_hora);
      renderizarBarraOcupacao(dados);
    }

    if (tipo === "semanal") {
      const dados = await buscarDadosDashboardSemanal(ID_AMBIENTE);

      if (versao !== versaoNavegacao) return;

      renderizarDashboardSemanal(dados);

      atualizarResumo(
        dados.ambiente.nome,
        "Semana atual",
        dados.total_entradas,
        dados.total_saidas
      );
    }

    if (tipo === "mensal") {
      const dados = await buscarDadosDashboardMensal(ID_AMBIENTE);

      if (versao !== versaoNavegacao) return;

      renderizarDashboardMensal(dados);

      atualizarResumo(
        dados.ambiente.nome,
        "Mês atual",
        dados.total_entradas,
        dados.total_saidas
      );
    }
  } catch (erro) {
    if (versao === versaoNavegacao) {
      mostrarErroDashboard(erro.message);
    }
  } finally {
    carregando = false;
  }
}

// Atualiza o texto informativo do relatório.
function atualizarResumo(nomeAmbiente, periodo, entradas, saidas) {
  const elemento = document.getElementById("dashboard-status");

  if (!elemento) return;

  elemento.textContent =
    `${nomeAmbiente} • ${periodo} • ` +
    `${entradas} entradas • ${saidas} saídas`;
}

// Faz logout com segurança.
async function realizarLogout() {
  const botao = document.getElementById("logoutButton");

  if (botao) botao.disabled = true;

  try {
    await encerrarSessao();
    window.location.replace("../auth/login.html");
  } catch (erro) {
    alert(erro.message || "Erro ao sair do sistema.");

    if (botao) botao.disabled = false;
  }
}

// Inicializa o Dashboard.
async function inicializarDashboard() {
  const autenticado = await verificarSessao();

  if (!autenticado) return;

  const botaoSair = document.getElementById("logoutButton");

  if (botaoSair) {
    botaoSair.addEventListener("click", realizarLogout);
  }

  // Navegação entre os três relatórios.
  document.querySelectorAll(".menu-item[data-report]").forEach((item) => {
    item.addEventListener("click", () => {
      const tipo = item.dataset.report;

      if (!["diario", "semanal", "mensal"].includes(tipo)) {
        return;
      }

      relatorioAtivo = tipo;
      versaoNavegacao++;

      mostrarRelatorio(tipo, item);
      atualizarRelatorioAtivo();
    });
  });

  // Primeiro carregamento.
  await atualizarRelatorioAtivo();

  // Atualização automática.
  setInterval(atualizarRelatorioAtivo, INTERVALO_ATUALIZACAO);
}

inicializarDashboard();
