/* Login: confere a senha digitada com o hash PBKDF2 guardado. */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-entrar");
  const login = document.getElementById("login");
  const senha = document.getElementById("senha");
  const mensagem = document.getElementById("mensagem");
  const botao = document.getElementById("botao-entrar");
  const params = new URLSearchParams(window.location.search);

  if (Sessao.atual()) {
    window.location.href = "painel.html";
    return;
  }
  if (params.get("vaga")) {
    mensagem.className = "aviso info";
    mensagem.textContent = "Entre para se candidatar à vaga.";
  }

  function erro(campo, texto) {
    document.getElementById("erro-" + campo.id).textContent = texto;
    campo.setAttribute("aria-invalid", texto ? "true" : "false");
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensagem.className = "aviso";
    mensagem.textContent = "";

    erro(login, login.value.trim() ? "" : "Informe seu username ou e-mail.");
    erro(senha, senha.value ? "" : "Informe sua senha.");
    if (!login.value.trim()) { login.focus(); return; }
    if (!senha.value) { senha.focus(); return; }

    if (!Senha.disponivel()) {
      mensagem.className = "aviso erro";
      mensagem.textContent = "Seu navegador não permite verificar a senha nesta página. Abra pelo link do GitHub Pages.";
      return;
    }

    const chave = login.value.trim().toLowerCase().replace(/^@/, "");
    const encontrado = Banco.todosUsuarios().find((x) => x.usuario.username === chave || x.usuario.email === chave);

    botao.disabled = true;
    botao.textContent = "Conferindo...";
    const ok = encontrado ? await Senha.verificar(senha.value, encontrado.usuario.senhaHash) : false;
    botao.disabled = false;
    botao.textContent = "Entrar";

    if (!ok) {
      // mesma mensagem nos dois casos, para não revelar quais usuários existem
      mensagem.className = "aviso erro";
      mensagem.textContent = "Usuário ou senha incorretos.";
      senha.value = "";
      senha.focus();
      return;
    }

    Sessao.entrar(encontrado.tipo, encontrado.usuario.id);
    const idVaga = params.get("vaga");
    window.location.href = idVaga ? "vagas.html?vaga=" + encodeURIComponent(idVaga) : "painel.html";
  });
});
