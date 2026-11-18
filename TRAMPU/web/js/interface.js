"use strict";

const T = Trampu;
const pagina = document.body.dataset.pagina;
const app = document.querySelector("main");
const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));
const paths = {
  busca:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  local:'<path d="M19 10c0 5-7 11-7 11s-7-6-7-11a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  seta:'<path d="M4 12h15m-6-6 6 6-6 6"/>',voltar:'<path d="M20 12H5m6-6-6 6 6 6"/>',
  mais:'<path d="M12 5v14M5 12h14"/>', pessoa:'<circle cx="12" cy="8" r="3.5"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  comida:'<path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18M19 21V3c-4 3-5 8-4 10h4"/>',
  evento:'<path d="m4 20 3-11 8 8-11 3Zm8-12 2-4m2 7 5-2m-4 6 3 1M5 5l1 1m11-2 1 1"/>',
  limpeza:'<path d="m10 12 7-8m-7 7 5 4-5 6-8-6 5-5 3 1Zm-4 5 2-3m1 5 2-3"/>',
  jardim:'<path d="M4 18C1 7 10 4 21 3c-1 12-5 18-14 15M3 21 16 8"/>',
  loja:'<path d="M3 10 5 4h14l2 6M4 12v8h16v-8M3 10c0 3 4 3 5 0 1 3 6 3 8 0 1 3 5 3 5 0M9 20v-6h5v6"/>',
  geral:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12c5 3 13 3 18 0m-9 0v4"/>',
  data:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  hora:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>', equipe:'<circle cx="9" cy="8" r="3"/><path d="M2 20v-2a7 7 0 0 1 14 0v2m1-14c4 1 4 5 0 6m2 2c2 1 3 3 3 5"/>',
  valor:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 12h1m12 0h1"/>'
};
const icon = key => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[key]}</svg>`;
const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const normal = s => String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR").trim();
const moeda = v => Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:Number.isInteger(v)?0:2});
const data = s => new Date(s+"T12:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"});
const rota = (nome,q={}) => nome+".html"+(Object.keys(q).length?"?"+new URLSearchParams(q):"");
const detalhes = v => rota("detalhes",{id:v.id});
const btn = (url,nome,classe="") => `<a class="button ${classe}" href="${esc(url)}">${nome}</a>`;
const link = (url,nome) => `<a class="link" href="${esc(url)}">${nome} ${icon("seta")}</a>`;
const vazio = s => `<p class="empty">${s}</p>`;
const voltar = (url,nome) => `<a class="crumb" href="${esc(url)}">${icon("voltar")} ${nome}</a>`;
const marca = `<a class="brand" href="index.html" aria-label="Trampu, início"><img src="assets/marca.svg" alt="">trampu</a>`;
const visual = [
  ["comida","#fff0da","#91531c"],["evento","#eee7ff","#654699"],["limpeza","#e3f1ff","#365f8b"],
  ["jardim","#e5f4df","#346833"],["loja","#ffebec","#93425c"],["geral","#e5f1ef","#326661"]
];
function arte(cat) {
  const [icone,tinta,tom] = visual[T.categorias.indexOf(cat)] || visual[5];
  return {icone,estilo:`--tint:${tinta};--tone:${tom}`};
}
const tile = c => `<span class="tile" style="${arte(c).estilo}">${icon(arte(c).icone)}</span>`;
const badge = s => `<span class="chip">${esc(s)}</span>`;
const lista = (arr,fn,msg) => arr.length ? arr.map(fn).join("") : vazio(msg);
let db, eu;
const sessao = "trampu.perfil";
function carregar() { db=T.ler(); eu=T.usuario(db,Number(sessionStorage.getItem(sessao))); }
function navegar(url) { location.assign(url); }
function topo() {
  const nav = (p,label) => `<a href="${p}.html"${p===pagina?' aria-current="page"':""}>${label}</a>`;
  document.querySelector("header").innerHTML=`<div class="wrap nav">${marca}<nav aria-label="Principal">${nav("index","Início")}${nav("oportunidades","Oportunidades")}<a href="index.html#como-funciona">Como funciona</a></nav><div class="nav-actions"><a class="icon-link" href="${eu?eu.tipo+".html":"cadastro.html"}">${icon("pessoa")}${eu?"Meu painel":"Meu perfil"}</a>${btn("publicar.html",icon("mais")+" Publicar oportunidade")}</div></div>`;
  document.querySelector("footer").innerHTML=`<div class="wrap foot">${marca}<small>Projeto acadêmico FIAP · CitizenTech · 2026/2<br>Ambiente demonstrativo com dados fictícios.</small><a href="cadastro.html">Escolher perfil de demonstração ${icon("seta")}</a></div>`;
}
function card(v) {
  const abertas=v.vagas-T.candidatas(db,v.id).filter(c=>c.status==="Aprovada").length;
  return `<article class="card"><div class="card-top">${tile(v.categoria)}<span class="chip" style="${arte(v.categoria).estilo}">${esc(v.categoria)}</span></div><div><h3><a href="${detalhes(v)}">${esc(v.titulo)}</a></h3><p class="company">${esc(T.usuario(db,v.contratante).nome)}</p></div><div class="facts"><span>${icon("local")}${esc(v.cidade)} · ${abertas} ${abertas===1?"vaga livre":"vagas livres"}</span><span>${icon("data")}${data(v.data)}</span><span>${icon("hora")}${esc(v.inicio)} às ${esc(v.fim)}</span></div><div class="card-bottom"><div><strong class="money">${moeda(v.valor)}</strong> <span class="unit">/ serviço</span></div>${link(detalhes(v),"Ver detalhes")}</div></article>`;
}
function home() {
  return `<section class="hero"><div class="wrap hero-grid"><div class="hero-copy"><div class="hero-text"><span class="eyebrow">${icon("local")} Trabalho na sua região</span><h1>Seu próximo trampo<br>está <em>aqui perto.</em></h1><p>Encontre trabalhos pontuais na sua cidade ou contrate quem está por perto para dar uma mão.</p></div><form class="searchbar" action="oportunidades.html" role="search"><label>${icon("busca")}<span class="visually-hidden">Serviço ou palavra-chave</span><input name="q" placeholder="Qual trampo você busca?"></label><label class="city">${icon("local")}<span class="visually-hidden">Cidade</span><input name="cidade" placeholder="Cidade"></label><button class="button green">Encontrar trampo</button></form></div><div class="hero-art"><img src="assets/trabalhadores.jpg" alt="Ilustração de uma atendente com bandeja e um profissional com uma caixa."></div></div></section>
  <section class="wrap section"><div class="section-head"><h2>Explore por categoria</h2></div><div class="cats">${T.categorias.map(c=>`<a class="cat" href="${esc(rota("oportunidades",{categoria:c}))}">${tile(c)}${esc(c)}</a>`).join("")}</div></section>
  <section class="wrap section"><div class="section-head"><div><h2>Oportunidades recentes</h2></div>${link("oportunidades.html","Ver todas")}</div><div class="cards">${lista(db.oportunidades.filter(T.disponivel).slice(0,3),card,"Nenhum serviço aberto no momento.")}</div></section>
  <section class="how" id="como-funciona"><div class="wrap"><h2>Como funciona</h2><div class="cards"><article class="step">${tile("Comércio")}<h3>Encontre um trampo</h3><p>Confira local, horário e valor antes de se candidatar. Acompanhe a resposta no seu painel.</p>${link("oportunidades.html","Buscar oportunidades")}</article><article class="step">${tile("Serviços gerais")}<h3>Monte sua equipe</h3><p>Publique a diária, veja quem tem interesse e escolha as pessoas para o serviço.</p>${link("publicar.html","Publicar oportunidade")}</article><article class="step">${tile("Jardinagem")}<h3>Conte sua experiência</h3><p>Depois do trabalho, os dois lados podem avaliar a experiência e acompanhar seu histórico.</p>${link("cadastro.html","Escolher meu perfil")}</article></div></div></section>`;
}
const intro = (titulo,sub="") => `<div class="intro"><h1>${titulo}</h1>${sub?`<p>${sub}</p>`:""}</div>`;
const opts = (items,atual) => items.map(s=>`<option${s===atual?" selected":""}>${esc(s)}</option>`).join("");
function ofertas() {
  return `<div class="wrap content">${voltar("index.html","Início")}${intro("Encontre seu trampo","Filtre as oportunidades pelo que faz sentido para você.")}<form id="filtros" class="filters panel" role="search" novalidate><label>Palavra-chave<input name="q" value="${esc(params.get("q"))}" placeholder="Serviço ou contratante"></label><label>Cidade<input name="cidade" value="${esc(params.get("cidade"))}" placeholder="Todas as cidades"></label><label>Categoria<select name="categoria"><option value="">Todas</option>${opts(T.categorias,params.get("categoria"))}</select></label><label>Valor mínimo (R$)<input type="number" step=".01" min="0" name="min" value="${esc(params.get("min"))}"></label><label>Data do serviço<input type="date" name="data" value="${esc(params.get("data"))}"></label><button class="button green">Filtrar</button></form>${aviso}<div class="split"><p id="resultado" role="status"></p><a class="link" href="oportunidades.html">Limpar filtros</a></div><div class="cards" id="ofertas"></div></div>`;
}
function filtrar() {
  const f=Object.fromEntries(new FormData(document.querySelector("#filtros")));
  const ofertas=db.oportunidades.filter(v=>T.disponivel(v)&&normal([v.titulo,v.descricao,v.categoria,T.usuario(db,v.contratante).nome].join(" ")).includes(normal(f.q))&&normal(v.cidade).includes(normal(f.cidade))&&(!f.categoria||v.categoria===f.categoria)&&(!f.data||v.data===f.data)&&v.valor>=Number(f.min||0));
  document.querySelector("#resultado").textContent=`${ofertas.length} ${ofertas.length===1?"oportunidade encontrada":"oportunidades encontradas"}`;
  document.querySelector("#ofertas").innerHTML=lista(ofertas,card,"Nenhum trampo com esses filtros. Tente outra cidade, data ou categoria.");
}
function fact(key,label,val) {return `<div class="detail-fact">${icon(key)}<div><small>${label}</small><strong>${esc(val)}</strong></div></div>`;}
const aviso = `<div class="message" id="mensagem" role="status" tabindex="-1"></div>`;
function detalhe() {
  const v=T.vaga(db,id);
  if(!v) return `<div class="wrap content">${intro("Oportunidade não encontrada")}${link("oportunidades.html","Voltar à busca")}</div>`;
  const c=T.candidatas(db,id).find(x=>x.trabalhador===eu?.id);
  let acao = btn(rota("cadastro",{tipo:"trabalhador",id}),"Escolher perfil para me candidatar","green");
  if(c) acao=badge("Candidatura "+c.status.toLowerCase())+link("trabalhador.html","Acompanhar no painel");
  else if(!T.disponivel(v)) acao=badge("Inscrições encerradas");
  else if(eu?.tipo==="trabalhador") acao=`<button class="button green" data-acao="candidatar" data-id="${id}">Candidatar-me</button>`;
  const mins=h=>Number(h.slice(0,2))*60+Number(h.slice(3));
  const dur=mins(v.fim)-mins(v.inicio);
  return `<div class="wrap content detail">${voltar("oportunidades.html","Voltar às oportunidades")}<div class="layout"><article class="panel">${tile(v.categoria)}<div>${badge(v.categoria)}<h1>${esc(v.titulo)}</h1><p>${esc(T.usuario(db,v.contratante).nome)} · ${esc(v.cidade)}</p></div><h2>Sobre o serviço</h2><p class="flow">${esc(v.descricao)}</p><h3>Requisitos</h3><p class="flow">${esc(v.requisitos||"Sem requisitos adicionais.")}</p><div class="detail-facts">${fact("local","Ponto de encontro",v.local)}${fact("data","Data",data(v.data))}${fact("hora","Turno",v.inicio+" às "+v.fim+" · "+Math.floor(dur/60)+"h"+(dur%60||""))}${fact("equipe","Posições disponíveis",(v.vagas-T.candidatas(db,id).filter(x=>x.status==="Aprovada").length)+" de "+v.vagas)}</div></article><aside class="panel"><span>Remuneração por pessoa</span><strong class="money">${moeda(v.valor)} pelo serviço</strong><p>Confira as condições e acompanhe a seleção pelo seu painel.</p>${acao}${aviso}<small class="note">Simulação local com dados fictícios.</small></aside></div></div>`;
}
