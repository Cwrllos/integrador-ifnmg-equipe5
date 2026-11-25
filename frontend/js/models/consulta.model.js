
const API_BASE_URL = "http://127.0.0.1:3000";

export async function buscarOcupacaoPublica(idAmbiente = 1) {
  const resposta = await fetch(
    `${API_BASE_URL}/dashboard/publico/ambiente/${idAmbiente}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const resultado = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(
      resultado.erro || "Não foi possível consultar a ocupação."
    );
  }

  return resultado.dados;
}
