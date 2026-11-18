"use strict";

const Trampu = (() => {
  const chave = "trampu.dados.v1";
  const categorias = ["Alimentação", "Eventos", "Limpeza", "Jardinagem", "Comércio", "Serviços gerais"];
  const agora = () => new Date();
  function dataLocal(d = agora()) {
    return [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-");
  }
  function dia(offset) {
    const d = agora();
    d.setDate(d.getDate() + offset);
    return dataLocal(d);
  }
  function exigir(ok, mensagem) { if (!ok) throw new Error(mensagem); }
  function texto(v, legenda, max = 140) {
    const s = String(v ?? "").trim();
    exigir(s.length > 0 && s.length <= max, "Preencha " + legenda + " com até " + max + " caracteres.");
    return s;
  }
  const proximo = lista => Math.max(0, ...lista.map(x => x.id)) + 1;
  function inicial() {
    const nomes = ["Casa do Largo", "Quintal Eventos", "Flora Jardins", "Armazém Central", "Ateliê do Bairro", "Joana Lima"];
    const cidades = ["Itu", "Itu", "Salto", "Sorocaba", "São Paulo", "Itu"];
    const usuarios = nomes.map((nome,i) => ({id:i+1, nome, cidade:cidades[i], tipo:i===5?"trabalhador":"contratante",
      email:"perfil"+(i+1)+"@example.org", telefone:"", regiao:"Centro", habilidades:i===5?"Atendimento e organização de salão":"", interesses:i===5?["Eventos","Alimentação"]:[]}));
    function vaga(id,titulo,contratante,cat,local,dias,inicio,fim,valor,vagas,descricao,requisitos) {
      return {id,titulo,contratante,categoria:categorias[cat],cidade:cidades[contratante-1],local,data:dia(dias),inicio,fim,valor,vagas,descricao,requisitos,status:"Aberta"};
    }
    const oportunidades = [
      vaga(6,"Atendente de salão",1,0,"Casa do Largo · Centro",3,"17:00","22:00",150,3,"Receba as pessoas, organize as mesas e apoie a equipe no atendimento do jantar. Refeição no local.","Facilidade no atendimento ao público."),
      vaga(5,"Apoio em evento cultural",2,1,"Espaço Quintal · Centro",4,"14:00","20:00",180,2,"Ajude a organizar a entrada e orientar o público durante uma tarde de apresentações.","Comunicação e disponibilidade para o turno."),
      vaga(4,"Auxiliar de jardinagem",3,3,"Viveiro Flora · Vila Nova",2,"08:00","13:00",130,1,"Apoie o plantio e a organização de mudas. A equipe fornece ferramentas e orientação.","Disposição para atividades ao ar livre."),
      vaga(3,"Reposição de mercadorias",4,4,"Armazém Central · Centro",5,"09:00","15:00",145,2,"Organize as prateleiras e ajude na conferência de produtos.","Atenção aos detalhes."),
      vaga(2,"Limpeza de ateliê",5,2,"Ateliê do Bairro · Lapa",6,"08:00","12:00",120,1,"Ajude na limpeza do espaço depois de uma oficina. Materiais fornecidos.","Experiência básica em limpeza."),
      vaga(1,"Organização de mudança",2,5,"Espaço Quintal · Centro",7,"10:00","16:00",160,2,"Separe, identifique e organize as caixas de materiais para mudança de salão.","Organização e cuidado com os materiais."),
      {...vaga(7,"Recepção de oficina",2,1,"Espaço Quintal · Centro",-2,"09:00","12:00",100,1,"Recepção dos participantes de uma oficina de arte.","Atendimento ao público."),status:"Concluída"},
      {...vaga(8,"Montagem de feira",2,1,"Espaço Quintal · Centro",-1,"08:00","11:00",115,1,"Organização das mesas e recepção dos expositores.","Organização."),status:"Preenchida"}
    ];
    return {usuarios,oportunidades,candidaturas:[{id:1,trabalhador:6,oportunidade:7,data:dia(-4),status:"Aprovada"},
      {id:2,trabalhador:6,oportunidade:8,data:dia(-3),status:"Aprovada"}],
      avaliacoes:[{candidatura:1,autor:2,nota:5,comentario:"Recebeu os participantes com atenção e pontualidade."}]};
  }
  function ler() {
    const raw = localStorage.getItem(chave);
    if (raw) return JSON.parse(raw);
    const db = inicial();
    localStorage.setItem(chave,JSON.stringify(db));
    return db;
  }
  async function gravar(acao) {
    function executar() {
      const db = ler();
      const resultado = acao(db);
      localStorage.setItem(chave,JSON.stringify(db));
      return resultado;
    }
    return navigator.locks ? navigator.locks.request(chave, executar) : executar();
  }
  const usuario = (db,id) => db.usuarios.find(u => u.id === id);
  const vaga = (db,id) => db.oportunidades.find(v => v.id === id);
  const candidatas = (db,id) => db.candidaturas.filter(c => c.oportunidade === id);
  const disponivel = v => v && v.status === "Aberta" && new Date(v.data+"T"+v.inicio) > agora();
  function cadastrar(db,f) {
    const nome = texto(f.nome,"o nome",80), cidade = texto(f.cidade,"a cidade",80);
    const email = texto(f.email,"o e-mail",160).toLowerCase();
    exigir(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),"Informe um e-mail válido.");
    exigir(!db.usuarios.some(u => u.email === email),"Já existe um perfil com esse e-mail neste navegador.");
    exigir(["trabalhador","contratante"].includes(f.tipo),"Escolha um tipo de perfil.");
    const telefone = (f.telefone || "").trim();
    exigir(!telefone || /^\d{10,11}$/.test(telefone.replace(/[ ()-]/g,"")),"Informe o telefone com DDD e 10 ou 11 dígitos.");
    const u = {id:proximo(db.usuarios),nome,cidade,email,tipo:f.tipo,telefone,regiao:(f.regiao||"").trim(),
      habilidades:f.tipo==="trabalhador"?(f.habilidades||"").trim():"",interesses:f.tipo==="trabalhador"?f.interesses.filter(c=>categorias.includes(c)):[]};
    db.usuarios.push(u);
    return u.id;
  }
  function publicar(db,autor,f) {
    exigir(usuario(db,autor)?.tipo==="contratante","Escolha um perfil de contratante para publicar.");
    const titulo=texto(f.titulo,"o título",90), descricao=texto(f.descricao,"a descrição",1200);
    const cidade=texto(f.cidade,"a cidade",80), local=texto(f.local,"o local",140);
    exigir(categorias.includes(f.categoria),"Escolha uma categoria.");
    const dataHora = new Date(f.data+"T"+f.inicio);
    exigir(!Number.isNaN(dataHora.getTime()) && dataLocal(dataHora)===f.data && dataHora > agora(),"Informe uma data e um início futuros.");
    exigir(/^([01]\d|2[0-3]):[0-5]\d$/.test(f.fim) && f.fim>f.inicio,"O fim deve ser depois do início no mesmo dia.");
    const valor=Number(f.valor), vagas=Number(f.vagas);
    exigir(Number.isFinite(valor) && valor>=0.01 && Number.isSafeInteger(Math.round(valor*100)) && Math.abs(valor*100-Math.round(valor*100))<1e-6,"Informe um valor positivo com até duas casas decimais.");
    exigir(Number.isSafeInteger(vagas)&&vagas>0,"Informe uma quantidade inteira de vagas maior que zero.");
    const v={id:proximo(db.oportunidades),contratante:autor,titulo,descricao,categoria:f.categoria,cidade,local,data:f.data,inicio:f.inicio,fim:f.fim,valor,vagas,requisitos:(f.requisitos||"").trim(),status:"Aberta"};
    db.oportunidades.unshift(v);
    return v.id;
  }
  function candidatar(db,autor,id) {
    exigir(usuario(db,autor)?.tipo==="trabalhador","Escolha um perfil de trabalhador para se candidatar.");
    exigir(disponivel(vaga(db,id)),"Esta oportunidade já não recebe candidaturas.");
    exigir(!candidatas(db,id).some(c=>c.trabalhador===autor),"Sua candidatura já foi enviada.");
    db.candidaturas.push({id:proximo(db.candidaturas),trabalhador:autor,oportunidade:id,data:dataLocal(),status:"Pendente"});
  }
  function rejeitarPendentes(lista) { lista.filter(c=>c.status==="Pendente").forEach(c=>c.status="Rejeitada"); }
  function decidir(db,autor,id,aceitar) {
    const c=db.candidaturas.find(item=>item.id===id), v=c && vaga(db,c.oportunidade);
    exigir(v && v.contratante===autor,"Somente o contratante responsável pode selecionar candidatos.");
    exigir(disponivel(v) && c.status==="Pendente","Esta candidatura já não está em seleção.");
    const lista=candidatas(db,v.id), ocupadas=lista.filter(x=>x.status==="Aprovada").length;
    exigir(ocupadas<v.vagas,"Todas as vagas estão ocupadas.");
    c.status=aceitar?"Aprovada":"Rejeitada";
    if (aceitar && ocupadas+1===v.vagas) { v.status="Preenchida"; rejeitarPendentes(lista); }
  }
  function concluir(db,autor,id) {
    const v=vaga(db,id);
    exigir(v && v.contratante===autor && v.status!=="Concluída","Selecione uma publicação sua em andamento.");
    exigir(new Date(v.data+"T"+v.fim)<=agora(),"A conclusão fica disponível depois do horário final.");
    v.status="Concluída";
    rejeitarPendentes(candidatas(db,id));
  }
  function avaliar(db,autor,id,nota,comentario) {
    const c=db.candidaturas.find(x=>x.id===id), v=c && vaga(db,c.oportunidade);
    exigir(v && v.status==="Concluída" && c.status==="Aprovada" && [c.trabalhador,v.contratante].includes(autor),"A avaliação exige participação em um serviço concluído.");
    exigir(!db.avaliacoes.some(a=>a.candidatura===id && a.autor===autor),"Você já avaliou esta participação.");
    exigir(Number.isInteger(nota)&&nota>=1&&nota<=5,"Escolha uma nota de 1 a 5.");
    db.avaliacoes.push({candidatura:id,autor,nota,comentario:String(comentario||"").trim().slice(0,350)});
  }
  return {categorias,dataLocal,inicial,ler,gravar,usuario,vaga,candidatas,disponivel,cadastrar,publicar,candidatar,decidir,concluir,avaliar};
})();
