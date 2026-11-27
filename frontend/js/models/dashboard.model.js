// MODEL: comunicação com a API, sem manipular elementos HTML.
const API_BASE_URL = 'http://127.0.0.1:3000';

export async function buscarDadosDashboard(idAmbiente = 1) {
 const resposta = await fetch(`${API_BASE_URL}/dashboard/ambiente/${idAmbiente}`, {
  method: 'GET',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
  },
});

  let corpo;
  try {
    corpo = await resposta.json();
  } catch {
    throw new Error('A API retornou uma resposta inválida.');
  }

  if (!resposta.ok) {
    throw new Error(corpo.erro || `Falha ao carregar dashboard (${resposta.status}).`);
  }

  if (!corpo.dados || !corpo.dados.ambiente) {
    throw new Error('Dados incompletos recebidos do backend.');
  }

  return corpo.dados;
}
export async function encerrarSessao() {
  const resposta = await fetch(
    `${API_BASE_URL}/administradores/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!resposta.ok) {
    throw new Error("Não foi possível encerrar a sessão.");
  }

  return resposta.json();
}

export async function buscarDadosDashboardSemanal(idAmbiente) {
  const resposta = await fetch(
    `http://127.0.0.1:3000/dashboard/semanal/ambiente/${idAmbiente}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const resultado = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(
      resultado.erro || "Não foi possível carregar o relatório semanal."
    );
  }

  return resultado.dados;
}

export async function buscarDadosDashboardMensal(idAmbiente) {
  const resposta = await fetch(
    `http://127.0.0.1:3000/dashboard/mensal/ambiente/${idAmbiente}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const resultado = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(
      resultado.erro || "Não foi possível carregar o relatório mensal."
    );
  }

  return resultado.dados;
}
