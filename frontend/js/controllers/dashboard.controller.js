// CONTROLLER: coordena a View e o Model e trata eventos.
import {
  buscarDadosDashboard,
  encerrarSessao,
} from '../models/dashboard.model.js';
import {
  mostrarRelatorio,
  renderizarDashboard,
  mostrarErroDashboard,
  renderizarGraficoMovimentacao,
  renderizarHorarioPico,
  renderizarBarraOcupacao,
} from '../views/dashboard.view.js';

async function verificarSessao() {
  try {
    const resposta = await fetch(
      "http://127.0.0.1:3000/administradores/sessao",
      {
        credentials: "include",
      }
    );

    if (!resposta.ok) {
      window.location.replace("login.html");
      return false;
    }

    return true;
  } catch (erro) {
    console.error("Erro ao verificar sessão:", erro);
    window.location.replace("login.html");
    return false;
  }
}

let carregando = false;

async function atualizarDashboard() {
  if (carregando) return;
  carregando = true;
  try {
    const dados = await buscarDadosDashboard(1);

    renderizarDashboard(dados);
    renderizarGraficoMovimentacao(dados.movimentacao_por_hora);
    renderizarHorarioPico(dados.movimentacao_por_hora);
    renderizarBarraOcupacao(dados);
    
  } catch (erro) {
    mostrarErroDashboard(erro.message);
  } finally {
    carregando = false;
  }
}

async function realizarLogout() {
  const botao = document.getElementById("logoutButton");

  if (botao) botao.disabled = true;

  try {
    await encerrarSessao();

    window.location.replace("login.html");
  } catch (erro) {
    alert(erro.message || "Erro ao sair do sistema.");

    if (botao) botao.disabled = false;
  }
}

async function inicializarDashboard() {
  const autenticado = await verificarSessao();

  if (!autenticado) return;
  const botaoSair = document.getElementById("logoutButton");

if (botaoSair) {
  botaoSair.addEventListener("click", realizarLogout);
}
  document.querySelectorAll('.menu-item[data-report]').forEach(item => {
    item.addEventListener('click', () => {
      mostrarRelatorio(item.dataset.report, item);
    });
  });

  atualizarDashboard();
  setInterval(atualizarDashboard, 10000);
}

inicializarDashboard();
