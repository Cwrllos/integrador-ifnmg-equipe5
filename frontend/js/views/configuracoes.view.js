
export class ConfiguracoesView {
  constructor() {
    this.botaoClaro = document.getElementById("botaoTemaClaro");
    this.botaoEscuro = document.getElementById("botaoTemaEscuro");
  }


  preencherPerfil(dados) {
    const campoNome = document.getElementById("nomeAdministrador");
    const campoEmail = document.getElementById("emailAdministrador");

    if (campoNome) {
      campoNome.value = dados.nome ?? "";
    }

    if (campoEmail) {
      campoEmail.value = dados.email ?? "";
    }
  }

  obterDadosPerfil() {
    return {
      nome: document.getElementById("nomeAdministrador").value.trim(),
      email: document.getElementById("emailAdministrador").value.trim(),
    };
  }

  validarPerfil(dados) {
    if (!dados.nome || !dados.email) {
      throw new Error("Preencha o nome e o e-mail.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      throw new Error("Informe um e-mail válido.");
    }
  }

  definirEstadoSalvamento(botao, salvando) {
    botao.disabled = salvando;
    botao.classList.toggle("opacity-70", salvando);
    botao.classList.toggle("cursor-not-allowed", salvando);

    const texto = botao.querySelector(".texto-botao");

    if (texto) {
      texto.textContent = salvando
        ? "Salvando..."
        : "Salvar Alterações";
    }
  }


  aplicarTema(tema) {
    const escuro = tema === "escuro";

    // Ativa ou desativa o tema escuro na página
    document.documentElement.classList.toggle("dark", escuro);

    // Atualiza a aparência das opções selecionadas
    this.destacarBotao(this.botaoClaro, !escuro);
    this.destacarBotao(this.botaoEscuro, escuro);
  }

  destacarBotao(botao, selecionado) {
    if (!botao) return;

    botao.classList.toggle("border-2", selecionado);
    botao.classList.toggle("border-primary", selecionado);
    botao.classList.toggle("bg-primary/5", selecionado);

    botao.classList.toggle("border", !selecionado);
    botao.classList.toggle("border-outline-variant", !selecionado);
    botao.classList.toggle("bg-surface", !selecionado);

    botao.setAttribute("aria-pressed", String(selecionado));
  }

 
renderizarStatusSistema(dados) {
  const painel = document.getElementById("painelStatusSistema");

  if (!painel) return;

  const arduino = dados.arduino ?? {};

  const apiOnline = dados.api === "online";
  const mysqlConectado = dados.mysql === "conectado";

  let statusArduino = "🔴 Desconectado";

  if (!arduino.habilitado) {
    statusArduino = "⚪ Desativado";
  } else if (arduino.conectado) {
    statusArduino = "🟢 Conectado";
  }

  const formatarData = (valor) => {
    if (!valor) return "Nenhuma informação disponível";

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
      return "Data inválida";
    }

    return data.toLocaleString("pt-BR");
  };

  painel.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

      <div class="p-5 rounded-xl border border-outline-variant bg-surface">
        <p class="text-sm text-on-surface-variant">
          API OccupaControl
        </p>
        <h3 class="text-xl font-bold mt-2 text-on-surface">
          ${apiOnline ? "🟢 Online" : "🔴 Offline"}
        </h3>
      </div>

      <div class="p-5 rounded-xl border border-outline-variant bg-surface">
        <p class="text-sm text-on-surface-variant">
          Banco de Dados MySQL
        </p>
        <h3 class="text-xl font-bold mt-2 text-on-surface">
          ${mysqlConectado ? "🟢 Conectado" : "🔴 Desconectado"}
        </h3>
      </div>

      <div class="p-5 rounded-xl border border-outline-variant bg-surface">
        <p class="text-sm text-on-surface-variant">
          Conexão Arduino
        </p>
        <h3 class="text-xl font-bold mt-2 text-on-surface">
          ${statusArduino}
        </h3>
        <p class="text-sm text-on-surface-variant mt-2">
          Porta: <span id="statusPortaArduino"></span>
        </p>
      </div>

      <div class="p-5 rounded-xl border border-outline-variant bg-surface">
        <p class="text-sm text-on-surface-variant">
          Última Leitura Registrada
        </p>
        <h3 class="text-base font-bold mt-2 text-on-surface">
          ${formatarData(dados.ultima_leitura?.data_hora)}
        </h3>
        <p class="text-sm text-on-surface-variant mt-2">
          Origem: <span id="statusOrigemLeitura"></span>
        </p>
      </div>

    </div>

    <div class="border-t border-outline-variant pt-4">
      <p class="text-sm text-on-surface-variant">
        Última mensagem recebida do Arduino:
        ${formatarData(arduino.ultima_mensagem)}
      </p>

      <p class="text-sm text-on-surface-variant mt-2">
        Última verificação do sistema:
        ${formatarData(dados.verificado_em)}
      </p>
    </div>
  `;

  document.getElementById("statusPortaArduino").textContent =
    arduino.porta ?? "Não configurada";

  document.getElementById("statusOrigemLeitura").textContent =
    dados.ultima_leitura?.origem ?? "Não disponível";
}

  renderizarAnaliseMensal(dados) {
    const painel = document.getElementById("painelAnaliseDados");

    if (!painel) return;

    const movimentacoes = dados.movimentacao_por_dia ?? [];

    // Identifica o dia com maior número de movimentações.
    const diaPico = movimentacoes.reduce((maior, atual) => {
      const totalAtual = atual.entradas + atual.saidas;
      const totalMaior = maior.entradas + maior.saidas;

      return totalAtual > totalMaior ? atual : maior;
    }, { dia: "-", entradas: 0, saidas: 0 });

    const totalPico = diaPico.entradas + diaPico.saidas;

    painel.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        <div class="p-5 rounded-xl border border-outline-variant bg-surface">
          <p class="text-sm text-on-surface-variant">Entradas no Mês</p>
          <h3 id="analiseEntradas" class="text-2xl font-bold mt-2 text-on-surface"></h3>
        </div>

        <div class="p-5 rounded-xl border border-outline-variant bg-surface">
          <p class="text-sm text-on-surface-variant">Saídas no Mês</p>
          <h3 id="analiseSaidas" class="text-2xl font-bold mt-2 text-on-surface"></h3>
        </div>

        <div class="p-5 rounded-xl border border-outline-variant bg-surface">
          <p class="text-sm text-on-surface-variant">Movimentações</p>
          <h3 id="analiseMovimentacoes" class="text-2xl font-bold mt-2 text-on-surface"></h3>
        </div>

        <div class="p-5 rounded-xl border border-outline-variant bg-surface">
          <p class="text-sm text-on-surface-variant">Dia de Maior Fluxo</p>
          <h3 id="analiseDiaPico" class="text-2xl font-bold mt-2 text-on-surface"></h3>
        </div>

      </div>

      <div class="p-5 rounded-xl border border-outline-variant bg-surface">
        <h3 class="text-lg font-bold text-on-surface mb-4">
          Movimentação por Dia do Mês
        </h3>
        <div class="relative h-80">
          <canvas id="graficoAnaliseMensal"></canvas>
        </div>
      </div>
    `;

    document.getElementById("analiseEntradas").textContent =
      dados.total_entradas ?? 0;

    document.getElementById("analiseSaidas").textContent =
      dados.total_saidas ?? 0;

    document.getElementById("analiseMovimentacoes").textContent =
      dados.total_movimentacoes ?? 0;

    document.getElementById("analiseDiaPico").textContent =
      totalPico > 0 ? `Dia ${diaPico.dia} (${totalPico})` : "Sem registros";

    // Destrói o gráfico anterior antes de criar outro.
    const graficoAnterior = Chart.getChart("graficoAnaliseMensal");

    if (graficoAnterior) {
      graficoAnterior.destroy();
    }

    new Chart(document.getElementById("graficoAnaliseMensal"), {
      type: "bar",
      data: {
        labels: movimentacoes.map(item => String(item.dia).padStart(2, "0")),
        datasets: [
          {
            label: "Entradas",
            data: movimentacoes.map(item => item.entradas),
            backgroundColor: "#22C55E",
          },
          {
            label: "Saídas",
            data: movimentacoes.map(item => item.saidas),
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
    });
  }


}