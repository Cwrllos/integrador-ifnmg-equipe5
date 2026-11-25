
const CHAVE_TEMA = "occupacontrol-tema";

export function obterTemaSalvo() {
  const tema = localStorage.getItem(CHAVE_TEMA);
  return tema === "escuro" ? "escuro" : "claro";
}

export function salvarTema(tema) {
  if (!["claro", "escuro"].includes(tema)) {
    throw new Error("Tema inválido.");
  }

  localStorage.setItem(CHAVE_TEMA, tema);
}

const API_BASE_URL = "http://127.0.0.1:3000";

export async function buscarMeuPerfil() {
  const resposta = await fetch(
    `${API_BASE_URL}/administradores/me`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const resultado = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(
      resultado.erro || "Não foi possível carregar seu perfil."
    );
  }

  return resultado.dados;
}

export async function atualizarMeuPerfil(dados) {
  const resposta = await fetch(
    "http://127.0.0.1:3000/administradores/me",
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: dados.nome,
        email: dados.email,
      }),
    }
  );

  const resultado = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(
      resultado.erro || "Não foi possível salvar as alterações."
    );
  }

  return resultado;
}
