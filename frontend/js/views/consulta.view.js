
export function renderizarOcupacaoPublica(dados) {
  const {
    nome,
    ocupacao_atual,
    capacidade_maxima,
    vagas_disponiveis,
    percentual_ocupacao,
  } = dados;

  document.getElementById("nomeLaboratorio").textContent = nome;

  document.getElementById("pessoasPresentes").textContent =
    ocupacao_atual;

  document.getElementById("vagasDisponiveis").textContent =
    vagas_disponiveis;

  document.getElementById("percentualOcupacao").textContent =
    `${percentual_ocupacao}%`;

  const barra = document.getElementById("barraOcupacao");

  barra.style.width = `${Math.min(100, Math.max(0, percentual_ocupacao))}%`;

  // Verde: disponível | Laranja: próximo da lotação | Vermelho: lotado
  if (percentual_ocupacao >= 100) {
    barra.style.backgroundColor = "#dc2626";
  } else if (percentual_ocupacao >= 80) {
    barra.style.backgroundColor = "#ea8a23";
  } else {
    barra.style.backgroundColor = "#398d35";
  }

  const status = document.getElementById("statusLaboratorio");

  if (vagas_disponiveis === 0) {
    status.textContent = "Laboratório lotado no momento.";
    status.style.color = "#dc2626";
  } else {
    status.textContent =
      `${vagas_disponiveis} vaga(s) disponível(is) no laboratório.`;
    status.style.color = "#398d35";
  }

  document.getElementById("ultimaAtualizacao").textContent =
    `Última atualização: ${new Date().toLocaleTimeString("pt-BR")}` +
    ` | Capacidade máxima: ${capacidade_maxima} pessoas`;
}

export function mostrarErroConsulta(mensagem) {
  document.getElementById("statusLaboratorio").textContent = mensagem;
  document.getElementById("statusLaboratorio").style.color = "#dc2626";
  document.getElementById("ultimaAtualizacao").textContent =
    "Não foi possível atualizar os dados.";
}
