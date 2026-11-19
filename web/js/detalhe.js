/* =====================================================================
   Janela de detalhe da vaga (usada no início, em vagas e no painel).
   É aqui que o trabalhador se candidata.
   ===================================================================== */

function abrirDetalhe(vaga) {
  const dialogo = document.getElementById("detalhe");
  const corpo = dialogo.querySelector(".dialogo-corpo");
  const empregador = Banco.empregador(vaga.idEmpregador);
  const restantes = Banco.restantes(vaga);

  const ficha = criar("dl", { classe: "ficha" });
  const linhas = [
    ["Pagamento", Formato.moeda(vaga.valor) + " " + PERIODOS[vaga.periodo]],
    ["Quando", Formato.quando(vaga)],
    ["Horário", vaga.horario],
    ["Onde", (vaga.bairro ? vaga.bairro + ", " : "") + Formato.cidade(vaga.idCidade)],
    ["Categoria", Banco.categoria(vaga.idCategoria).nome],
    ["Vagas", restantes + " de " + vaga.quantidade + " disponível(is)"],
    ["Publicada em", Formato.data(vaga.dataPublicacao)]
  ];
  for (const [rotulo, valor] of linhas) {
    if (valor) ficha.append(criar("div", null, [criar("dt", { texto: rotulo }), criar("dd", { texto: valor })]));
  }

  const quem = criar("div", { classe: "pessoa" }, [
    avatar(empregador.nome, true),
    criar("div", null, [
      criar("strong", { texto: empregador.nome }),
      criar("p", { texto: (empregador.nomeNegocio ? empregador.nomeNegocio + " · " : "") + "@" + empregador.username + " · " + Formato.cidade(empregador.idCidade) }),
      empregador.descricao ? criar("p", { classe: "recado", texto: "“" + empregador.descricao + "”" }) : null
    ])
  ]);

  const status = criar("div", { classe: "aviso", role: "status" });
  const acoes = criar("div", { classe: "acoes" });
  montarAcoes(vaga, acoes, status);

  corpo.replaceChildren(
    criar("div", { classe: "dialogo-topo" }, [
      criar("div", null, [
        criar("div", { classe: "linha", style: "display:flex;gap:8px;margin-bottom:8px" }, [
          etiquetaTipo(vaga.tipo),
          vaga.status === "FECHADA" ? criar("span", { classe: "etiqueta FECHADA", texto: "Encerrada" }) : null
        ]),
        criar("h2", { id: "detalhe-titulo", texto: vaga.titulo })
      ]),
      criar("button", { classe: "fechar", type: "button", "aria-label": "Fechar", texto: "✕", onclick: () => dialogo.close() })
    ]),
    criar("p", { texto: vaga.descricao }),
    ficha,
    criar("h3", { texto: "Quem está contratando" }),
    quem,
    status,
    acoes
  );

  if (!dialogo.open) dialogo.showModal();
}

function montarAcoes(vaga, acoes, status) {
  const sessao = Sessao.atual();
  acoes.replaceChildren();
  status.className = "aviso";
  status.textContent = "";

  if (!sessao) {
    status.classList.add("info");
    status.textContent = "Entre ou crie sua conta de trabalhador para se candidatar.";
    acoes.append(
      criar("a", { classe: "botao", href: "entrar.html?vaga=" + vaga.id, texto: "Entrar" }),
      criar("a", { classe: "botao secundario", href: "cadastro.html", texto: "Criar conta" })
    );
    return;
  }

  if (sessao.tipo === "empregador") {
    status.classList.add("info");
    status.textContent = sessao.usuario.id === vaga.idEmpregador
      ? "Esta vaga é sua. Gerencie os candidatos no seu painel."
      : "Você está usando uma conta de empregador.";
    acoes.append(criar("a", { classe: "botao secundario", href: "painel.html", texto: "Ir para o painel" }));
    return;
  }

  const trabalhador = sessao.usuario;
  const existente = Banco.dados.candidaturas.find((c) => c.idVaga === vaga.id && c.idTrabalhador === trabalhador.id);
  if (existente) {
    status.classList.add(existente.status === "ACEITA" ? "ok" : "info");
    status.textContent = "Você já se candidatou: " + STATUS_CANDIDATURA[existente.status].toLowerCase() + ".";
    acoes.append(criar("a", { classe: "botao secundario", href: "painel.html", texto: "Ver minhas candidaturas" }));
    return;
  }
  if (vaga.status !== "ABERTA" || Banco.restantes(vaga) <= 0) {
    status.classList.add("erro");
    status.textContent = "Esta vaga já foi encerrada.";
    return;
  }
  if (!trabalhador.cidadesAtuacao.includes(vaga.idCidade)) {
    status.classList.add("info");
    status.textContent = "Atenção: " + Formato.cidade(vaga.idCidade) + " não está nas suas cidades de trabalho.";
  }

  acoes.append(criar("button", {
    classe: "botao largo", type: "button", texto: "Quero me candidatar",
    onclick: () => {
      Banco.dados.candidaturas.push({
        id: Banco.proximoId(Banco.dados.candidaturas),
        idTrabalhador: trabalhador.id,
        idVaga: vaga.id,
        status: "ENVIADA",
        mensagem: null,
        dataCandidatura: Formato.hoje(),
        dataResposta: null
      });
      Banco.salvar();
      montarAcoes(vaga, acoes, status);
      status.className = "aviso ok";
      status.textContent = "Candidatura enviada! Quando o empregador aceitar, o contato dele aparece no seu painel.";
    }
  }));
}

document.addEventListener("DOMContentLoaded", () => {
  const dialogo = document.getElementById("detalhe");
  if (!dialogo) return;
  // fechar clicando fora da janela
  dialogo.addEventListener("click", (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });
});
