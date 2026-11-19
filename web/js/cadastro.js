/* Cadastro de trabalhador ou empregador, com validação em JS e mensagens na página. */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cadastro");
  const resumo = document.getElementById("resumo-erros");
  const botao = document.getElementById("botao-criar");
  const campo = (id) => document.getElementById(id);

  // ---------- montar opções a partir dos arrays ----------
  preencherSelect(campo("cidade"), opcoesCidades(), "Selecione a cidade");

  const atuacao = campo("atuacao");
  const selecionadas = campo("selecionadas-atuacao");
  preencherSelect(atuacao, opcoesCidades());
  mostrarSelecionadas(atuacao, selecionadas);

  const disponibilidade = campo("disponibilidade");
  for (const chave in DISPONIBILIDADES) {
    disponibilidade.append(criar("label", { classe: "opcao" }, [
      criar("input", { type: "radio", name: "disponibilidade", value: chave }),
      DISPONIBILIDADES[chave]
    ]));
  }

  // a cidade onde mora já entra marcada nas cidades de trabalho
  campo("cidade").addEventListener("change", () => {
    const opcao = atuacao.querySelector('option[value="' + campo("cidade").value + '"]');
    if (opcao) opcao.selected = true;
    mostrarSelecionadas(atuacao, selecionadas);
  });

  // ---------- trocar entre trabalhador e empregador ----------
  function tipoConta() {
    return form.querySelector('input[name="tipo"]:checked').value;
  }

  function aplicarTipo() {
    const trabalhador = tipoConta() === "trabalhador";
    for (const el of form.querySelectorAll(".so-trabalhador")) el.classList.toggle("oculto", !trabalhador);
    for (const el of form.querySelectorAll(".so-empregador")) el.classList.toggle("oculto", trabalhador);
    campo("rotulo-cidade").textContent = trabalhador ? "Cidade onde você mora" : "Sua cidade";
    campo("descricao").placeholder = trabalhador
      ? "Ex.: Trabalho há 6 anos em pousadas, sou pontual e caprichosa."
      : "Ex.: Tenho um sítio no bairro rural e contrato ajudantes na colheita.";
    limparErros();
  }
  for (const radio of form.querySelectorAll('input[name="tipo"]')) radio.addEventListener("change", aplicarTipo);

  // ---------- força da senha ----------
  campo("senha").addEventListener("input", () => {
    const s = campo("senha").value;
    let pontos = 0;
    if (s.length >= 8) pontos++;
    if (/[A-Za-z]/.test(s) && /\d/.test(s)) pontos++;
    if (s.length >= 12 || /[^A-Za-z0-9]/.test(s)) pontos++;
    const barra = campo("barra-forca");
    barra.style.width = (pontos / 3) * 100 + "%";
    barra.style.background = ["#c0262d", "#c0262d", "#d97706", "#15803d"][pontos];
  });

  // ---------- validação ----------
  const regras = {
    nome: () => Validar.obrigatorio(campo("nome").value, "Nome"),
    username: () => Validar.username(campo("username").value),
    cpf: () => (tipoConta() === "trabalhador" ? Validar.cpf(campo("cpf").value) : ""),
    documento: () => (tipoConta() === "empregador" ? Validar.documento(campo("documento").value) : ""),
    email: () => Validar.email(campo("email").value),
    telefone: () => Validar.telefone(campo("telefone").value),
    senha: () => Validar.senha(campo("senha").value),
    senha2: () => (campo("senha2").value !== campo("senha").value ? "As senhas não conferem." : ""),
    cidade: () => (campo("cidade").value ? "" : "Escolha sua cidade."),
    atuacao: () => (tipoConta() === "trabalhador" && atuacao.selectedOptions.length === 0
      ? "Marque pelo menos uma cidade." : ""),
    disponibilidade: () => (tipoConta() === "trabalhador" && !form.querySelector('input[name="disponibilidade"]:checked')
      ? "Escolha sua disponibilidade." : "")
  };

  function mostrarErro(nome, mensagem) {
    campo("erro-" + nome).textContent = mensagem;
    const entrada = campo(nome);
    if (entrada) entrada.setAttribute("aria-invalid", mensagem ? "true" : "false");
  }

  function validarCampo(nome) {
    const mensagem = regras[nome]();
    mostrarErro(nome, mensagem);
    return mensagem;
  }

  function limparErros() {
    for (const nome in regras) mostrarErro(nome, "");
    resumo.textContent = "";
    resumo.className = "aviso";
  }

  // valida ao sair do campo; depois do primeiro erro, valida enquanto digita
  for (const nome in regras) {
    const entrada = campo(nome);
    if (!entrada || entrada.tagName === "DIV") continue;
    entrada.addEventListener("blur", () => validarCampo(nome));
    entrada.addEventListener("input", () => {
      if (entrada.getAttribute("aria-invalid") === "true") validarCampo(nome);
    });
  }
  atuacao.addEventListener("change", () => {
    mostrarSelecionadas(atuacao, selecionadas);
    validarCampo("atuacao");
  });
  disponibilidade.addEventListener("change", () => validarCampo("disponibilidade"));

  // ---------- envio ----------
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    let primeiro = null;
    let total = 0;
    for (const nome in regras) {
      if (validarCampo(nome)) {
        total++;
        if (!primeiro) primeiro = nome;
      }
    }
    if (total > 0) {
      resumo.className = "aviso erro";
      resumo.textContent = total === 1 ? "Corrija 1 campo para continuar." : "Corrija " + total + " campos para continuar.";
      const alvo = campo(primeiro) && campo(primeiro).tagName !== "DIV"
        ? campo(primeiro)
        : form.querySelector('[name="' + primeiro + '"]');
      if (alvo) alvo.focus();
      return;
    }
    if (!Senha.disponivel()) {
      resumo.className = "aviso erro";
      resumo.textContent = "Seu navegador não permite proteger a senha nesta página. Abra pelo link do GitHub Pages.";
      return;
    }

    botao.disabled = true;
    botao.textContent = "Protegendo sua senha...";
    const senhaHash = await Senha.gerarHash(campo("senha").value);

    const comum = {
      nome: campo("nome").value.trim(),
      username: campo("username").value.trim().toLowerCase().replace(/^@/, ""),
      email: campo("email").value.trim().toLowerCase(),
      telefone: Validar.somenteDigitos(campo("telefone").value),
      senhaHash: senhaHash,
      descricao: campo("descricao").value.trim() || null,
      idCidade: Number(campo("cidade").value),
      dataCadastro: Formato.hoje()
    };

    if (tipoConta() === "trabalhador") {
      const lista = Banco.dados.trabalhadores;
      const novo = Object.assign({ id: Banco.proximoId(lista) }, comum, {
        cpf: Validar.somenteDigitos(campo("cpf").value),
        habilidades: campo("habilidades").value.trim() || null,
        disponibilidade: form.querySelector('input[name="disponibilidade"]:checked').value,
        cidadesAtuacao: valoresSelecionados(atuacao)
      });
      lista.push(novo);
      Banco.salvar();
      Sessao.entrar("trabalhador", novo.id);
    } else {
      const lista = Banco.dados.empregadores;
      const novo = Object.assign({ id: Banco.proximoId(lista) }, comum, {
        documento: Validar.somenteDigitos(campo("documento").value),
        nomeNegocio: campo("negocio").value.trim() || null
      });
      lista.push(novo);
      Banco.salvar();
      Sessao.entrar("empregador", novo.id);
    }
    window.location.href = "painel.html?bemvindo=1";
  });
});
