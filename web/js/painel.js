/* =====================================================================
   Painel: área logada.
   Trabalhador: vagas compatíveis, candidaturas (cancelar) e perfil.
   Empregador: responder candidaturas (aceitar/recusar), CRUD de vagas.
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const sessao = Sessao.atual();
  if (!sessao) {
    window.location.href = "entrar.html";
    return;
  }

  const usuario = sessao.usuario;
  const conteudo = document.getElementById("conteudo");
  const abasEl = document.getElementById("abas");

  const boasVindas = document.getElementById("boas-vindas");
  if (new URLSearchParams(window.location.search).get("bemvindo")) {
    boasVindas.textContent = "Conta criada! Bem-vindo(a) à Trampu, " + usuario.nome.split(" ")[0] + ".";
  }

  // ---------- topo com o perfil ----------
  function montarTopo() {
    const detalhe = sessao.tipo === "trabalhador"
      ? "Trabalhador · mora em " + Formato.cidade(usuario.idCidade)
      : "Empregador" + (usuario.nomeNegocio ? " · " + usuario.nomeNegocio : "") + " · " + Formato.cidade(usuario.idCidade);
    document.getElementById("perfil-topo").replaceChildren(
      avatar(usuario.nome, true),
      criar("div", null, [
        criar("h1", { style: "font-size:clamp(1.6rem,4vw,2.2rem);margin:0", texto: "Olá, " + usuario.nome.split(" ")[0] }),
        criar("p", { texto: "@" + usuario.username + " · " + detalhe })
      ])
    );
  }

  // ---------- abas ----------
  let abas = [];
  let abaAtual = 0;

  function montarAbas() {
    abasEl.replaceChildren(...abas.map((aba, i) => {
      const contagem = aba.contagem ? aba.contagem() : 0;
      return criar("button", {
        type: "button", role: "tab", id: "aba-" + i,
        "aria-selected": i === abaAtual ? "true" : "false",
        onclick: () => { abaAtual = i; atualizar(); }
      }, [aba.titulo, contagem > 0 ? criar("span", { classe: "contagem", texto: contagem }) : null]);
    }));
  }

  function atualizar() {
    montarAbas();
    conteudo.setAttribute("role", "tabpanel");
    conteudo.setAttribute("aria-labelledby", "aba-" + abaAtual);
    conteudo.replaceChildren(abas[abaAtual].render());
  }

  function vazio(texto, acao) {
    return criar("div", { classe: "vazio" }, [criar("p", { texto: texto }), acao || null]);
  }

  function etiquetaStatus(status) {
    return criar("span", { classe: "etiqueta " + status, texto: STATUS_CANDIDATURA[status] });
  }

  function linkContato(pessoa) {
    return criar("a", {
      classe: "contato", href: Formato.whatsapp(pessoa.telefone), target: "_blank", rel: "noopener",
      texto: "WhatsApp: " + Formato.telefone(pessoa.telefone)
    });
  }

  // =================================================================
  // TRABALHADOR
  // =================================================================

  function minhasCandidaturas() {
    return Banco.dados.candidaturas
      .filter((c) => c.idTrabalhador === usuario.id)
      .sort((a, b) => b.dataCandidatura.localeCompare(a.dataCandidatura));
  }

  function abaVagasParaMim() {
    const vagas = Banco.vagasAbertas()
      .filter((v) => usuario.cidadesAtuacao.includes(v.idCidade))
      .sort((a, b) => b.dataPublicacao.localeCompare(a.dataPublicacao));
    const nomes = usuario.cidadesAtuacao.map((id) => Banco.cidade(id).nome).join(", ");
    const bloco = criar("div", null, [
      criar("p", { classe: "contador", texto: vagas.length + " vaga(s) abertas em " + nomes + "." })
    ]);
    if (vagas.length === 0) {
      bloco.append(vazio("Nenhuma vaga aberta nas suas cidades agora.",
        criar("a", { classe: "botao secundario", href: "vagas.html", texto: "Ver todas as vagas" })));
    } else {
      bloco.append(criar("div", { classe: "grade" }, vagas.map((v) => cartaoVaga(v, (vaga) => {
        abrirDetalhe(vaga);
        document.getElementById("detalhe").addEventListener("close", atualizar, { once: true });
      }))));
    }
    return bloco;
  }

  function abaCandidaturas() {
    const lista = minhasCandidaturas();
    if (lista.length === 0) {
      return vazio("Você ainda não se candidatou a nenhuma vaga.",
        criar("a", { classe: "botao", href: "vagas.html", texto: "Procurar vagas" }));
    }
    return criar("div", { classe: "lista" }, lista.map((c) => {
      const vaga = Banco.vaga(c.idVaga);
      const empregador = Banco.empregador(vaga.idEmpregador);
      const acoes = criar("div", { classe: "acoes" });

      if (c.status === "ENVIADA") {
        const cancelar = criar("button", { classe: "botao perigo pequeno", type: "button", texto: "Cancelar candidatura" });
        cancelar.addEventListener("click", () => {
          // confirmação na própria página, sem janela do navegador
          if (cancelar.dataset.confirmar) {
            c.status = "CANCELADA";
            c.dataResposta = Formato.hoje();
            Banco.salvar();
            atualizar();
          } else {
            cancelar.dataset.confirmar = "1";
            cancelar.textContent = "Clique de novo para confirmar";
          }
        });
        acoes.append(cancelar);
      }

      return criar("article", { classe: "item" }, [
        criar("div", { classe: "cabeca" }, [criar("h3", { texto: vaga.titulo }), etiquetaStatus(c.status)]),
        criar("p", { classe: "meta", texto: Formato.nomeEmpregador(empregador) + " · " + Formato.cidade(vaga.idCidade)
          + " · " + Formato.quando(vaga) + " · " + Formato.moeda(vaga.valor) + " " + PERIODOS[vaga.periodo] }),
        criar("p", { classe: "meta", texto: "Enviada em " + Formato.data(c.dataCandidatura)
          + (c.dataResposta ? " · respondida em " + Formato.data(c.dataResposta) : "") }),
        c.mensagem ? criar("p", { classe: "recado", texto: "“" + c.mensagem + "”" }) : null,
        c.status === "ACEITA" ? linkContato(empregador) : null,
        acoes.childElementCount ? acoes : null
      ]);
    }));
  }

  // =================================================================
  // PERFIL (trabalhador e empregador): editar os próprios dados
  // =================================================================

  function abaPerfil() {
    const trab = sessao.tipo === "trabalhador";
    const form = criar("form", { classe: "cartao", novalidate: true });
    const resumo = criar("div", { classe: "aviso", role: "alert" });
    const regras = []; // [entrada, função que devolve a mensagem de erro]

    function campo(id, rotulo, entrada, dica, validar) {
      entrada.id = id;
      entrada.setAttribute("aria-describedby", (dica ? "dica-" + id + " " : "") + "erro-" + id);
      if (validar) regras.push([entrada, validar]);
      return criar("div", { classe: "campo" }, [
        criar("label", { for: id }, rotulo),
        entrada,
        dica ? criar("span", { classe: "dica", id: "dica-" + id, texto: dica }) : null,
        criar("p", { classe: "erro-campo", id: "erro-" + id })
      ]);
    }
    const opcional = (t) => [t + " ", criar("span", { classe: "opcional", texto: "(opcional)" })];

    function validar(entrada, fn) {
      const msg = fn();
      document.getElementById("erro-" + entrada.id).textContent = msg;
      entrada.setAttribute("aria-invalid", msg ? "true" : "false");
      return msg;
    }

    // ---------- campos com os valores atuais ----------
    const nome = criar("input", { maxlength: "100", autocomplete: "name", value: usuario.nome });
    const username = criar("input", { maxlength: "31", autocomplete: "username", value: usuario.username });
    const email = criar("input", { type: "email", maxlength: "100", autocomplete: "email", value: usuario.email });
    const telefone = criar("input", { type: "tel", inputmode: "tel", maxlength: "16", value: Formato.telefone(usuario.telefone) });
    const cidade = criar("select");
    preencherSelect(cidade, opcoesCidades());
    cidade.value = String(usuario.idCidade);
    const descricao = criar("textarea", { maxlength: "500" });
    descricao.value = usuario.descricao || "";

    const blocoComum = [
      campo("e-nome", "Nome completo", nome, null, () => Validar.obrigatorio(nome.value, "Nome")),
      criar("div", { classe: "linha-2" }, [
        campo("e-username", "Username", username, null, () => Validar.username(username.value, usuario)),
        campo("e-email", "E-mail", email, null, () => Validar.email(email.value, usuario))
      ]),
      criar("div", { classe: "linha-2" }, [
        campo("e-telefone", "WhatsApp com DDD", telefone, null, () => Validar.telefone(telefone.value)),
        campo("e-cidade", trab ? "Cidade onde você mora" : "Sua cidade", cidade, null, () => (cidade.value ? "" : "Escolha sua cidade."))
      ])
    ];

    // ---------- campos de cada tipo de conta ----------
    let blocoTipo = [];
    let habilidades, disponibilidade, atuacao, negocio;
    if (trab) {
      habilidades = criar("input", { maxlength: "255", placeholder: "Ex.: pedreiro, pintura, garçom", value: usuario.habilidades || "" });
      disponibilidade = criar("select");
      preencherSelect(disponibilidade, Object.keys(DISPONIBILIDADES).map((k) => ({ valor: k, texto: DISPONIBILIDADES[k] })));
      disponibilidade.value = usuario.disponibilidade;

      atuacao = criar("select", { multiple: true, size: "8" });
      preencherSelect(atuacao, opcoesCidades());
      for (const opcao of atuacao.options) opcao.selected = usuario.cidadesAtuacao.includes(Number(opcao.value));
      const marcadas = criar("span", { classe: "selecionadas", "aria-live": "polite" });
      mostrarSelecionadas(atuacao, marcadas);
      atuacao.addEventListener("change", () => mostrarSelecionadas(atuacao, marcadas));

      const campoAtuacao = campo("e-atuacao", "Cidades onde você aceita trabalhar", atuacao,
        "Para marcar mais de uma, segure Ctrl (ou Cmd no Mac) e clique. No celular, toque em cada cidade.",
        () => (atuacao.selectedOptions.length ? "" : "Marque pelo menos uma cidade."));
      campoAtuacao.insertBefore(marcadas, campoAtuacao.lastChild);

      blocoTipo = [
        criar("div", { classe: "linha-2" }, [
          campo("e-habilidades", opcional("O que você sabe fazer"), habilidades),
          campo("e-disponibilidade", "Disponibilidade", disponibilidade)
        ]),
        campoAtuacao
      ];
    } else {
      negocio = criar("input", { maxlength: "100", placeholder: "Ex.: Mercadinho do Zé", value: usuario.nomeNegocio || "" });
      blocoTipo = [campo("e-negocio", opcional("Nome do negócio"), negocio)];
    }

    // dados que não mudam
    const fixos = criar("dl", { classe: "ficha" }, [
      [trab ? "CPF" : "CPF/CNPJ", trab ? usuario.cpf : usuario.documento],
      ["Na Trampu desde", Formato.data(usuario.dataCadastro)]
    ].map(([r, v]) => criar("div", null, [criar("dt", { texto: r }), criar("dd", { texto: v })])));

    form.append(
      criar("h2", { texto: "Editar meu perfil" }),
      criar("p", { classe: "meta", texto: "Seu WhatsApp e e-mail só aparecem para quem você combinar um trampo." }),
      resumo,
      ...blocoComum,
      ...blocoTipo,
      campo("e-descricao", opcional(trab ? "Conte um pouco sobre você" : "Conte quem você é e o que contrata"), descricao),
      fixos,
      criar("p", { classe: "dica", texto: "O documento não pode ser alterado por aqui." }),
      criar("button", { classe: "botao largo", type: "submit", texto: "Salvar alterações" })
    );

    // valida ao sair do campo; depois do primeiro erro, valida enquanto digita
    for (const [entrada, fn] of regras) {
      const revalidar = () => { if (entrada.getAttribute("aria-invalid") === "true") validar(entrada, fn); };
      entrada.addEventListener("blur", () => validar(entrada, fn));
      entrada.addEventListener("input", revalidar);
      entrada.addEventListener("change", revalidar);
    }

    form.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const comErro = regras.filter(([entrada, fn]) => validar(entrada, fn));
      if (comErro.length) {
        resumo.className = "aviso erro";
        resumo.textContent = comErro.length === 1 ? "Corrija 1 campo para salvar." : "Corrija " + comErro.length + " campos para salvar.";
        comErro[0][0].focus();
        return;
      }

      usuario.nome = nome.value.trim();
      usuario.username = username.value.trim().toLowerCase().replace(/^@/, "");
      usuario.email = email.value.trim().toLowerCase();
      usuario.telefone = Validar.somenteDigitos(telefone.value);
      usuario.idCidade = Number(cidade.value);
      usuario.descricao = descricao.value.trim() || null;
      if (trab) {
        usuario.habilidades = habilidades.value.trim() || null;
        usuario.disponibilidade = disponibilidade.value;
        usuario.cidadesAtuacao = valoresSelecionados(atuacao);
      } else {
        usuario.nomeNegocio = negocio.value.trim() || null;
      }
      Banco.salvar();

      montarTopo();
      atualizar();
      conteudo.prepend(criar("div", { classe: "aviso ok", role: "status", texto: "Perfil atualizado!" }));
    });

    return form;
  }

  // =================================================================
  // EMPREGADOR
  // =================================================================

  function minhasVagas() {
    return Banco.dados.vagas
      .filter((v) => v.idEmpregador === usuario.id)
      .sort((a, b) => b.id - a.id);
  }

  function pendentesDoEmpregador() {
    const ids = minhasVagas().map((v) => v.id);
    return Banco.dados.candidaturas.filter((c) => ids.includes(c.idVaga) && c.status === "ENVIADA");
  }

  /** Fecha a vaga e avisa quem ainda esperava resposta. */
  function fecharVaga(vaga) {
    vaga.status = "FECHADA";
    for (const c of Banco.dados.candidaturas) {
      if (c.idVaga === vaga.id && c.status === "ENVIADA") {
        c.status = "RECUSADA";
        c.mensagem = "A vaga foi encerrada pelo empregador.";
        c.dataResposta = Formato.hoje();
      }
    }
  }

  function abaCandidatos() {
    const pendentes = pendentesDoEmpregador();
    const ids = minhasVagas().map((v) => v.id);
    const respondidas = Banco.dados.candidaturas
      .filter((c) => ids.includes(c.idVaga) && c.status === "ACEITA")
      .sort((a, b) => (b.dataResposta || "").localeCompare(a.dataResposta || ""));

    const bloco = criar("div");
    bloco.append(criar("h2", { texto: "Aguardando sua resposta" }));
    if (pendentes.length === 0) {
      bloco.append(vazio("Nenhuma candidatura aguardando. Tudo em dia!"));
    } else {
      bloco.append(criar("div", { classe: "lista" }, pendentes.map(itemPendente)));
    }

    bloco.append(criar("h2", { style: "margin-top:32px", texto: "Pessoas que você aceitou" }));
    if (respondidas.length === 0) {
      bloco.append(vazio("Ninguém aceito ainda."));
    } else {
      bloco.append(criar("div", { classe: "lista" }, respondidas.map((c) => {
        const t = Banco.trabalhador(c.idTrabalhador);
        return criar("article", { classe: "item" }, [
          criar("div", { classe: "cabeca" }, [
            criar("h3", { texto: t.nome + " · @" + t.username }), etiquetaStatus(c.status)
          ]),
          criar("p", { classe: "meta", texto: "Vaga: " + Banco.vaga(c.idVaga).titulo + " · aceito em " + Formato.data(c.dataResposta) }),
          c.mensagem ? criar("p", { classe: "recado", texto: "Seu recado: “" + c.mensagem + "”" }) : null,
          linkContato(t)
        ]);
      })));
    }
    return bloco;
  }

  function itemPendente(c) {
    const t = Banco.trabalhador(c.idTrabalhador);
    const vaga = Banco.vaga(c.idVaga);
    const recado = criar("input", { type: "text", maxlength: "255", placeholder: "Recado (opcional): ex.: chegar às 7h", "aria-label": "Recado para " + t.nome });
    const aviso = criar("div", { classe: "aviso", role: "status" });

    function responder(status) {
      if (status === "ACEITA" && Banco.restantes(vaga) <= 0) {
        aviso.className = "aviso erro";
        aviso.textContent = "Todos os lugares desta vaga já foram preenchidos.";
        return;
      }
      c.status = status;
      c.mensagem = recado.value.trim() || null;
      c.dataResposta = Formato.hoje();
      if (status === "ACEITA" && Banco.restantes(vaga) === 0) {
        fecharVaga(vaga);
      }
      Banco.salvar();
      atualizar();
    }

    return criar("article", { classe: "item" }, [
      criar("div", { classe: "cabeca" }, [
        criar("div", { style: "display:flex;gap:10px;align-items:center" }, [
          avatar(t.nome),
          criar("div", null, [criar("h3", { texto: t.nome }), criar("span", { classe: "meta", texto: "@" + t.username })])
        ]),
        etiquetaStatus(c.status)
      ]),
      criar("p", { classe: "meta", texto: "Vaga: " + vaga.titulo + " (" + Banco.restantes(vaga) + " de " + vaga.quantidade + " lugares livres)" }),
      criar("p", { classe: "meta", texto: "Mora em " + Formato.cidade(t.idCidade) + " · " + DISPONIBILIDADES[t.disponibilidade]
        + (t.habilidades ? " · " + t.habilidades : "") }),
      t.descricao ? criar("p", { classe: "recado", texto: "“" + t.descricao + "”" }) : null,
      criar("p", { classe: "meta", texto: "🔒 O WhatsApp aparece depois que você aceitar." }),
      aviso,
      criar("div", { classe: "acoes" }, [
        recado,
        criar("button", { classe: "botao ok pequeno", type: "button", texto: "Aceitar", onclick: () => responder("ACEITA") }),
        criar("button", { classe: "botao perigo pequeno", type: "button", texto: "Recusar", onclick: () => responder("RECUSADA") })
      ])
    ]);
  }

  function abaMinhasVagas() {
    const vagas = minhasVagas();
    const abertas = vagas.filter((v) => v.status === "ABERTA");
    const lugares = abertas.reduce((s, v) => s + Banco.restantes(v), 0);
    const aceitos = vagas.reduce((s, v) => s + Banco.aceitos(v), 0);

    const bloco = criar("div", null, [
      criar("div", { classe: "estatisticas" }, [
        [abertas.length, "vagas abertas"],
        [lugares, "lugares livres"],
        [pendentesDoEmpregador().length, "aguardando resposta"],
        [aceitos, "pessoas contratadas"]
      ].map(([n, t]) => criar("div", null, [criar("strong", { texto: n }), criar("span", { texto: t })])))
    ]);

    if (vagas.length === 0) {
      bloco.append(vazio("Você ainda não publicou vagas.",
        criar("button", { classe: "botao", type: "button", texto: "Publicar vaga", onclick: () => { abaAtual = 2; atualizar(); } })));
      return bloco;
    }

    bloco.append(criar("div", { classe: "lista" }, vagas.map((vaga) => {
      const aviso = criar("div", { classe: "aviso", role: "status" });
      const acoes = criar("div", { classe: "acoes" }, [
        criar("button", { classe: "botao secundario pequeno", type: "button", texto: "Ver", onclick: () => abrirDetalhe(vaga) })
      ]);

      if (vaga.status === "ABERTA") {
        const fechar = criar("button", { classe: "botao secundario pequeno", type: "button", texto: "Fechar vaga" });
        fechar.addEventListener("click", () => {
          if (!fechar.dataset.confirmar) {
            fechar.dataset.confirmar = "1";
            fechar.textContent = "Confirmar: fechar";
            return;
          }
          fecharVaga(vaga);
          Banco.salvar();
          atualizar();
        });
        acoes.append(fechar);
      }

      const remover = criar("button", { classe: "botao perigo pequeno", type: "button", texto: "Remover" });
      remover.addEventListener("click", () => {
        if (Banco.aceitos(vaga) > 0) {
          aviso.className = "aviso erro";
          aviso.textContent = "Esta vaga já tem pessoas aceitas. Feche a vaga em vez de removê-la.";
          return;
        }
        if (!remover.dataset.confirmar) {
          remover.dataset.confirmar = "1";
          remover.textContent = "Confirmar: remover";
          return;
        }
        Banco.dados.candidaturas = Banco.dados.candidaturas.filter((c) => c.idVaga !== vaga.id);
        Banco.dados.vagas = Banco.dados.vagas.filter((v) => v.id !== vaga.id);
        Banco.salvar();
        atualizar();
      });
      acoes.append(remover);

      const pend = Banco.dados.candidaturas.filter((c) => c.idVaga === vaga.id && c.status === "ENVIADA").length;
      return criar("article", { classe: "item" }, [
        criar("div", { classe: "cabeca" }, [
          criar("h3", { texto: "#" + vaga.id + " " + vaga.titulo }),
          criar("div", { style: "display:flex;gap:6px" }, [
            etiquetaTipo(vaga.tipo),
            vaga.status === "FECHADA" ? criar("span", { classe: "etiqueta FECHADA", texto: "Fechada" }) : null
          ])
        ]),
        criar("p", { classe: "meta", texto: Formato.moeda(vaga.valor) + " " + PERIODOS[vaga.periodo] + " · "
          + Formato.cidade(vaga.idCidade) + " · " + Formato.quando(vaga) }),
        criar("p", { classe: "meta", texto: Banco.aceitos(vaga) + "/" + vaga.quantidade + " preenchida(s) · "
          + pend + " aguardando resposta" }),
        aviso,
        acoes
      ]);
    })));
    return bloco;
  }

  function abaPublicar() {
    const form = criar("form", { classe: "cartao", novalidate: true });
    const resumo = criar("div", { classe: "aviso", role: "alert" });

    function campo(id, rotulo, entrada, dica) {
      entrada.id = id;
      entrada.setAttribute("aria-describedby", "erro-" + id);
      return criar("div", { classe: "campo", "data-campo": id }, [
        criar("label", { for: id }, rotulo),
        entrada,
        dica ? criar("span", { classe: "dica", texto: dica }) : null,
        criar("p", { classe: "erro-campo", id: "erro-" + id })
      ]);
    }
    const opcional = (t) => [t + " ", criar("span", { classe: "opcional", texto: "(opcional)" })];

    const titulo = criar("input", { maxlength: "100", placeholder: "Ex.: Garçom para casamento" });
    const descricao = criar("textarea", { maxlength: "500", placeholder: "O que a pessoa vai fazer?" });
    const tipos = criar("div", { classe: "opcoes" }, [
      ["FIXO", "Fixo · sem data para acabar"],
      ["TEMPORARIO", "Temporário · período definido"],
      ["BICO", "Bico · um ou poucos dias"]
    ].map(([v, t], i) => criar("label", { classe: "opcao" }, [
      criar("input", { type: "radio", name: "tipo", value: v, checked: i === 2 }), t
    ])));
    const inicio = criar("input", { type: "date", min: Formato.hoje() });
    const fim = criar("input", { type: "date", min: Formato.hoje() });
    const valor = criar("input", { type: "number", min: "0.01", step: "0.01", inputmode: "decimal", placeholder: "Ex.: 150" });
    const periodo = criar("select");
    preencherSelect(periodo, Object.keys(PERIODOS).map((k) => ({ valor: k, texto: PERIODOS[k] })), "Selecione");
    const quantidade = criar("input", { type: "number", min: "1", max: "500", value: "1" });
    const horario = criar("input", { maxlength: "100", placeholder: "Ex.: seg a sex, 7h às 16h" });
    const cidade = criar("select");
    preencherSelect(cidade, opcoesCidades(), "Selecione");
    cidade.value = String(usuario.idCidade);
    const bairro = criar("input", { maxlength: "80", placeholder: "Ex.: Centro, Zona rural" });
    const categoria = criar("select");
    preencherSelect(categoria, opcoesCategorias(), "Selecione");
    const dicaCategoria = criar("span", { classe: "dica" });
    categoria.addEventListener("change", () => {
      const c = Banco.categoria(Number(categoria.value));
      dicaCategoria.textContent = c ? c.descricao : "";
    });

    const datas = criar("div", { classe: "linha-2" }, [
      campo("p-inicio", "Data de início", inicio),
      campo("p-fim", "Último dia", fim, "Se for um dia só, repita a data de início.")
    ]);
    const tipoAtual = () => form.querySelector('input[name="tipo"]:checked').value;
    tipos.addEventListener("change", () => datas.classList.toggle("oculto", tipoAtual() === "FIXO"));

    const campoCategoria = campo("p-categoria", "Área", categoria);
    campoCategoria.insertBefore(dicaCategoria, campoCategoria.lastChild);

    form.append(
      criar("h2", { texto: "Publicar vaga" }),
      resumo,
      campo("p-titulo", "Título da vaga", titulo),
      campo("p-descricao", "Descrição", descricao),
      criar("fieldset", null, [criar("legend", { classe: "legenda", texto: "Tipo de trabalho" }), tipos]),
      datas,
      criar("div", { classe: "linha-2" }, [
        campo("p-valor", "Valor (R$)", valor),
        campo("p-periodo", "O valor é", periodo)
      ]),
      criar("div", { classe: "linha-2" }, [
        campo("p-quantidade", "Quantas pessoas?", quantidade),
        campo("p-horario", opcional("Horário"), horario)
      ]),
      criar("div", { classe: "linha-2" }, [
        campo("p-cidade", "Cidade do trabalho", cidade),
        campo("p-bairro", opcional("Bairro ou local"), bairro)
      ]),
      campoCategoria,
      criar("button", { classe: "botao largo", type: "submit", texto: "Publicar vaga" })
    );

    function erro(entrada, texto) {
      document.getElementById("erro-" + entrada.id).textContent = texto;
      entrada.setAttribute("aria-invalid", texto ? "true" : "false");
      return texto ? 1 : 0;
    }

    form.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const fixo = tipoAtual() === "FIXO";
      const hoje = Formato.hoje();
      const v = Number(valor.value);
      const q = Number(quantidade.value);
      let total = 0;
      total += erro(titulo, titulo.value.trim() ? "" : "Dê um título para a vaga.");
      total += erro(descricao, descricao.value.trim() ? "" : "Descreva o trabalho.");
      total += erro(inicio, fixo || inicio.value ? (!fixo && inicio.value < hoje ? "A data não pode estar no passado." : "") : "Informe a data de início.");
      total += erro(fim, fixo || fim.value ? (!fixo && fim.value < inicio.value ? "O fim não pode ser antes do início." : "") : "Informe o último dia.");
      total += erro(valor, v > 0 ? "" : "O valor é obrigatório e precisa ser maior que zero.");
      total += erro(periodo, periodo.value ? "" : "Diga se o valor é por hora, dia, mês...");
      total += erro(quantidade, Number.isInteger(q) && q >= 1 && q <= 500 ? "" : "Informe de 1 a 500 pessoas.");
      total += erro(cidade, cidade.value ? "" : "Escolha a cidade.");
      total += erro(categoria, categoria.value ? "" : "Escolha a área.");

      if (total > 0) {
        resumo.className = "aviso erro";
        resumo.textContent = total === 1 ? "Corrija 1 campo para publicar." : "Corrija " + total + " campos para publicar.";
        const primeiro = form.querySelector('[aria-invalid="true"]');
        if (primeiro) primeiro.focus();
        return;
      }

      const nova = {
        id: Banco.proximoId(Banco.dados.vagas),
        titulo: titulo.value.trim(),
        descricao: descricao.value.trim(),
        tipo: tipoAtual(),
        valor: Math.round(v * 100) / 100,
        periodo: periodo.value,
        dataInicio: fixo ? null : inicio.value,
        dataFim: fixo ? null : fim.value,
        horario: horario.value.trim() || null,
        bairro: bairro.value.trim() || null,
        quantidade: q,
        status: "ABERTA",
        idEmpregador: usuario.id,
        idCidade: Number(cidade.value),
        idCategoria: Number(categoria.value),
        dataPublicacao: hoje
      };
      Banco.dados.vagas.push(nova);
      Banco.salvar();
      abaAtual = 1;
      atualizar();
      const ok = criar("div", { classe: "aviso ok", role: "status", texto: "Vaga #" + nova.id + " publicada!" });
      conteudo.prepend(ok);
    });

    return form;
  }

  // =================================================================

  if (sessao.tipo === "trabalhador") {
    abas = [
      { titulo: "Vagas para você", render: abaVagasParaMim },
      { titulo: "Minhas candidaturas", render: abaCandidaturas },
      { titulo: "Meu perfil", render: abaPerfil }
    ];
  } else {
    abas = [
      { titulo: "Candidatos", render: abaCandidatos, contagem: () => pendentesDoEmpregador().length },
      { titulo: "Minhas vagas", render: abaMinhasVagas },
      { titulo: "Publicar vaga", render: abaPublicar },
      { titulo: "Meu perfil", render: abaPerfil }
    ];
  }

  montarTopo();
  atualizar();
});
