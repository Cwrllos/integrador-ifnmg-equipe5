
const API_BASE_URL = "http://127.0.0.1:3000";

export async function cadastrarAdministrador(dados) {
  const resposta = await fetch(`${API_BASE_URL}/administradores`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      departamento: dados.departamento,
    }),
  });

  const resultado = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(
      resultado.erro || "Não foi possível cadastrar o administrador."
    );
  }

  return resultado;
}
