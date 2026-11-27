
import { buscarOcupacaoPublica } from "../models/consulta.model.js";

import {
  renderizarOcupacaoPublica,
  mostrarErroConsulta,
} from "../views/consulta.view.js";

const ID_AMBIENTE = 1;
const INTERVALO_ATUALIZACAO = 10000; // 10 segundos

let consultaEmAndamento = false;

async function atualizarOcupacao() {
  // Evita consultas simultâneas
  if (consultaEmAndamento) return;

  consultaEmAndamento = true;

  try {
    const dados = await buscarOcupacaoPublica(ID_AMBIENTE);

    renderizarOcupacaoPublica(dados);
  } catch (erro) {
    console.error("Erro ao atualizar a ocupação:", erro);

    mostrarErroConsulta(
      "Não foi possível atualizar a ocupação. Tente novamente."
    );
  } finally {
    consultaEmAndamento = false;
  }
}

function iniciarConsultaPublica() {
  // Busca os dados assim que a página abre
  atualizarOcupacao();

  // Atualiza automaticamente a cada 10 segundos
  setInterval(atualizarOcupacao, INTERVALO_ATUALIZACAO);
}

iniciarConsultaPublica();
