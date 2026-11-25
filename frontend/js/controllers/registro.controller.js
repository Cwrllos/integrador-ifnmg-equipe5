
import { cadastrarAdministrador } from "../models/registro.model.js";
import { RegistroView } from "../views/registro.view.js";

const view = new RegistroView();

async function verificarSessao() {
  try {
    const resposta = await fetch(
      "http://127.0.0.1:3000/administradores/sessao",
      { credentials: "include" }
    );

    if (!resposta.ok) {
      window.location.replace("login.html");
      return false;
    }

    return true;
  } catch (erro) {
    console.error("Erro ao verificar sessão:", erro);
    window.location.replace("login.html");
    return false;
  }
}

async function iniciarCadastro() {
  const autenticado = await verificarSessao();
  if (!autenticado) return;

  view.formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    try {
      const dados = view.obterDados();
      view.validarDados(dados);
      view.definirCarregamento(true);

      const resultado = await cadastrarAdministrador(dados);

      view.mostrarSucesso(
        resultado.mensagem || "Administrador cadastrado com sucesso!"
      );
    } catch (erro) {
      view.mostrarErro(erro.message || "Erro ao cadastrar administrador.");
    } finally {
      view.definirCarregamento(false);
    }
  });
}

iniciarCadastro();
