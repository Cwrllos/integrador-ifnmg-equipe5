
export const LoginView = {
  formulario: document.getElementById("loginForm"),
  email: document.getElementById("email"),
  senha: document.getElementById("password"),
  botao: document.getElementById("loginButton"),
  erro: document.getElementById("loginError"),

  mostrarErro(mensagem) {
    this.erro.textContent = mensagem;
    this.erro.classList.remove("hidden");
  },

  limparErro() {
    this.erro.textContent = "";
    this.erro.classList.add("hidden");
  },

  definirCarregamento(carregando) {
    this.botao.disabled = carregando;
    this.botao.textContent = carregando
      ? "Entrando..."
      : "Login Seguro";
  },

  obterCredenciais() {
    return {
      email: this.email.value.trim(),
      senha: this.senha.value,
    };
  },
};
