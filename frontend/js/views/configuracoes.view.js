
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
}
