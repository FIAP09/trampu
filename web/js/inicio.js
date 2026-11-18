/* Página inicial: busca rápida, números, vagas recentes e categorias. */

document.addEventListener("DOMContentLoaded", () => {
  const abertas = Banco.vagasAbertas();

  // busca rápida
  preencherSelect(document.getElementById("busca-cidade"), opcoesCidades(), "Todas as cidades");

  // números
  const lugares = abertas.reduce((soma, v) => soma + Banco.restantes(v), 0);
  const cidadesComVaga = new Set(abertas.map((v) => v.idCidade)).size;
  const numeros = [
    [abertas.length, "vagas abertas"],
    [lugares, "lugares para preencher"],
    [cidadesComVaga, "cidades com vagas"]
  ];
  document.getElementById("numeros").replaceChildren(
    ...numeros.map(([n, texto]) => criar("div", null, [criar("strong", { texto: n }), criar("span", { texto: texto })]))
  );

  // 6 vagas mais recentes
  const recentes = abertas
    .slice()
    .sort((a, b) => b.dataPublicacao.localeCompare(a.dataPublicacao))
    .slice(0, 6);
  document.getElementById("destaques").replaceChildren(...recentes.map((v) => cartaoVaga(v, abrirDetalhe)));

  // categorias com contagem de vagas abertas
  const categorias = Banco.dados.categorias.map((c) => {
    const total = abertas.filter((v) => v.idCategoria === c.id).length;
    return criar("a", { classe: "categoria", href: "vagas.html?categoria=" + c.id }, [
      criar("strong", { texto: c.nome }),
      criar("span", { texto: total + (total === 1 ? " vaga" : " vagas") + " · " + c.descricao })
    ]);
  });
  document.getElementById("categorias").replaceChildren(...categorias);
});
