// VIEW: atualiza apenas os elementos visuais da página.
const TITULOS = {
  diario: 'Relatório Diário',
  semanal: 'Relatório Semanal',
  mensal: 'Relatório Mensal',
};

export function mostrarRelatorio(id, elemento) {
  if (!Object.hasOwn(TITULOS, id)) return;

  document.querySelectorAll('.menu-item[data-report]').forEach(item => {
    item.classList.toggle('active', item === elemento);
  });
  document.querySelectorAll('.report-section').forEach(secao => {
    secao.classList.toggle('active-report', secao.id === id);
  });
  document.getElementById('page-title').textContent = `Dashboard > ${TITULOS[id]}`;
}

export function renderizarDashboard(dados) {
  const entradas = Number(dados.entradas_hoje) || 0;
  const saidas = Number(dados.saidas_hoje) || 0;
  const ocupacao = Number(dados.ocupacao_atual) || 0;
  const capacidade = Number(dados.ambiente.max_pessoas) || 0;

  document.getElementById('fluxo-hoje').textContent = `${entradas + saidas} movimentos`;
  document.getElementById('ocupacao-atual').textContent = `${ocupacao} / ${capacidade}`;
  document.getElementById('horario-pico').textContent = '—';
  document.getElementById('dashboard-status').textContent =
    `${dados.ambiente.nome} • ${entradas} entradas • ${saidas} saídas`;
}

export function mostrarErroDashboard(mensagem) {
  document.getElementById('dashboard-status').textContent =
    `Não foi possível consultar a API: ${mensagem}`;
}


let graficoMovimentacao = null;

export function renderizarGraficoMovimentacao(dados) {
  const canvas = document.getElementById("graficoMovimentacao");

  if (!canvas || !Array.isArray(dados)) return;

  if (typeof Chart === "undefined") {
    console.error("Chart.js não foi carregado.");
    return;
  }

  const horas = dados.map(item => item.hora);
  const entradas = dados.map(item => item.entradas);
  const saidas = dados.map(item => item.saidas);

  if (graficoMovimentacao) {
    graficoMovimentacao.data.labels = horas;
    graficoMovimentacao.data.datasets[0].data = entradas;
    graficoMovimentacao.data.datasets[1].data = saidas;
    graficoMovimentacao.update();
    return;
  }

  graficoMovimentacao = new Chart(canvas, {
    type: "line",
    data: {
      labels: horas,
      datasets: [
        {
          label: "Entradas",
          data: entradas,
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.1)",
          borderWidth: 3,
          tension: 0.3,
          fill: false,
        },
        {
          label: "Saídas",
          data: saidas,
          borderColor: "#C27933",
          backgroundColor: "rgba(194, 121, 51, 0.1)",
          borderWidth: 3,
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
}

export function renderizarHorarioPico(movimentacaoPorHora) {
  const elemento = document.getElementById("horario-pico");

  if (!elemento || !Array.isArray(movimentacaoPorHora)) return;

  const horarioPico = movimentacaoPorHora.reduce(
    (maior, atual) => {
      const total = atual.entradas + atual.saidas;

      return total > maior.total
        ? { hora: atual.hora, total }
        : maior;
    },
    { hora: null, total: 0 }
  );

  elemento.textContent = horarioPico.hora ?? "—";
}


export function renderizarBarraOcupacao(dados) {
  const percentualElemento = document.getElementById("ocupacao-percentual");
  const progressoElemento = document.getElementById("ocupacao-progresso");
  const disponivelElemento = document.getElementById("ocupacao-disponivel");
  const barraElemento = document.querySelector(".ocupacao-barra");

  if (!percentualElemento || !progressoElemento || !disponivelElemento || !barraElemento) {
    return;
  }

  const ocupacao = Number(dados.ocupacao_atual);
  const capacidade = Number(dados.ambiente?.max_pessoas);

  if (!Number.isFinite(ocupacao) || !Number.isFinite(capacidade) || capacidade <= 0) {
    percentualElemento.textContent = "—";
    disponivelElemento.textContent = "Capacidade indisponível";
    progressoElemento.style.width = "0%";
    return;
  }

  const percentual = (ocupacao / capacidade) * 100;
  const percentualVisual = Math.max(0, Math.min(percentual, 100));
  const vagasDisponiveis = Math.max(0, capacidade - ocupacao);

  percentualElemento.textContent = `${percentual.toFixed(1)}%`;
  disponivelElemento.textContent = `${vagasDisponiveis} vagas disponíveis`;

  progressoElemento.style.width = `${percentualVisual}%`;

  const cor =
    percentual >= 100 ? "#DC2626" :
    percentual >= 80 ? "#C27933" :
    "#22C55E";

  progressoElemento.style.backgroundColor = cor;

  barraElemento.setAttribute("aria-valuenow", String(percentualVisual));
  barraElemento.setAttribute("aria-valuetext", `${percentual.toFixed(1)}% da capacidade utilizada`);
}

let graficoSemanal = null;

export function renderizarDashboardSemanal(dados) {
  const secao = document.getElementById("semanal");

  if (!secao) return;

  const movimentacao = dados.movimentacao_por_dia ?? [];

  // Cria uma área específica para os dados reais da semana.
  let painel = document.getElementById("painel-semanal-real");

  if (!painel) {
    painel = document.createElement("div");
    painel.id = "painel-semanal-real";
    painel.innerHTML = `
      <div class="cards-grid">
        <div class="card">
          <div class="card-title">Entradas na Semana</div>
          <div class="card-value" id="semanal-entradas">0</div>
        </div>

        <div class="card">
          <div class="card-title">Saídas na Semana</div>
          <div class="card-value" id="semanal-saidas">0</div>
        </div>

        <div class="card">
          <div class="card-title">Total de Movimentações</div>
          <div class="card-value" id="semanal-movimentacoes">0</div>
        </div>
      </div>

      <div class="grafico-card">
        <div class="grafico-header">
          <h3>Movimentação por Dia</h3>
          <p>Entradas e saídas de segunda-feira a domingo</p>
        </div>
        <div class="grafico-container">
          <canvas id="graficoSemanal"></canvas>
        </div>
      </div>
    `;

    // Oculta os cartões e gráficos provisórios da seção semanal.
    Array.from(secao.children).forEach(elemento => {
      elemento.hidden = true;
    });

    secao.appendChild(painel);
  }

  document.getElementById("semanal-entradas").textContent =
    dados.total_entradas ?? 0;

  document.getElementById("semanal-saidas").textContent =
    dados.total_saidas ?? 0;

  document.getElementById("semanal-movimentacoes").textContent =
    dados.total_movimentacoes ?? 0;

  if (typeof Chart === "undefined") {
    console.error("Chart.js não foi carregado.");
    return;
  }

  const dias = movimentacao.map(item => item.dia);
  const entradas = movimentacao.map(item => item.entradas);
  const saidas = movimentacao.map(item => item.saidas);

  if (graficoSemanal) {
    graficoSemanal.data.labels = dias;
    graficoSemanal.data.datasets[0].data = entradas;
    graficoSemanal.data.datasets[1].data = saidas;
    graficoSemanal.update();
    return;
  }

  graficoSemanal = new Chart(
    document.getElementById("graficoSemanal"),
    {
      type: "bar",
      data: {
        labels: dias,
        datasets: [
          {
            label: "Entradas",
            data: entradas,
            backgroundColor: "#22C55E",
          },
          {
            label: "Saídas",
            data: saidas,
            backgroundColor: "#C27933",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    }
  );
}


let graficoMensal = null;

export function renderizarDashboardMensal(dados) {
  const secao = document.getElementById("mensal");

  if (!secao) return;

  const movimentacao = dados.movimentacao_por_dia ?? [];
  let painel = document.getElementById("painel-mensal-real");

  if (!painel) {
    painel = document.createElement("div");
    painel.id = "painel-mensal-real";

    painel.innerHTML = `
      <div class="cards-grid">
        <div class="card">
          <div class="card-title">Entradas no Mês</div>
          <div class="card-value" id="mensal-entradas">0</div>
        </div>

        <div class="card">
          <div class="card-title">Saídas no Mês</div>
          <div class="card-value" id="mensal-saidas">0</div>
        </div>

        <div class="card">
          <div class="card-title">Total de Movimentações</div>
          <div class="card-value" id="mensal-movimentacoes">0</div>
        </div>
      </div>

      <div class="grafico-card">
        <div class="grafico-header">
          <h3>Movimentação Mensal</h3>
          <p>Entradas e saídas por dia do mês</p>
        </div>
        <div class="grafico-container">
          <canvas id="graficoMensal"></canvas>
        </div>
      </div>
    `;

    // Remove da visualização os elementos provisórios.
    // Não exclui o HTML original.
    Array.from(secao.children).forEach(elemento => {
      elemento.hidden = true;
    });

    secao.appendChild(painel);
  }

  document.getElementById("mensal-entradas").textContent =
    dados.total_entradas ?? 0;

  document.getElementById("mensal-saidas").textContent =
    dados.total_saidas ?? 0;

  document.getElementById("mensal-movimentacoes").textContent =
    dados.total_movimentacoes ?? 0;

  if (typeof Chart === "undefined") {
    console.error("Chart.js não foi carregado.");
    return;
  }

  const dias = movimentacao.map(item => String(item.dia).padStart(2, "0"));
  const entradas = movimentacao.map(item => item.entradas);
  const saidas = movimentacao.map(item => item.saidas);

  if (graficoMensal) {
    graficoMensal.data.labels = dias;
    graficoMensal.data.datasets[0].data = entradas;
    graficoMensal.data.datasets[1].data = saidas;
    graficoMensal.update();
    return;
  }

  graficoMensal = new Chart(
    document.getElementById("graficoMensal"),
    {
      type: "bar",
      data: {
        labels: dias,
        datasets: [
          {
            label: "Entradas",
            data: entradas,
            backgroundColor: "#22C55E",
          },
          {
            label: "Saídas",
            data: saidas,
            backgroundColor: "#C27933",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
      },
    }
  );
}
