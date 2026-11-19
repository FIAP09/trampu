/* =====================================================================
   TRAMPU - funções usadas por todas as páginas
   - Banco: guarda os arrays no navegador (localStorage) para que contas,
     vagas e candidaturas novas continuem ao trocar de página.
   - Sessao: quem está logado.
   - Formatação, validação e criação de elementos no DOM.
   ===================================================================== */

/* ----------------------------- Dados ----------------------------- */

const Banco = {
  // troque a versão quando mudar os dados de exemplo, para o navegador recarregar
  CHAVE: "trampu:dados:v2",
  dados: null,

  carregar() {
    let salvo = null;
    try {
      salvo = JSON.parse(localStorage.getItem(this.CHAVE));
    } catch (e) {
      salvo = null;
    }
    // cópia profunda dos dados iniciais, para nunca alterar o original
    this.dados = salvo || JSON.parse(JSON.stringify(DADOS_INICIAIS));
    return this.dados;
  },

  salvar() {
    try {
      localStorage.setItem(this.CHAVE, JSON.stringify(this.dados));
    } catch (e) {
      // sem armazenamento (aba anônima, por ex.): segue só em memória
    }
  },

  restaurar() {
    try {
      localStorage.removeItem(this.CHAVE);
      localStorage.removeItem(Sessao.CHAVE);
    } catch (e) { /* ignora */ }
    this.carregar();
  },

  proximoId(lista) {
    let maior = 0;
    for (const item of lista) {
      if (item.id > maior) maior = item.id;
    }
    return maior + 1;
  },

  cidade(id) { return this.dados.cidades.find((c) => c.id === id); },
  categoria(id) { return this.dados.categorias.find((c) => c.id === id); },
  vaga(id) { return this.dados.vagas.find((v) => v.id === id); },
  trabalhador(id) { return this.dados.trabalhadores.find((t) => t.id === id); },
  empregador(id) { return this.dados.empregadores.find((e) => e.id === id); },

  aceitos(vaga) {
    return this.dados.candidaturas.filter((c) => c.idVaga === vaga.id && c.status === "ACEITA").length;
  },

  restantes(vaga) {
    return vaga.quantidade - this.aceitos(vaga);
  },

  vagasAbertas() {
    return this.dados.vagas.filter((v) => v.status === "ABERTA");
  },

  /** Username e e-mail são únicos entre as duas contas. */
  todosUsuarios() {
    const t = this.dados.trabalhadores.map((u) => ({ tipo: "trabalhador", usuario: u }));
    const e = this.dados.empregadores.map((u) => ({ tipo: "empregador", usuario: u }));
    return t.concat(e);
  }
};

/* ----------------------------- Sessão ----------------------------- */

const Sessao = {
  CHAVE: "trampu:sessao",

  atual() {
    let s = null;
    try {
      s = JSON.parse(localStorage.getItem(this.CHAVE));
    } catch (e) {
      s = null;
    }
    if (!s) return null;
    const usuario = s.tipo === "trabalhador" ? Banco.trabalhador(s.id) : Banco.empregador(s.id);
    return usuario ? { tipo: s.tipo, usuario: usuario } : null;
  },

  entrar(tipo, id) {
    try {
      localStorage.setItem(this.CHAVE, JSON.stringify({ tipo: tipo, id: id }));
    } catch (e) { /* ignora */ }
  },

  sair() {
    try {
      localStorage.removeItem(this.CHAVE);
    } catch (e) { /* ignora */ }
  }
};

/* ----------------------------- Formatação ----------------------------- */

const Formato = {
  moeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  },

  data(iso) {
    if (!iso) return "-";
    const [a, m, d] = iso.split("-");
    return d + "/" + m + "/" + a;
  },

  dataComDia(iso) {
    const dias = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    const [a, m, d] = iso.split("-").map(Number);
    const dia = new Date(a, m - 1, d).getDay();
    return dias[dia] + ", " + this.data(iso);
  },

  /** Fixo: "Início a combinar". Bico de 1 dia: "sábado, 28/11/2026". Período: "01/12 a 10/01 (41 dias)". */
  quando(vaga) {
    if (vaga.tipo === "FIXO") return "Início a combinar";
    if (vaga.dataInicio === vaga.dataFim) return this.dataComDia(vaga.dataInicio);
    const ms = new Date(vaga.dataFim) - new Date(vaga.dataInicio);
    const dias = Math.round(ms / 86400000) + 1;
    return this.data(vaga.dataInicio) + " a " + this.data(vaga.dataFim) + " (" + dias + " dias)";
  },

  telefone(digitos) {
    if (!digitos || digitos.length < 10) return digitos;
    const ddd = digitos.slice(0, 2);
    const numero = digitos.slice(2);
    const corte = numero.length - 4;
    return "(" + ddd + ") " + numero.slice(0, corte) + "-" + numero.slice(corte);
  },

  whatsapp(digitos) {
    return "https://wa.me/55" + digitos;
  },

  iniciais(nome) {
    const partes = nome.trim().split(/\s+/);
    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
    return (primeira + ultima).toUpperCase();
  },

  cidade(id) {
    const c = Banco.cidade(id);
    return c ? c.nome + "/" + c.uf : "-";
  },

  nomeEmpregador(e) {
    return e.nomeNegocio ? e.nomeNegocio : e.nome;
  },

  hoje() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + dia;
  }
};

/* ----------------------------- Validação ----------------------------- */

const Validar = {
  somenteDigitos(texto) {
    return String(texto).replace(/\D/g, "");
  },
  obrigatorio(valor, nome) {
    return valor.trim() === "" ? nome + " é obrigatório." : "";
  },
  // "proprio" é o usuário que está editando o perfil: ele pode manter o próprio username/e-mail
  username(valor, proprio) {
    const u = valor.trim().toLowerCase().replace(/^@/, "");
    if (!u) return "Escolha um username.";
    if (!/^[a-z0-9._]{3,30}$/.test(u)) return "Use de 3 a 30 caracteres: letras minúsculas, números, ponto ou _ (sem espaço).";
    const emUso = Banco.todosUsuarios().some((x) => x.usuario !== proprio && x.usuario.username === u);
    return emUso ? "O username @" + u + " já está em uso." : "";
  },
  email(valor, proprio) {
    const e = valor.trim().toLowerCase();
    if (!e) return "Informe seu e-mail.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return "E-mail inválido. Exemplo: nome@email.com";
    const emUso = Banco.todosUsuarios().some((x) => x.usuario !== proprio && x.usuario.email === e);
    return emUso ? "Já existe uma conta com este e-mail." : "";
  },
  telefone(valor) {
    const d = this.somenteDigitos(valor);
    if (!d) return "Informe um telefone com DDD.";
    return d.length < 10 || d.length > 11 ? "O telefone deve ter DDD + número (10 ou 11 dígitos)." : "";
  },
  cpf(valor) {
    const d = this.somenteDigitos(valor);
    if (!d) return "Informe seu CPF.";
    return d.length !== 11 ? "O CPF deve ter 11 dígitos." : "";
  },
  documento(valor) {
    const d = this.somenteDigitos(valor);
    if (!d) return "Informe seu CPF ou CNPJ.";
    return d.length !== 11 && d.length !== 14 ? "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos)." : "";
  },
  senha(valor) {
    if (valor.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
    if (!/[A-Za-zÀ-ÿ]/.test(valor) || !/\d/.test(valor)) return "A senha precisa ter letras e números.";
    return "";
  }
};

/* ----------------------------- DOM ----------------------------- */

/**
 * Cria um elemento. O texto entra sempre por textContent,
 * então nada digitado pelo usuário vira HTML.
 */
function criar(tag, atributos, filhos) {
  const elemento = document.createElement(tag);
  if (atributos) {
    for (const nome in atributos) {
      const valor = atributos[nome];
      if (valor === null || valor === undefined || valor === false) continue;
      if (nome === "texto") elemento.textContent = valor;
      else if (nome === "classe") elemento.className = valor;
      else if (nome.startsWith("on")) elemento.addEventListener(nome.slice(2), valor);
      else elemento.setAttribute(nome, valor === true ? "" : valor);
    }
  }
  if (filhos) {
    for (const filho of [].concat(filhos)) {
      if (filho === null || filho === undefined || filho === false) continue;
      elemento.append(filho instanceof Node ? filho : document.createTextNode(String(filho)));
    }
  }
  return elemento;
}

function avatar(nome, grande) {
  return criar("span", { classe: "avatar" + (grande ? " grande" : ""), "aria-hidden": "true", texto: Formato.iniciais(nome) });
}

function etiquetaTipo(tipo) {
  return criar("span", { classe: "etiqueta " + tipo, texto: TIPOS[tipo] });
}

function preencherSelect(select, itens, rotuloVazio) {
  select.replaceChildren();
  if (rotuloVazio) select.append(criar("option", { value: "", texto: rotuloVazio }));
  for (const item of itens) {
    select.append(criar("option", { value: item.valor, texto: item.texto }));
  }
}

function opcoesCidades() {
  return Banco.dados.cidades.map((c) => ({ valor: c.id, texto: c.nome + "/" + c.uf }));
}

/** Ids marcados num <select multiple>. */
function valoresSelecionados(select) {
  return Array.from(select.selectedOptions).map((o) => Number(o.value));
}

/** Escreve embaixo do <select multiple> quais opções estão marcadas. */
function mostrarSelecionadas(select, saida) {
  const nomes = Array.from(select.selectedOptions).map((o) => o.textContent);
  saida.textContent = nomes.length ? "Marcadas (" + nomes.length + "): " + nomes.join(", ") : "Nenhuma cidade marcada.";
}

function opcoesCategorias() {
  return Banco.dados.categorias.map((c) => ({ valor: c.id, texto: c.nome }));
}

/** Cartão de vaga usado na home, na lista de vagas e no painel. */
function cartaoVaga(vaga, aoClicar) {
  const empregador = Banco.empregador(vaga.idEmpregador);
  const restantes = Banco.restantes(vaga);
  return criar("button", { classe: "vaga", type: "button", onclick: () => aoClicar(vaga) }, [
    criar("div", { classe: "linha" }, [
      etiquetaTipo(vaga.tipo),
      criar("span", { texto: Banco.categoria(vaga.idCategoria).nome })
    ]),
    criar("h3", { texto: vaga.titulo }),
    criar("div", { classe: "valor" }, [
      Formato.moeda(vaga.valor) + " ",
      criar("small", { texto: PERIODOS[vaga.periodo] })
    ]),
    criar("div", { classe: "linha" }, [
      criar("span", { texto: "📍 " + (vaga.bairro ? vaga.bairro + ", " : "") + Formato.cidade(vaga.idCidade) }),
      criar("span", { texto: "📅 " + Formato.quando(vaga) })
    ]),
    criar("div", { classe: "rodape" }, [
      avatar(empregador.nome),
      criar("span", { texto: Formato.nomeEmpregador(empregador) }),
      criar("span", { classe: "etiqueta neutra", style: "margin-left:auto", texto: restantes + (restantes === 1 ? " vaga" : " vagas") })
    ])
  ]);
}

/* ----------------------------- Menu ----------------------------- */

function montarMenu() {
  const botao = document.querySelector(".menu-botao");
  const menu = document.querySelector(".menu");
  if (botao && menu) {
    botao.addEventListener("click", () => {
      const aberto = menu.classList.toggle("aberto");
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
  }

  const sessao = Sessao.atual();
  for (const item of document.querySelectorAll("[data-visitante]")) {
    item.classList.toggle("oculto", Boolean(sessao));
  }
  for (const item of document.querySelectorAll("[data-logado]")) {
    item.classList.toggle("oculto", !sessao);
  }
  const sair = document.querySelector("[data-sair]");
  if (sair) {
    sair.addEventListener("click", (evento) => {
      evento.preventDefault();
      Sessao.sair();
      window.location.href = "index.html";
    });
  }

  const restaurar = document.querySelector("[data-restaurar]");
  if (restaurar) {
    restaurar.addEventListener("click", () => {
      Banco.restaurar();
      window.location.href = "index.html";
    });
  }
}

Banco.carregar();
document.addEventListener("DOMContentLoaded", montarMenu);
