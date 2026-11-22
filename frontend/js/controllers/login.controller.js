
import { autenticarAdministrador } from "../models/login.model.js";
import { LoginView } from "../views/login.view.js";

async function realizarLogin(evento) {
  evento.preventDefault();

  LoginView.limparErro();
  LoginView.definirCarregamento(true);

  try {
    const { email, senha } = LoginView.obterCredenciais();

    await autenticarAdministrador(email, senha);

    window.location.href = "dashboard.html";
  } catch (erro) {
    LoginView.mostrarErro(
      erro.message || "Não foi possível realizar o login."
    );
  } finally {
    LoginView.definirCarregamento(false);
  }
}

if (LoginView.formulario) {
  LoginView.formulario.addEventListener("submit", realizarLogin);
}
