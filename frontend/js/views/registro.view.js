
export class RegistroView {
  constructor() {
    this.formulario = document.querySelector("form");
    this.botao = document.getElementById("registerButton");
  }

  obterDados() {
    return {
      nome: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      departamento: document.getElementById("department").value,
      senha: document.getElementById("password").value,
      confirmarSenha: document.getElementById("confirmPassword").value,
      aceitouTermos: document.getElementById("terms").checked,
    };
  }

  validarDados(dados) {
    if (
      !dados.nome ||
      !dados.email ||
      !dados.departamento ||
      !dados.senha ||
      !dados.confirmarSenha
    ) {
      throw new Error("Preencha todos os campos obrigatórios.");
    }

    if (dados.senha.length < 8) {
      throw new Error("A senha deve ter pelo menos 8 caracteres.");
    }

    if (dados.senha !== dados.confirmarSenha) {
      throw new Error("As senhas informadas não coincidem.");
    }

    if (!dados.aceitouTermos) {
      throw new Error("Você precisa aceitar os termos para continuar.");
    }
  }

  mostrarErro(mensagem) {
    alert(mensagem);
  }

  mostrarSucesso(mensagem) {
    alert(mensagem);
    this.formulario.reset();
  }

  definirCarregamento(carregando) {
    this.botao.disabled = carregando;
    this.botao.textContent = carregando
      ? "Cadastrando..."
      : "Registrar Administrador";
  }
}
