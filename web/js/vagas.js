/* Página de vagas: filtros aplicados sobre o array de vagas e exibidos pelo DOM. */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-filtros");
  const campoTexto = document.getElementById("f-texto");
  const campoCidade = document.getElementById("f-cidade");
  const campoCategoria = document.getElementById("f-categoria");
  const campoOrdem = document.getElementById("f-ordem");
  const campoMinhas = document.getElementById("f-minhas");
  const chips = document.querySelectorAll("#f-tipos .chip");
  const lista = document.getElementById("lista-vagas");
  const contador = document.getElementById("contador");

  let tipoSelecionado = "";
  const sessao = Sessao.atual();
  const trabalhador = sessao && sessao.tipo === "trabalhador" ? sessao.usuario : null;

  preencherSelect(campoCidade, opcoesCidades(), "Todas as cidades");
  preencherSelect(campoCategoria, opcoesCategorias(), "Todas as áreas");

  if (trabalhador) {
    document.getElementById("f-minhas-rotulo").classList.remove("oculto");
  }

  // filtros vindos da página inicial (ex.: vagas.html?cidade=1&q=garcom)
  const params = new URLSearchParams(window.location.search);
  campoTexto.value = params.get("q") || "";
  campoCidade.value = params.get("cidade") || "";
  campoCategoria.value = params.get("categoria") || "";

  function semAcento(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  function filtrar() {
    const texto = semAcento(campoTexto.value.trim());
    const idCidade = Number(campoCidade.value) || null;
    const idCategoria = Number(campoCategoria.value) || null;

    let resultado = Banco.vagasAbertas().filter((v) => {
      if (idCidade && v.idCidade !== idCidade) return false;
      if (idCategoria && v.idCategoria !== idCategoria) return false;
      if (tipoSelecionado && v.tipo !== tipoSelecionado) return false;
      if (trabalhador && campoMinhas.checked && !trabalhador.cidadesAtuacao.includes(v.idCidade)) return false;
      if (texto) {
        const alvo = semAcento(v.titulo + " " + v.descricao + " " + Banco.categoria(v.idCategoria).nome);
        if (!alvo.includes(texto)) return false;
      }
      return true;
    });

    if (campoOrdem.value === "valor") {
      resultado.sort((a, b) => b.valor - a.valor);
    } else if (campoOrdem.value === "proximas") {
      // fixos (sem data) vão para o fim
      resultado.sort((a, b) => (a.dataInicio || "9999").localeCompare(b.dataInicio || "9999"));
    } else {
      resultado.sort((a, b) => b.dataPublicacao.localeCompare(a.dataPublicacao));
    }
    mostrar(resultado);
  }

  function mostrar(vagas) {
    contador.textContent = vagas.length === 1 ? "1 vaga encontrada" : vagas.length + " vagas encontradas";
    if (vagas.length === 0) {
      lista.replaceChildren(criar("div", { classe: "vazio" }, [
        criar("p", { texto: "Nenhuma vaga com esses filtros." }),
        criar("button", { classe: "botao secundario", type: "button", texto: "Limpar filtros", onclick: () => form.reset() })
      ]));
      return;
    }
    lista.replaceChildren(...vagas.map((v) => cartaoVaga(v, abrirDetalhe)));
  }

  for (const chip of chips) {
    chip.addEventListener("click", () => {
      tipoSelecionado = chip.dataset.tipo;
      for (const c of chips) c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      filtrar();
    });
  }

  form.addEventListener("input", filtrar);
  form.addEventListener("change", filtrar);
  form.addEventListener("submit", (e) => e.preventDefault());
  form.addEventListener("reset", () => {
    // espera o navegador limpar os campos antes de filtrar
    setTimeout(() => {
      tipoSelecionado = "";
      for (const c of chips) c.setAttribute("aria-pressed", c.dataset.tipo === "" ? "true" : "false");
      filtrar();
    }, 0);
  });

  filtrar();

  // vindo de um link direto para uma vaga (ex.: depois do login)
  const idVaga = Number(params.get("vaga"));
  if (idVaga && Banco.vaga(idVaga)) {
    abrirDetalhe(Banco.vaga(idVaga));
  }
});
