
const API_URL = "http://127.0.0.1:3000";

export async function autenticarAdministrador(email, senha) {
  const resposta = await fetch(`${API_URL}/administradores/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Não foi possível realizar o login.");
  }

  return dados;
}
