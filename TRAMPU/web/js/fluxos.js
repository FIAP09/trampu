const campo=(nome,label,tipo="text",attrs="required")=>`<label>${label}<input name="${nome}" type="${tipo}" ${attrs}></label>`;
const area=(nome,label,max,obrigatorio="")=>`<label class="wide">${label}<textarea name="${nome}" rows="3" maxlength="${max}" ${obrigatorio}></textarea></label>`;
function cadastro(){
  const tipo=params.get("tipo")==="contratante"?"contratante":"trabalhador";
  return `<div class="wrap content">${voltar("index.html","Início")}${intro("Seu perfil no Trampu","Use dados fictícios. Os perfis ficam neste navegador e podem ser alternados para a demonstração.")}<div class="layout"><section class="panel"><h2>Criar um perfil</h2><form class="form" id="cadastro" novalidate><fieldset><legend>O que você quer fazer?</legend>${["trabalhador","contratante"].map((t,i)=>`<label class="option"><input type="radio" name="tipo" value="${t}" ${t===tipo?"checked":""}>${i?"Quero contratar":"Quero trabalhar"}</label>`).join("")}</fieldset><div class="fields">${campo("nome","Nome ou nome do negócio","text",'required maxlength="80"')}${campo("email","E-mail fictício","email",'required maxlength="160"')}${campo("cidade","Cidade","text",'required maxlength="80"')}${campo("regiao","Bairro ou região (opcional)","text",'maxlength="80"')}${campo("telefone","Telefone fictício (opcional)","tel",'maxlength="18"')}</div><div class="stack" id="trabalhador-campos">${area("habilidades","Quais são suas habilidades? (opcional)",300)}<fieldset><legend>Categorias de interesse</legend>${T.categorias.map(c=>`<label class="option"><input type="checkbox" name="interesses" value="${c}">${c}</label>`).join("")}</fieldset></div><div><button class="button green">Criar perfil e continuar</button></div></form>${aviso}</section><aside class="panel"><h2>Usar um perfil existente</h2><p>Para experimentar os dois lados, escolha um perfil de demonstração. A troca é livre e dispensa senha.</p><form class="form" id="trocar"><label>Perfil de demonstração<select name="perfil">${[...db.usuarios].sort((a,b)=>Number(b.tipo===tipo)-Number(a.tipo===tipo)).map(u=>`<option value="${u.id}">${esc(u.nome)} · ${u.tipo}</option>`).join("")}</select></label><button class="button light">Usar este perfil</button></form></aside></div></div>`;
}
function entrar(uid){
  const u=T.usuario(T.ler(),uid);
  if(!u) throw Error("Esse perfil não está disponível.");
  sessionStorage.setItem(sessao,String(uid));
  if(id && u.tipo==="trabalhador") return navegar(rota("detalhes",{id}));
  if(params.get("destino")==="publicar" && u.tipo==="contratante") return navegar("publicar.html");
  navegar(rota(u.tipo));
}
function bloqueio(tipo,destino){
  return `<div class="wrap content">${intro(tipo==="contratante"?"Área de quem contrata":"Área de quem trabalha")}<div class="panel"><p>Escolha um perfil de ${tipo} para continuar.</p><div>${btn(rota("cadastro",{tipo,destino}),"Escolher ou criar perfil","green")}</div></div></div>`;
}
function publicar(){
  if(eu?.tipo!=="contratante") return bloqueio("contratante","publicar");
  return `<div class="wrap content">${voltar("contratante.html","Meu painel")}${intro("Publicar oportunidade","Informe as condições que a pessoa precisa conhecer antes de se candidatar.")}<div class="layout"><section class="panel"><form id="publicacao" class="form" novalidate><div class="fields">${campo("titulo","Título do serviço","text",'required maxlength="90"')}<label>Categoria<select name="categoria" required><option value="">Escolha</option>${opts(T.categorias)}</select></label>${area("descricao","Descrição do serviço",1200,"required")}${campo("cidade","Cidade","text",`required maxlength="80" value="${esc(eu.cidade)}"`)}${campo("local","Local do serviço ou ponto de encontro","text",'required maxlength="140"')}${campo("data","Data do serviço","date",`required min="${T.dataLocal()}"`)}${campo("vagas","Quantidade de profissionais","number",'required min="1" step="1"')}${campo("inicio","Horário inicial","time")}${campo("fim","Horário final","time")}${campo("valor","Remuneração por pessoa (R$)","number",'required min="0.01" step="0.01"')}${area("requisitos","Requisitos adicionais (opcional)",500)}</div><div><button class="button green">Publicar oportunidade</button></div></form>${aviso}</section><aside class="panel"><h2>Antes de publicar</h2><p>Descreva o que será feito e os materiais oferecidos. Informe o valor total por pessoa e use um local público como referência. Evite divulgar endereço residencial ou telefone.</p><p>Publicação como <strong>${esc(eu.nome)}</strong>.</p></aside></div></div>`;
}
function perfil(){
  return `<aside class="panel">${icon("pessoa")}<h2>Meu perfil</h2><h3>${esc(eu.nome)}</h3><p>${esc(eu.cidade)}${eu.regiao?" · "+esc(eu.regiao):""}</p>${eu.habilidades?`<p><strong>Habilidades</strong><br>${esc(eu.habilidades)}</p>`:""}${eu.interesses.length?`<p>${eu.interesses.map(esc).join(" · ")}</p>`:""}${link("cadastro.html","Trocar perfil de demonstração")}</aside>`;
}
function avaliacao(c){
  const existente=db.avaliacoes.find(a=>a.candidatura===c.id&&a.autor===eu.id);
  const recebida=db.avaliacoes.find(a=>a.candidatura===c.id&&a.autor!==eu.id);
  return `${recebida?`<p><strong>Avaliação recebida · ${recebida.nota}/5</strong><br>${esc(recebida.comentario)}</p>`:""}${existente?`<p>Sua avaliação · ${existente.nota}/5 ${esc(existente.comentario)}</p>`:`<details><summary>Avaliar ${eu.tipo==="trabalhador"?"a experiência":"o profissional"}</summary><form novalidate class="form avaliar" data-id="${c.id}"><label>Nota<select name="nota" required><option value="">Escolha de 1 a 5</option>${opts([1,2,3,4,5])}</select></label>${area("comentario","Comentário (opcional)",350)}<div><button class="button light">Registrar avaliação</button></div></form></details>`}`;
}
function trabalhador(){
  if(eu?.tipo!=="trabalhador")return bloqueio("trabalhador","trabalhador");
  const minhas=db.candidaturas.filter(c=>c.trabalhador===eu.id);
  const historico=minhas.filter(c=>c.status==="Aprovada" && T.vaga(db,c.oportunidade).status==="Concluída");
  const abertas=minhas.filter(c=>!historico.includes(c));
  const score=v=>Number(normal(v.cidade)===normal(eu.cidade))*2+Number(eu.interesses.includes(v.categoria));
  const recomendadas=db.oportunidades.filter(v=>T.disponivel(v)&&!minhas.some(c=>c.oportunidade===v.id)&&score(v)>0).sort((a,b)=>score(b)-score(a)).slice(0,3);
  function item(c,hist){const v=T.vaga(db,c.oportunidade);return `<article class="entry"><div class="split"><h3><a href="${detalhes(v)}">${esc(v.titulo)}</a></h3>${badge(c.status)}</div><p>${esc(T.usuario(db,v.contratante).nome)} · ${data(v.data)} · ${esc(v.inicio)} às ${esc(v.fim)} · ${moeda(v.valor)}</p>${hist?avaliacao(c):link(detalhes(v),"Conferir serviço")}</article>`;}
  return `<div class="wrap content">${intro("Painel do trabalhador",`Olá, ${esc(eu.nome)}. Acompanhe seus próximos trabalhos.`)}${aviso}<div class="layout"><div><section class="panel"><h2>Minhas candidaturas</h2>${lista(abertas,c=>item(c,false),"Suas candidaturas e confirmações aparecerão aqui.")}</section><section class="panel"><h2>Histórico e avaliações</h2>${lista(historico,c=>item(c,true),"Os serviços concluídos em que você trabalhou aparecerão aqui.")}</section></div>${perfil()}</div><section class="subsection"><div class="section-head"><h2>Recomendadas para você</h2>${link("oportunidades.html","Ver todas")}</div><div class="cards">${lista(recomendadas,card,"Nenhuma vaga aberta combina com sua cidade ou seus interesses no momento.")}</div></section></div>`;
}
function candidatos(c,v){
  const u=T.usuario(db,c.trabalhador);
  return `<div class="entry"><div class="split"><strong>${esc(u.nome)}</strong>${badge(c.status)}</div><p>${esc(u.cidade)}${u.habilidades?" · "+esc(u.habilidades):""}</p>${c.status==="Pendente" && T.disponivel(v)?`<div class="actions"><button class="button green" data-acao="aprovar" data-id="${c.id}">Aprovar</button><button class="button light" data-acao="rejeitar" data-id="${c.id}">Rejeitar</button></div>`:""}${v.status==="Concluída"&&c.status==="Aprovada"?avaliacao(c):""}</div>`;
}
function contratante(){
  if(eu?.tipo!=="contratante")return bloqueio("contratante","contratante");
  function anuncio(v){
    const cs=T.candidatas(db,v.id);
    const podeConcluir=v.status!=="Concluída"&&new Date(v.data+"T"+v.fim)<=new Date();
    return `<article class="panel"><div class="split"><h3><a href="${detalhes(v)}">${esc(v.titulo)}</a></h3>${badge(v.status)}</div><p>${data(v.data)} · ${esc(v.inicio)} às ${esc(v.fim)} · ${cs.filter(c=>c.status==="Aprovada").length}/${v.vagas} posições ocupadas</p><details id="candidatos-${v.id}"><summary>Ver candidatos (${cs.length})</summary>${lista(cs,c=>candidatos(c,v),"Ainda não há candidaturas.")}</details>${podeConcluir?`<button class="button light" data-acao="concluir" data-id="${v.id}">Concluir oportunidade</button>`:v.status!=="Concluída"?'<small class="note">A conclusão fica disponível após o horário final.</small>':""}</article>`;
  }
  return `<div class="wrap content">${intro("Painel do contratante",`Publicações de ${esc(eu.nome)}.`)}${aviso}<div class="layout"><section><div class="section-head"><h2>Minhas oportunidades</h2>${btn("publicar.html",icon("mais")+" Publicar")}</div>${lista(db.oportunidades.filter(v=>v.contratante===eu.id),anuncio,"Você ainda não publicou oportunidades.")}</section>${perfil()}</div></div>`;
}
function render(){
  carregar(); topo();
  const telas={index:home,oportunidades:ofertas,detalhes:detalhe,cadastro,publicar,trabalhador,contratante};
  app.innerHTML=telas[pagina]();
  if(pagina==="oportunidades")filtrar();
  if(pagina==="cadastro")camposPerfil();
}
function camposPerfil(){
  document.querySelector("#trabalhador-campos").hidden=document.querySelector('input[name="tipo"]:checked').value!=="trabalhador";
}
function mensagem(msg,erro=false){
  const el=document.querySelector("#mensagem");
  if(el){el.textContent=msg;el.classList.toggle("error",erro);el.focus();}
}
function validar(form){
  const campo=Array.from(form.elements).find(el=>el.willValidate&&!el.validity.valid);
  if(campo){
    mensagem("Confira o campo "+(campo.labels?.[0]?.firstChild?.textContent.trim()||campo.name)+". "+campo.validationMessage,true);
    campo.setAttribute("aria-invalid","true");campo.focus();return false;
  }
  return true;
}
app.addEventListener("input",e=>e.target.removeAttribute("aria-invalid"));
app.addEventListener("change",e=>{if(e.target.name==="tipo")camposPerfil();});
app.addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.target;
  if(!validar(form))return;
  const dados=new FormData(form), f=Object.fromEntries(dados);
  try{
    if(form.id==="filtros"){history.replaceState(null,"",rota("oportunidades",f));filtrar();document.querySelector("#mensagem").textContent="";return;}
    if(form.classList.contains("searchbar")){navegar(rota("oportunidades",f));return;}
    if(form.id==="trocar"){entrar(Number(f.perfil));return;}
    if(form.id==="cadastro"){f.interesses=dados.getAll("interesses");entrar(await T.gravar(db=>T.cadastrar(db,f)));return;}
    if(form.id==="publicacao"){
      const novo=await T.gravar(db=>T.publicar(db,eu.id,f));
      form.hidden=true;mensagem("Oportunidade publicada. Ela já aparece na busca.");
      document.querySelector("#mensagem").after(Object.assign(document.createElement("a"),{className:"link",href:rota("detalhes",{id:novo}),textContent:"Ver a oportunidade publicada →"}));return;
    }
    if(form.matches(".avaliar")){
      await T.gravar(db=>T.avaliar(db,eu.id,Number(form.dataset.id),Number(f.nota),f.comentario));render();mensagem("Avaliação registrada.");
    }
  }catch(err){mensagem(err.message,true);}
});
app.addEventListener("click", async e=>{
  const b=e.target.closest("[data-acao]");
  if(!b)return;
  const acao=b.dataset.acao, alvo=Number(b.dataset.id);
  const container=b.closest("details")?.id;
  try{
    await T.gravar(db=>{
      if(acao==="candidatar")T.candidatar(db,eu.id,alvo);
      if(acao==="concluir")T.concluir(db,eu.id,alvo);
      if(acao==="aprovar"||acao==="rejeitar")T.decidir(db,eu.id,alvo,acao==="aprovar");
    });
    render();if(container && document.getElementById(container))document.getElementById(container).open=true;
    mensagem({candidatar:"Candidatura enviada. Acompanhe a resposta no seu painel.",aprovar:"Candidatura aprovada.",rejeitar:"Candidatura rejeitada.",concluir:"Oportunidade concluída. Os participantes já podem avaliar."}[acao]);
  }catch(err){mensagem(err.message,true);}
});
function iniciar(){
  try{render();}catch(err){app.innerHTML='<div class="wrap content"><h1>Não foi possível abrir o protótipo</h1><p>Permita o armazenamento local e abra o endereço HTTP indicado no README.</p></div>';}
}
iniciar();
window.addEventListener("pageshow",e=>{if(e.persisted)iniciar();});
window.addEventListener("storage",e=>{if(e.key==="trampu.dados.v1"&&!["cadastro","publicar"].includes(pagina)&&!app.querySelector("form :focus"))iniciar();});
