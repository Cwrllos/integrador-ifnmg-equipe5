(function () {
  const CHAVE_TEMA = "occupacontrol-tema";

  function aplicarTema() {
    const tema = localStorage.getItem(CHAVE_TEMA);
    document.documentElement.classList.toggle(
      "dark",
      tema === "escuro"
    );
  }

  aplicarTema();

  window.addEventListener("storage", (evento) => {
    if (evento.key === CHAVE_TEMA) {
      aplicarTema();
    }
  });
})();