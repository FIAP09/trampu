/* =====================================================================
   TRAMPU - dados de exemplo
   Mesmo domínio e mesmos registros do banco (banco/trampu.sql) e do Java.
   Senha de teste de todos os usuários: Trampu@123
   ===================================================================== */

const DADOS_INICIAIS = {
  cidades: [
    { id: 1, nome: "Campos do Jordão", uf: "SP" },
    { id: 2, nome: "Santo Antônio do Pinhal", uf: "SP" },
    { id: 3, nome: "São Bento do Sapucaí", uf: "SP" },
    { id: 4, nome: "Monteiro Lobato", uf: "SP" },
    { id: 5, nome: "Sapucaí-Mirim", uf: "MG" },
    { id: 6, nome: "Pindamonhangaba", uf: "SP" },
    { id: 7, nome: "Taubaté", uf: "SP" },
    { id: 8, nome: "Tremembé", uf: "SP" }
  ],

  categorias: [
    { id: 1, nome: "Comércio e atendimento", descricao: "Atendente, balconista, caixa, repositor, vendedor" },
    { id: 2, nome: "Turismo e hotelaria", descricao: "Camareira, recepção de pousada, guia, monitor de passeio" },
    { id: 3, nome: "Rural e agro", descricao: "Colheita, ordenha, trato de animais, caseiro de sítio" },
    { id: 4, nome: "Construção e reforma", descricao: "Pedreiro, ajudante, pintor, eletricista, encanador" },
    { id: 5, nome: "Serviços domésticos", descricao: "Diarista, faxina, passadeira, cozinheira em casa de família" },
    { id: 6, nome: "Cuidados", descricao: "Babá, cuidador de idoso, acompanhante" },
    { id: 7, nome: "Alimentação", descricao: "Ajudante de cozinha, padeiro, salgadeira, chapeiro" },
    { id: 8, nome: "Eventos e festas", descricao: "Garçom, copeiro, montagem de festa, quermesse, rodeio" },
    { id: 9, nome: "Jardinagem e manutenção", descricao: "Roçada de terreno, jardineiro, limpeza de piscina, pequenos reparos" },
    { id: 10, nome: "Transporte e entregas", descricao: "Motoboy, entregador, motorista, mudança, carga e descarga" },
    { id: 11, nome: "Beleza e estética", descricao: "Cabeleireiro, manicure, auxiliar de salão" },
    { id: 12, nome: "Escritório e administrativo", descricao: "Recepcionista, auxiliar administrativo, digitação" },
    { id: 13, nome: "Aulas e reforço", descricao: "Reforço escolar, aula de música, informática básica" },
    { id: 14, nome: "Outros", descricao: "Trabalhos que não se encaixam nas demais categorias" }
  ],

  trabalhadores: [
    {
      id: 1, nome: "Ana Paula Souza", username: "anapaula", cpf: "11122233344",
      email: "ana.souza@email.com", telefone: "12991110001",
      senhaHash: "pbkdf2_sha256$600000$pceH99E3TllaxdEKkva+Dw==$9SAP46l8WM+0lRDXFUD9k8iVsBLJvwLYbkeJuzx6VbU=",
      descricao: "Trabalho há 6 anos em pousadas de Campos. Sou caprichosa e pontual.",
      habilidades: "limpeza, arrumação de quartos, atendimento", disponibilidade: "INTEGRAL",
      idCidade: 1, cidadesAtuacao: [1, 2], dataCadastro: "2026-11-01"
    },
    {
      id: 2, nome: "Carlos Eduardo Lima", username: "carlinhos.lima", cpf: "22233344455",
      email: "carlos.lima@email.com", telefone: "12991110002",
      senhaHash: "pbkdf2_sha256$600000$IkNo22tD6HDyMlOOpNmiYQ==$/A4sdzzRRe3Z5nYjLs+xtUDgvtTYIZC8n5nT6eG7LqY=",
      descricao: "Faço jardinagem e roçada. Tenho roçadeira própria.",
      habilidades: "jardinagem, roçada, pequenos reparos", disponibilidade: "BICOS",
      idCidade: 2, cidadesAtuacao: [2, 1, 3], dataCadastro: "2026-11-02"
    },
    {
      id: 3, nome: "Juliana Ribeiro", username: "ju.ribeiro", cpf: "33344455566",
      email: "juliana.ribeiro@email.com", telefone: "12991110003",
      senhaHash: "pbkdf2_sha256$600000$VAoxIz2WfzvqQp1Pa+W+GA==$UCM+EcuMGrr5oNr1xdoXqlmQRTialKIo22aaVyLEqvU=",
      descricao: "Estudante, trabalho como garçonete em eventos nos fins de semana.",
      habilidades: "garçonete, caixa, inglês básico", disponibilidade: "FINS_DE_SEMANA",
      idCidade: 1, cidadesAtuacao: [1, 2], dataCadastro: "2026-11-03"
    },
    {
      id: 4, nome: "Marcos Antônio Pereira", username: "marcos.pedreiro", cpf: "44455566677",
      email: "marcos.pereira@email.com", telefone: "12991110004",
      senhaHash: "pbkdf2_sha256$600000$gypdT/bH6TlynPG/a6UJfA==$MxSK/ywS5qW7teeasADWlyy2GjuRczmcdrIctgIN390=",
      descricao: "Pedreiro há 15 anos. Faço reboco, muro, piso e pintura.",
      habilidades: "pedreiro, pintura, reboco, piso", disponibilidade: "INTEGRAL",
      idCidade: 3, cidadesAtuacao: [3, 1, 5], dataCadastro: "2026-11-04"
    },
    {
      id: 5, nome: "Fernanda Oliveira", username: "fe.oliveira", cpf: "55566677788",
      email: "fernanda.oliveira@email.com", telefone: "12991110005",
      senhaHash: "pbkdf2_sha256$600000$OkRyB+ALC2dgADLg1ARrVQ==$Kuz5jR0EFaqGk+uVBWxPO/dhu9ziXa2tC6/iMKuqT6U=",
      descricao: "Tenho experiência em recepção e rotinas administrativas.",
      habilidades: "recepção, Excel, atendimento ao público", disponibilidade: "MEIO_PERIODO",
      idCidade: 6, cidadesAtuacao: [6, 7, 8], dataCadastro: "2026-11-05"
    },
    {
      id: 6, nome: "José Benedito Santos", username: "zebenedito", cpf: "66677788899",
      email: "jose.santos@email.com", telefone: "12991110006",
      senhaHash: "pbkdf2_sha256$600000$6DfXY1e3cC+iU7Z12iBiRQ==$fiQAkmJUbnOK5xYOtGMiM1nSJgOKTqanoAYA8qF34iM=",
      descricao: "Cresci na roça. Sei lidar com gado, ordenha e colheita.",
      habilidades: "colheita, ordenha, trato de animais", disponibilidade: "INTEGRAL",
      idCidade: 4, cidadesAtuacao: [4, 3, 7], dataCadastro: "2026-11-06"
    }
  ],

  empregadores: [
    {
      id: 1, nome: "Roberto Almeida", username: "pousadaserrazul", documento: "12345678000101",
      email: "roberto@pousadaserrazul.com", telefone: "12992220001",
      senhaHash: "pbkdf2_sha256$600000$jgPAJWKCrYNtED/mEAwkCw==$DCPrEELPjsl8g24QPM8Zq8C057VnM6C8F35A1xw/seo=",
      descricao: "Toco a pousada com minha família há 12 anos. Na temporada de inverno sempre precisamos de reforço.",
      nomeNegocio: "Pousada Serra Azul", idCidade: 1, dataCadastro: "2026-10-20"
    },
    {
      id: 2, nome: "Maria Helena Costa", username: "chocolatesdamaria", documento: "23456789000102",
      email: "maria@chocolatesdamaria.com", telefone: "12992220002",
      senhaHash: "pbkdf2_sha256$600000$vg0LA5JO90ElT/18k5ZJog==$dx48ddC58zbGcIxiID3S82/0SMqBfwGulU4BljMhzBw=",
      descricao: "Chocolate artesanal feito em Campos desde 2009.",
      nomeNegocio: "Chocolates da Maria", idCidade: 1, dataCadastro: "2026-10-22"
    },
    {
      id: 3, nome: "Antônio Carlos Moreira", username: "sitiobomretiro", documento: "77788899900",
      email: "antonio.moreira@email.com", telefone: "12992220003",
      senhaHash: "pbkdf2_sha256$600000$Pt0NhRlh4C9KX04NDpEi0A==$o3OmHc/9sevF8qKjeJO6/yiDBHLCQYAQWcJ16At5LZY=",
      descricao: "Produtor rural. Tenho gado de leite e lavoura no sítio.",
      nomeNegocio: "Sítio Bom Retiro", idCidade: 3, dataCadastro: "2026-10-25"
    },
    {
      id: 4, nome: "Luciana Prado", username: "lu.eventos", documento: "34567890000103",
      email: "luciana@pradoeventos.com", telefone: "12992220004",
      senhaHash: "pbkdf2_sha256$600000$r2ptVKXw0D4bczlh0SDqJA==$BTlk4qv3K7vIVB76PQQjrnI8lYiObnkhDUdwbDRvXV0=",
      descricao: "Organizo casamentos e festas na serra. Sempre preciso de garçons e montadores.",
      nomeNegocio: "Prado Festas e Eventos", idCidade: 2, dataCadastro: "2026-10-28"
    },
    {
      id: 5, nome: "Paulo Henrique Dias", username: "paulodias", documento: "88899900011",
      email: "paulo.dias@email.com", telefone: "12992220005",
      senhaHash: "pbkdf2_sha256$600000$4TKiki1EQAGnPnXWjSn4MA==$uFPw5njH4bR3qORn8eIN95YaByYTVsvwkN328hwkdtI=",
      descricao: "Aposentado. Contrato serviços para minha casa e para cuidar da minha mãe.",
      nomeNegocio: null, idCidade: 7, dataCadastro: "2026-10-30"
    },

    // mais empregadores da região
    {
      id: 6, nome: "Sérgio Nogueira", username: "saborserra", documento: "45678901000104",
      email: "contato@sabordaserra.com", telefone: "12992220006",
      senhaHash: "pbkdf2_sha256$600000$cohkAn6LvxJ2iG82Se2tHg==$WivpGXMMKd1k2ZamPmr4G44qjy6w3GD8bgPAHd90KY4=",
      descricao: "Restaurante de comida mineira e fondue no Capivari. Na temporada o movimento triplica.",
      nomeNegocio: "Restaurante Sabor da Serra", idCidade: 1, dataCadastro: "2026-10-02"
    },
    {
      id: 7, nome: "Cláudia Martins", username: "supermantiqueira", documento: "56789012000105",
      email: "rh@supermantiqueira.com", telefone: "12992220007",
      senhaHash: "pbkdf2_sha256$600000$cdVxDgYLFCrJ1wGoUoNGhA==$Szquz7ji7KmgWpHjgOYb+E9PyQ346V7GjUNtE+0/lHM=",
      descricao: "Supermercado de bairro em Abernéssia, com entrega em casa.",
      nomeNegocio: "Supermercado Mantiqueira", idCidade: 1, dataCadastro: "2026-10-03"
    },
    {
      id: 8, nome: "Eduardo Kenji Sato", username: "hotelaraucarias", documento: "67890123000106",
      email: "reservas@hotelaraucarias.com", telefone: "12992220008",
      senhaHash: "pbkdf2_sha256$600000$igaxyVjdlzkowhG2t7Xirw==$g12ulYJZsf2HyRQS3pRLy+71Ldk0ev8tagGclCNhj9E=",
      descricao: "Hotel com 40 apartamentos, restaurante e área verde no Alto da Boa Vista.",
      nomeNegocio: "Hotel Vale das Araucárias", idCidade: 1, dataCadastro: "2026-10-04"
    },
    {
      id: 9, nome: "Ricardo Fonseca", username: "construpinhal", documento: "78901234000107",
      email: "obras@construpinhal.com", telefone: "12992220009",
      senhaHash: "pbkdf2_sha256$600000$AdlIQUNdmr06YO50uW9osA==$z8cgU+h+jO/nOTSqWVboFppqr3DwWwWa4oLS/HYK7QY=",
      descricao: "Pequena construtora de casas e reformas em Santo Antônio do Pinhal e região.",
      nomeNegocio: "Construtora Pinhal", idCidade: 2, dataCadastro: "2026-10-05"
    },
    {
      id: 10, nome: "Beatriz Lacerda", username: "pousadapicoagudo", documento: "89012345000108",
      email: "beatriz@pousadapicoagudo.com", telefone: "12992220010",
      senhaHash: "pbkdf2_sha256$600000$F1TOmXPM1FUDBZvIxgLo6g==$Z7k4/78Zm+BPzc38En9e+stRaOg3Jt9binghe6vubxE=",
      descricao: "Pousada de chalés com vista para o Pico Agudo. Atendimento de família.",
      nomeNegocio: "Pousada Pico Agudo", idCidade: 2, dataCadastro: "2026-10-06"
    },
    {
      id: 11, nome: "Joaquim Ribeiro", username: "fazendasantaclara", documento: "90123456000109",
      email: "joaquim@fazendasantaclara.com", telefone: "12992220011",
      senhaHash: "pbkdf2_sha256$600000$qCKH5tGFbLOT+oPL4P8rbQ==$m3VhgG8G7Ada3pmojOqPma8PAiDjBTX6rTfo/rXoz68=",
      descricao: "Produzimos morango, leite e queijo em São Bento do Sapucaí há três gerações.",
      nomeNegocio: "Fazenda Santa Clara", idCidade: 3, dataCadastro: "2026-10-07"
    },
    {
      id: 12, nome: "Patrícia Andrade", username: "acordesmusica", documento: "01234567000110",
      email: "patricia@escolaacordes.com", telefone: "12992220012",
      senhaHash: "pbkdf2_sha256$600000$aZtjyWUw1H4AuYPveMPkqg==$aMmZdLJbXuCX43p8fh6a+NGeRT8YlCsK9DYvafCCW34=",
      descricao: "Escola de música e reforço escolar em Taubaté, com turmas para crianças e adultos.",
      nomeNegocio: "Escola Acordes", idCidade: 7, dataCadastro: "2026-10-08"
    },
    {
      id: 13, nome: "Vanessa Rocha", username: "belaserra.salao", documento: "11223344000111",
      email: "vanessa@belaserra.com", telefone: "12992220013",
      senhaHash: "pbkdf2_sha256$600000$dkAJ7G8CJMgNHsMI4+EL+Q==$X2owurmReoACE+/3lyrdM3hAScNXGw+yuXIzOYHyZPI=",
      descricao: "Salão de beleza no Jaguaribe. Atendemos noivas e formaturas da região.",
      nomeNegocio: "Salão Bela Serra", idCidade: 1, dataCadastro: "2026-10-09"
    },
    {
      id: 14, nome: "Guilherme Prado", username: "cervejamontanha", documento: "22334455000112",
      email: "gui@cervejamontanha.com", telefone: "12992220014",
      senhaHash: "pbkdf2_sha256$600000$ciBdI70g/uVIuyExuN5TGQ==$gw+AenwQc5VabGuoVwDQRd4VfmxFMhYgS01T/p3M5Po=",
      descricao: "Cervejaria artesanal com bar e eventos aos fins de semana.",
      nomeNegocio: "Cervejaria Montanha", idCidade: 1, dataCadastro: "2026-10-10"
    },
    {
      id: 15, nome: "Rosana Teixeira", username: "recantodosavos", documento: "33445566000113",
      email: "contato@recantodosavos.com", telefone: "12992220015",
      senhaHash: "pbkdf2_sha256$600000$raYh8q9/vkl4oVNoI7coVA==$3H1TjsGa6I5JglBKMoSZvED8+/OO77FepKlaZh9alxU=",
      descricao: "Casa de repouso com 18 residentes em Pindamonhangaba.",
      nomeNegocio: "Recanto dos Avós", idCidade: 6, dataCadastro: "2026-10-11"
    },
    {
      id: 16, nome: "Fábio Cardoso", username: "valelogistica", documento: "44556677000114",
      email: "rh@valelogistica.com", telefone: "12992220016",
      senhaHash: "pbkdf2_sha256$600000$8OGIlMUnkX9egtoVoYvm8Q==$1hmubl/YM4DirjXDnbop5Qax1Te1jsySVT+0QLy8A4k=",
      descricao: "Transportadora e entregas para o comércio do Vale do Paraíba.",
      nomeNegocio: "Vale Logística", idCidade: 7, dataCadastro: "2026-10-12"
    },
    {
      id: 17, nome: "Silvia Moraes", username: "contabilsilva", documento: "55667788000115",
      email: "silvia@contabilsilva.com", telefone: "12992220017",
      senhaHash: "pbkdf2_sha256$600000$WL5b+vjWSbCzkPvQdnnIzA==$Tn04SJM0XvKs9ooLmmObxmh9vphIzoQ5Q3p9tKNB/mY=",
      descricao: "Escritório de contabilidade que atende pequenos negócios da região.",
      nomeNegocio: "Contabilidade Silva", idCidade: 7, dataCadastro: "2026-10-13"
    },
    {
      id: 18, nome: "Aparecida Gomes", username: "dona.cida", documento: "12345609871",
      email: "cida.gomes@email.com", telefone: "12992220018",
      senhaHash: "pbkdf2_sha256$600000$PLnVXK7YmVQCTXEYv8aKpA==$WmsDfrZQDYW5QywL59aFvWk+Hfa56gXT1F9sqrDYEmo=",
      descricao: "Moro sozinha com meu marido em Tremembé e preciso de ajuda em casa.",
      nomeNegocio: null, idCidade: 8, dataCadastro: "2026-10-14"
    },
    {
      id: 19, nome: "Marcelo Duarte", username: "paodaserra", documento: "66778899000116",
      email: "marcelo@paodaserra.com", telefone: "12992220019",
      senhaHash: "pbkdf2_sha256$600000$hIEgTqZDbpmbOJyAGp9Wtg==$gNr8fXAeVVqyF6vwUUHvqm6tVZCRXnXcNpQjGeBQcbM=",
      descricao: "Padaria e confeitaria no centro de Pindamonhangaba, aberta todos os dias.",
      nomeNegocio: "Padaria Pão da Serra", idCidade: 6, dataCadastro: "2026-10-15"
    },
    {
      id: 20, nome: "Helena Vasconcelos", username: "sitiohortensias", documento: "77889900000117",
      email: "helena@sitiohortensias.com", telefone: "12992220020",
      senhaHash: "pbkdf2_sha256$600000$xb3rAQEtq3/v/3kNXkY+5w==$/svSrLO3cSCOpnIfGnkQV0QF3UtYyOgo7RtQHLNLQLA=",
      descricao: "Sítio de orgânicos em Sapucaí-Mirim. Vendemos cestas para Campos e São Paulo.",
      nomeNegocio: "Sítio das Hortênsias", idCidade: 5, dataCadastro: "2026-10-16"
    },
    {
      id: 21, nome: "Thiago Bastos", username: "serraaventura", documento: "88990011000118",
      email: "thiago@serraaventura.com", telefone: "12992220021",
      senhaHash: "pbkdf2_sha256$600000$1ev1OhicjvEZQ+10F9LaxA==$2V0ewNy3v14rGBSbFg1C+cMUk/jwwcpUSOTSu4RTIIs=",
      descricao: "Agência de turismo de aventura: trilhas, escalada na Pedra do Baú e passeios de jipe.",
      nomeNegocio: "Serra Aventura", idCidade: 3, dataCadastro: "2026-10-17"
    },
    {
      id: 22, nome: "José Carlos Pires", username: "mercadinhodoze", documento: "23456781234",
      email: "ze.pires@email.com", telefone: "12992220022",
      senhaHash: "pbkdf2_sha256$600000$LgSfzQKDE4dblZMoRrIHlw==$1+gl5qfw7A3YWnk98HxmdrOZ4kqZyF90jtJA324Mjlo=",
      descricao: "Mercadinho de família no centro de Monteiro Lobato.",
      nomeNegocio: "Mercadinho do Zé", idCidade: 4, dataCadastro: "2026-10-18"
    },
    {
      id: 23, nome: "Otávio Lemos", username: "artemadeira", documento: "99001122000119",
      email: "otavio@artemadeira.com", telefone: "12992220023",
      senhaHash: "pbkdf2_sha256$600000$98+xphO4kxnCMgDmhcvyVA==$dkzlh/470lCnKhvZyUaujxx9kPKDiXF2BpUYVAC5IqM=",
      descricao: "Marcenaria de móveis rústicos sob encomenda.",
      nomeNegocio: "Arte em Madeira", idCidade: 8, dataCadastro: "2026-10-19"
    },
    {
      id: 24, nome: "Camila Freitas", username: "amigofiel.pet", documento: "10293847000120",
      email: "camila@amigofielpet.com", telefone: "12992220024",
      senhaHash: "pbkdf2_sha256$600000$TLLHl32uvgX7pHw/uTCy2w==$othMbQ0Od94ejWG8uZ125UPvSuuQObSG0wJSF8n+Hvs=",
      descricao: "Pet shop com banho e tosa e hotelzinho para cães.",
      nomeNegocio: "Pet Shop Amigo Fiel", idCidade: 7, dataCadastro: "2026-10-20"
    },
    {
      id: 25, nome: "Família Andrade", username: "chacaraandrade", documento: "34567812345",
      email: "andrade.familia@email.com", telefone: "12992220025",
      senhaHash: "pbkdf2_sha256$600000$cyPk4mTjWohi/N8qPxmpoQ==$TD+p9Jgz97fqS9m0Hvc5GHR/7lWSnIX92DhN+mAeaao=",
      descricao: "Temos uma chácara de fim de semana e precisamos de gente de confiança da região.",
      nomeNegocio: null, idCidade: 2, dataCadastro: "2026-10-21"
    },
    {
      id: 26, nome: "Neusa Barbosa", username: "festadopinhao", documento: "21324354000121",
      email: "neusa@festadopinhao.org", telefone: "12992220026",
      senhaHash: "pbkdf2_sha256$600000$gxKbeIM37A+QO8a9hZmdWA==$3M7PIDCLXyNoNa/1++rm/fpghS23m9tceBMcm2j+v5U=",
      descricao: "Associação que organiza a Festa do Pinhão e eventos culturais da cidade.",
      nomeNegocio: "Associação Festa do Pinhão", idCidade: 1, dataCadastro: "2026-10-22"
    },
    {
      id: 27, nome: "Rogério Alves", username: "mecanicaserrana", documento: "32435465000122",
      email: "rogerio@mecanicaserrana.com", telefone: "12992220027",
      senhaHash: "pbkdf2_sha256$600000$5C4dGYfSAdKo8Xol5S2RnQ==$N7zTy79erqcT3vA3zOTIklEPNS1LlB4sKGBG8qc2FOY=",
      descricao: "Oficina mecânica e borracharia na entrada de Pindamonhangaba.",
      nomeNegocio: "Auto Mecânica Serrana", idCidade: 6, dataCadastro: "2026-10-23"
    },
    {
      id: 28, nome: "Lívia Campos", username: "jardimencantado", documento: "43546576000123",
      email: "livia@jardimencantado.com", telefone: "12992220028",
      senhaHash: "pbkdf2_sha256$600000$rmQNQeCx7DDttlIoTEDEvA==$RJthllJ1Vkt3NhweoeKuBPjNRFje7ElXFjq65Judp6s=",
      descricao: "Floricultura e paisagismo para casas e pousadas da serra.",
      nomeNegocio: "Jardim Encantado", idCidade: 1, dataCadastro: "2026-10-24"
    }
  ],

  vagas: [
    // Pousada Serra Azul
    { id: 1, titulo: "Camareira para temporada de inverno", descricao: "Arrumação e limpeza de quartos durante a alta temporada. Alimentação no local.", tipo: "TEMPORARIO", valor: 120, periodo: "DIA", dataInicio: "2027-06-20", dataFim: "2027-07-31", horario: "Escala 6x1, das 8h às 16h", bairro: "Capivari", quantidade: 3, status: "ABERTA", idEmpregador: 1, idCidade: 1, idCategoria: 2, dataPublicacao: "2026-11-08" },
    { id: 2, titulo: "Recepcionista de pousada", descricao: "Check-in, check-out, reservas por telefone e WhatsApp. Inglês básico é um diferencial.", tipo: "FIXO", valor: 2100, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 6x1, das 14h às 22h", bairro: "Capivari", quantidade: 1, status: "ABERTA", idEmpregador: 1, idCidade: 1, idCategoria: 2, dataPublicacao: "2026-11-09" },
    { id: 3, titulo: "Auxiliar de cozinha para temporada", descricao: "Preparo do café da manhã e apoio na cozinha do restaurante da pousada.", tipo: "TEMPORARIO", valor: 130, periodo: "DIA", dataInicio: "2027-06-25", dataFim: "2027-07-31", horario: "Das 6h às 14h", bairro: "Capivari", quantidade: 2, status: "ABERTA", idEmpregador: 1, idCidade: 1, idCategoria: 7, dataPublicacao: "2026-11-10" },
    { id: 4, titulo: "Jardineiro para fim de semana", descricao: "Poda, limpeza dos canteiros e corte de grama da área externa.", tipo: "BICO", valor: 160, periodo: "DIA", dataInicio: "2026-12-05", dataFim: "2026-12-06", horario: "Das 8h às 17h", bairro: "Capivari", quantidade: 1, status: "ABERTA", idEmpregador: 1, idCidade: 1, idCategoria: 9, dataPublicacao: "2026-11-12" },
    { id: 5, titulo: "Recepção no Festival de Inverno", descricao: "Reforço na recepção durante o festival de julho.", tipo: "TEMPORARIO", valor: 110, periodo: "DIA", dataInicio: "2026-07-01", dataFim: "2026-07-31", horario: "Das 14h às 22h", bairro: "Capivari", quantidade: 1, status: "FECHADA", idEmpregador: 1, idCidade: 1, idCategoria: 2, dataPublicacao: "2026-06-10" },

    // Chocolates da Maria
    { id: 6, titulo: "Atendente de chocolateria", descricao: "Atendimento ao cliente, caixa e organização da loja.", tipo: "FIXO", valor: 1900, periodo: "MES", dataInicio: null, dataFim: null, horario: "Terça a domingo, das 10h às 18h", bairro: "Capivari", quantidade: 2, status: "ABERTA", idEmpregador: 2, idCidade: 1, idCategoria: 1, dataPublicacao: "2026-11-07" },
    { id: 7, titulo: "Ajudante de produção de chocolate", descricao: "Apoio na produção e embalagem para as vendas de Natal e Ano Novo.", tipo: "TEMPORARIO", valor: 95, periodo: "DIA", dataInicio: "2026-12-01", dataFim: "2027-01-10", horario: "Segunda a sábado, das 7h às 15h", bairro: "Vila Abernéssia", quantidade: 2, status: "ABERTA", idEmpregador: 2, idCidade: 1, idCategoria: 7, dataPublicacao: "2026-11-11" },
    { id: 8, titulo: "Vendedor de fim de ano", descricao: "Vendas na loja durante dezembro.", tipo: "TEMPORARIO", valor: 1700, periodo: "MES", dataInicio: "2026-12-01", dataFim: "2026-12-31", horario: "Das 12h às 20h", bairro: "Capivari", quantidade: 1, status: "ABERTA", idEmpregador: 2, idCidade: 1, idCategoria: 1, dataPublicacao: "2026-11-13" },
    { id: 9, titulo: "Pintura da fachada da loja", descricao: "Pintura externa completa, material fornecido.", tipo: "BICO", valor: 1800, periodo: "TOTAL", dataInicio: "2026-12-07", dataFim: "2026-12-12", horario: "Das 7h às 17h", bairro: "Capivari", quantidade: 1, status: "ABERTA", idEmpregador: 2, idCidade: 1, idCategoria: 4, dataPublicacao: "2026-11-14" },

    // Sítio Bom Retiro
    { id: 10, titulo: "Ajudante de colheita", descricao: "Colheita na lavoura do sítio. Transporte saindo do centro.", tipo: "TEMPORARIO", valor: 110, periodo: "DIA", dataInicio: "2027-04-01", dataFim: "2027-06-30", horario: "Segunda a sexta, das 6h às 14h", bairro: "Zona rural", quantidade: 4, status: "ABERTA", idEmpregador: 3, idCidade: 3, idCategoria: 3, dataPublicacao: "2026-11-05" },
    { id: 11, titulo: "Caseiro de sítio", descricao: "Cuidar da casa, do pomar e dos animais. Moradia no local.", tipo: "FIXO", valor: 2200, periodo: "MES", dataInicio: null, dataFim: null, horario: "Moradia no sítio, folga aos domingos", bairro: "Zona rural", quantidade: 1, status: "ABERTA", idEmpregador: 3, idCidade: 3, idCategoria: 3, dataPublicacao: "2026-11-06" },
    { id: 12, titulo: "Ordenha e trato de gado", descricao: "Ordenha da manhã e trato do gado na propriedade de Monteiro Lobato.", tipo: "FIXO", valor: 1800, periodo: "MES", dataInicio: null, dataFim: null, horario: "Das 5h às 11h", bairro: "Zona rural", quantidade: 1, status: "ABERTA", idEmpregador: 3, idCidade: 4, idCategoria: 3, dataPublicacao: "2026-11-06" },

    // Prado Festas e Eventos
    { id: 13, titulo: "Garçom para casamento", descricao: "Serviço de mesa em casamento para 150 convidados. Usar roupa social preta.", tipo: "BICO", valor: 200, periodo: "TOTAL", dataInicio: "2026-11-28", dataFim: "2026-11-28", horario: "Das 16h à meia-noite", bairro: "Centro", quantidade: 4, status: "ABERTA", idEmpregador: 4, idCidade: 2, idCategoria: 8, dataPublicacao: "2026-11-10" },
    { id: 14, titulo: "Montagem de festa", descricao: "Montagem de tenda, mesas e decoração para o casamento de sábado.", tipo: "BICO", valor: 150, periodo: "TOTAL", dataInicio: "2026-11-27", dataFim: "2026-11-27", horario: "Das 8h às 17h", bairro: "Centro", quantidade: 2, status: "ABERTA", idEmpregador: 4, idCidade: 2, idCategoria: 8, dataPublicacao: "2026-11-10" },
    { id: 15, titulo: "Copeira para confraternização", descricao: "Festa de fim de ano de uma empresa em Campos do Jordão.", tipo: "BICO", valor: 180, periodo: "TOTAL", dataInicio: "2026-12-12", dataFim: "2026-12-12", horario: "Das 18h às 23h", bairro: "Jardim do Embaixador", quantidade: 2, status: "ABERTA", idEmpregador: 4, idCidade: 1, idCategoria: 8, dataPublicacao: "2026-11-15" },

    // Paulo Henrique Dias (pessoa física)
    { id: 16, titulo: "Pedreiro para muro", descricao: "Levantar e rebocar um muro de 12 metros. Material já comprado.", tipo: "BICO", valor: 250, periodo: "DIA", dataInicio: "2026-11-23", dataFim: "2026-11-27", horario: "Das 7h às 17h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 5, idCidade: 7, idCategoria: 4, dataPublicacao: "2026-11-11" },
    { id: 17, titulo: "Diarista quinzenal", descricao: "Limpeza completa de casa com 3 quartos, a cada 15 dias.", tipo: "FIXO", valor: 170, periodo: "DIA", dataInicio: null, dataFim: null, horario: "A cada 15 dias, das 8h às 16h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 5, idCidade: 7, idCategoria: 5, dataPublicacao: "2026-11-12" },
    { id: 18, titulo: "Roçada de terreno", descricao: "Roçar terreno de 500 m² em Tremembé.", tipo: "BICO", valor: 180, periodo: "TOTAL", dataInicio: "2026-11-21", dataFim: "2026-11-21", horario: "A partir das 7h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 5, idCidade: 8, idCategoria: 9, dataPublicacao: "2026-11-16" },
    { id: 19, titulo: "Cuidador de idoso noturno", descricao: "Acompanhar minha mãe de 84 anos durante a noite.", tipo: "FIXO", valor: 2400, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 12x36, das 19h às 7h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 5, idCidade: 7, idCategoria: 6, dataPublicacao: "2026-11-09" },
    { id: 20, titulo: "Reforço escolar de matemática", descricao: "Aulas para meu neto do 7º ano.", tipo: "FIXO", valor: 40, periodo: "HORA", dataInicio: null, dataFim: null, horario: "Terças e quintas, das 15h às 17h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 5, idCidade: 7, idCategoria: 13, dataPublicacao: "2026-11-13" },

    // mais vagas (empregadores 6 a 28)
    { id: 21, titulo: "Cozinheiro de comida mineira", descricao: "Preparo de pratos do cardápio e organização da cozinha. Experiência em fogão a lenha é um diferencial.", tipo: "FIXO", valor: 2300, periodo: "MES", dataInicio: null, dataFim: null, horario: "Terça a domingo, das 11h às 19h", bairro: "Capivari", quantidade: 1, status: "ABERTA", idEmpregador: 6, idCidade: 1, idCategoria: 7, dataPublicacao: "2026-11-14" },
    { id: 22, titulo: "Garçom para temporada de inverno", descricao: "Atendimento às mesas no período de maior movimento do ano. Gorjeta dividida entre a equipe.", tipo: "TEMPORARIO", valor: 150, periodo: "DIA", dataInicio: "2027-06-15", dataFim: "2027-07-31", horario: "Das 18h à meia-noite", bairro: "Capivari", quantidade: 4, status: "ABERTA", idEmpregador: 6, idCidade: 1, idCategoria: 2, dataPublicacao: "2026-11-07" },
    { id: 23, titulo: "Ajudante de cozinha para férias de verão", descricao: "Pré-preparo, lavagem de louça e apoio ao cozinheiro durante as férias.", tipo: "TEMPORARIO", valor: 120, periodo: "DIA", dataInicio: "2026-12-20", dataFim: "2027-01-31", horario: "Das 10h às 18h", bairro: "Capivari", quantidade: 2, status: "ABERTA", idEmpregador: 6, idCidade: 1, idCategoria: 7, dataPublicacao: "2026-11-01" },
    { id: 24, titulo: "Caixa de restaurante", descricao: "Fechamento de contas, cartão e PIX. Atenção e simpatia com o cliente.", tipo: "FIXO", valor: 1850, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 6x1, das 17h à 1h", bairro: "Capivari", quantidade: 1, status: "ABERTA", idEmpregador: 6, idCidade: 1, idCategoria: 1, dataPublicacao: "2026-11-01" },
    { id: 25, titulo: "Garçom extra para o Réveillon", descricao: "Reforço no jantar de Ano Novo do restaurante. Traje preto e branco.", tipo: "BICO", valor: 180, periodo: "TOTAL", dataInicio: "2026-12-31", dataFim: "2026-12-31", horario: "Das 19h às 3h", bairro: "Capivari", quantidade: 3, status: "ABERTA", idEmpregador: 6, idCidade: 1, idCategoria: 8, dataPublicacao: "2026-10-28" },
    { id: 26, titulo: "Repositor de mercadorias", descricao: "Reposição de gôndolas, conferência de validade e organização do estoque.", tipo: "FIXO", valor: 1700, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 6x1, das 7h às 15h20", bairro: "Vila Abernéssia", quantidade: 2, status: "ABERTA", idEmpregador: 7, idCidade: 1, idCategoria: 1, dataPublicacao: "2026-11-14" },
    { id: 27, titulo: "Operador de caixa", descricao: "Atendimento no caixa, sangria e fechamento. Ensinamos a usar o sistema.", tipo: "FIXO", valor: 1800, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 6x1, das 13h às 21h20", bairro: "Vila Abernéssia", quantidade: 2, status: "ABERTA", idEmpregador: 7, idCidade: 1, idCategoria: 1, dataPublicacao: "2026-11-10" },
    { id: 28, titulo: "Entregador com moto própria", descricao: "Entregas de compras para clientes em Campos. Pagamos combustível à parte.", tipo: "FIXO", valor: 1900, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 9h às 17h", bairro: "Vila Abernéssia", quantidade: 1, status: "ABERTA", idEmpregador: 7, idCidade: 1, idCategoria: 10, dataPublicacao: "2026-10-29" },
    { id: 29, titulo: "Empacotador para o fim de ano", descricao: "Ajudar no caixa e no empacotamento durante o movimento de Natal e Ano Novo.", tipo: "TEMPORARIO", valor: 90, periodo: "DIA", dataInicio: "2026-12-15", dataFim: "2027-01-05", horario: "Das 14h às 22h", bairro: "Vila Abernéssia", quantidade: 3, status: "ABERTA", idEmpregador: 7, idCidade: 1, idCategoria: 1, dataPublicacao: "2026-10-29" },
    { id: 30, titulo: "Açougueiro", descricao: "Cortes, atendimento no balcão do açougue e limpeza da área.", tipo: "FIXO", valor: 2000, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 6x1, das 6h às 14h20", bairro: "Vila Abernéssia", quantidade: 1, status: "ABERTA", idEmpregador: 7, idCidade: 1, idCategoria: 7, dataPublicacao: "2026-10-31" },
    { id: 31, titulo: "Camareira de hotel", descricao: "Arrumação de apartamentos e áreas comuns. Uniforme e refeição no local.", tipo: "FIXO", valor: 1950, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 6x1, das 7h às 15h", bairro: "Alto da Boa Vista", quantidade: 3, status: "ABERTA", idEmpregador: 8, idCidade: 1, idCategoria: 2, dataPublicacao: "2026-11-04" },
    { id: 32, titulo: "Recepcionista noturno", descricao: "Atendimento na recepção durante a noite, check-in tardio e rondas internas.", tipo: "FIXO", valor: 2200, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 12x36, noturno", bairro: "Alto da Boa Vista", quantidade: 1, status: "ABERTA", idEmpregador: 8, idCidade: 1, idCategoria: 2, dataPublicacao: "2026-10-30" },
    { id: 33, titulo: "Auxiliar de manutenção predial", descricao: "Pequenos reparos elétricos e hidráulicos, pintura e cuidado da área verde.", tipo: "FIXO", valor: 2100, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 7h às 16h", bairro: "Alto da Boa Vista", quantidade: 1, status: "ABERTA", idEmpregador: 8, idCidade: 1, idCategoria: 9, dataPublicacao: "2026-10-31" },
    { id: 34, titulo: "Copeira do café da manhã", descricao: "Montagem e reposição do buffet de café da manhã na alta temporada.", tipo: "TEMPORARIO", valor: 140, periodo: "DIA", dataInicio: "2027-06-20", dataFim: "2027-07-31", horario: "Das 6h às 14h", bairro: "Alto da Boa Vista", quantidade: 2, status: "ABERTA", idEmpregador: 8, idCidade: 1, idCategoria: 2, dataPublicacao: "2026-10-25" },
    { id: 35, titulo: "Auxiliar de reservas", descricao: "Responder e-mails e WhatsApp de hóspedes, controlar reservas e pagamentos.", tipo: "FIXO", valor: 2400, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 9h às 18h", bairro: "Alto da Boa Vista", quantidade: 1, status: "ABERTA", idEmpregador: 8, idCidade: 1, idCategoria: 12, dataPublicacao: "2026-11-02" },
    { id: 36, titulo: "Pedreiro de obra", descricao: "Alvenaria, reboco e contrapiso em obras de casas na região.", tipo: "FIXO", valor: 2800, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 7h às 17h", bairro: "Centro", quantidade: 2, status: "ABERTA", idEmpregador: 9, idCidade: 2, idCategoria: 4, dataPublicacao: "2026-10-30" },
    { id: 37, titulo: "Servente de pedreiro", descricao: "Preparar massa, carregar material e manter a obra organizada.", tipo: "FIXO", valor: 1900, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 7h às 17h", bairro: "Centro", quantidade: 3, status: "ABERTA", idEmpregador: 9, idCidade: 2, idCategoria: 4, dataPublicacao: "2026-11-03" },
    { id: 38, titulo: "Eletricista para casa nova", descricao: "Instalação elétrica completa de casa de 90 m². Material por conta da obra.", tipo: "BICO", valor: 2500, periodo: "TOTAL", dataInicio: "2026-12-01", dataFim: "2026-12-15", horario: "Das 7h às 17h", bairro: "Pico Agudo", quantidade: 1, status: "ABERTA", idEmpregador: 9, idCidade: 2, idCategoria: 4, dataPublicacao: "2026-11-10" },
    { id: 39, titulo: "Azulejista para reforma", descricao: "Assentamento de piso e azulejo em reforma de pousada em Tremembé.", tipo: "TEMPORARIO", valor: 180, periodo: "DIA", dataInicio: "2027-01-10", dataFim: "2027-03-10", horario: "Das 7h às 16h", bairro: "Centro", quantidade: 2, status: "ABERTA", idEmpregador: 9, idCidade: 8, idCategoria: 4, dataPublicacao: "2026-11-17" },
    { id: 40, titulo: "Encanador para troca de tubulação", descricao: "Trocar a tubulação de água de uma cozinha e um banheiro.", tipo: "BICO", valor: 900, periodo: "TOTAL", dataInicio: "2026-11-28", dataFim: "2026-11-30", horario: "Das 7h às 17h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 9, idCidade: 2, idCategoria: 4, dataPublicacao: "2026-10-29" },
    { id: 41, titulo: "Camareira para chalés", descricao: "Limpeza e arrumação de chalés na temporada de verão.", tipo: "TEMPORARIO", valor: 130, periodo: "DIA", dataInicio: "2026-12-18", dataFim: "2027-02-28", horario: "Das 8h às 16h", bairro: "Pico Agudo", quantidade: 2, status: "ABERTA", idEmpregador: 10, idCidade: 2, idCategoria: 2, dataPublicacao: "2026-11-15" },
    { id: 42, titulo: "Cozinheira de café colonial", descricao: "Preparar bolos, pães e quitutes do café colonial servido aos hóspedes.", tipo: "FIXO", valor: 2100, periodo: "MES", dataInicio: null, dataFim: null, horario: "Quarta a domingo, das 6h às 14h", bairro: "Pico Agudo", quantidade: 1, status: "ABERTA", idEmpregador: 10, idCidade: 2, idCategoria: 7, dataPublicacao: "2026-11-14" },
    { id: 43, titulo: "Limpeza de trilha e jardim", descricao: "Roçar a trilha até o mirante e limpar os canteiros da entrada.", tipo: "BICO", valor: 350, periodo: "TOTAL", dataInicio: "2026-12-05", dataFim: "2026-12-06", horario: "Das 8h às 17h", bairro: "Pico Agudo", quantidade: 1, status: "ABERTA", idEmpregador: 10, idCidade: 2, idCategoria: 9, dataPublicacao: "2026-11-08" },
    { id: 44, titulo: "Recepcionista de pousada", descricao: "Recepção de hóspedes, reservas por telefone e indicação de passeios.", tipo: "FIXO", valor: 1900, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 5x2, das 14h às 22h", bairro: "Pico Agudo", quantidade: 1, status: "ABERTA", idEmpregador: 10, idCidade: 2, idCategoria: 2, dataPublicacao: "2026-11-14" },
    { id: 45, titulo: "Colhedor de morango", descricao: "Colheita e seleção de morangos na estufa. Transporte saindo do centro.", tipo: "TEMPORARIO", valor: 120, periodo: "DIA", dataInicio: "2027-05-01", dataFim: "2027-09-30", horario: "Segunda a sábado, das 6h às 14h", bairro: "Quilombo", quantidade: 6, status: "ABERTA", idEmpregador: 11, idCidade: 3, idCategoria: 3, dataPublicacao: "2026-11-03" },
    { id: 46, titulo: "Ordenhador", descricao: "Ordenha mecânica de 30 vacas e limpeza do curral.", tipo: "FIXO", valor: 2000, periodo: "MES", dataInicio: null, dataFim: null, horario: "Das 4h30 às 10h30, folga quinzenal", bairro: "Quilombo", quantidade: 1, status: "ABERTA", idEmpregador: 11, idCidade: 3, idCategoria: 3, dataPublicacao: "2026-11-17" },
    { id: 47, titulo: "Auxiliar de queijaria", descricao: "Produção de queijo minas e frescal, embalagem e controle de temperatura.", tipo: "FIXO", valor: 1900, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 7h às 16h", bairro: "Quilombo", quantidade: 1, status: "ABERTA", idEmpregador: 11, idCidade: 3, idCategoria: 7, dataPublicacao: "2026-10-27" },
    { id: 48, titulo: "Ajudante para cercar pasto", descricao: "Fincar mourões e esticar arame em um pasto de 3 hectares.", tipo: "BICO", valor: 140, periodo: "DIA", dataInicio: "2026-12-08", dataFim: "2026-12-10", horario: "Das 7h às 16h", bairro: "Quilombo", quantidade: 3, status: "ABERTA", idEmpregador: 11, idCidade: 3, idCategoria: 3, dataPublicacao: "2026-11-02" },
    { id: 49, titulo: "Motorista de caminhão leve", descricao: "Entregar leite e queijo em São Bento, Campos e Santo Antônio. CNH categoria C.", tipo: "FIXO", valor: 2600, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 5h às 13h", bairro: "Quilombo", quantidade: 1, status: "ABERTA", idEmpregador: 11, idCidade: 3, idCategoria: 10, dataPublicacao: "2026-10-27" },
    { id: 50, titulo: "Professor de violão", descricao: "Aulas em grupo para crianças e adolescentes. Material didático da escola.", tipo: "FIXO", valor: 60, periodo: "HORA", dataInicio: null, dataFim: null, horario: "Terças e quintas à tarde", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 12, idCidade: 7, idCategoria: 13, dataPublicacao: "2026-11-07" },
    { id: 51, titulo: "Professor de reforço do ensino fundamental", descricao: "Reforço de português e matemática para alunos do 1º ao 9º ano.", tipo: "FIXO", valor: 45, periodo: "HORA", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 14h às 18h", bairro: "Centro", quantidade: 2, status: "ABERTA", idEmpregador: 12, idCidade: 7, idCategoria: 13, dataPublicacao: "2026-11-11" },
    { id: 52, titulo: "Professor de informática básica para idosos", descricao: "Ensinar a usar celular, WhatsApp, internet e banco pelo aplicativo.", tipo: "FIXO", valor: 55, periodo: "HORA", dataInicio: null, dataFim: null, horario: "Sábados de manhã", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 12, idCidade: 7, idCategoria: 13, dataPublicacao: "2026-11-05" },
    { id: 53, titulo: "Recepcionista de escola", descricao: "Atender pais e alunos, agendar aulas experimentais e receber mensalidades.", tipo: "FIXO", valor: 1700, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 13h às 19h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 12, idCidade: 7, idCategoria: 12, dataPublicacao: "2026-11-09" },
    { id: 54, titulo: "Manicure e pedicure", descricao: "Atendimento no salão. Pagamos diária fixa mais comissão por serviço.", tipo: "FIXO", valor: 50, periodo: "DIA", dataInicio: null, dataFim: null, horario: "Terça a sábado, das 9h às 19h", bairro: "Jaguaribe", quantidade: 1, status: "ABERTA", idEmpregador: 13, idCidade: 1, idCategoria: 11, dataPublicacao: "2026-11-06" },
    { id: 55, titulo: "Auxiliar de cabeleireiro", descricao: "Lavar cabelos, preparar produtos e ajudar nos atendimentos. Ensinamos a profissão.", tipo: "FIXO", valor: 1600, periodo: "MES", dataInicio: null, dataFim: null, horario: "Terça a sábado, das 9h às 18h", bairro: "Jaguaribe", quantidade: 1, status: "ABERTA", idEmpregador: 13, idCidade: 1, idCategoria: 11, dataPublicacao: "2026-11-06" },
    { id: 56, titulo: "Maquiadora para formatura", descricao: "Maquiagem de formandas em um sábado de manhã.", tipo: "BICO", valor: 300, periodo: "TOTAL", dataInicio: "2026-12-19", dataFim: "2026-12-19", horario: "Das 6h às 13h", bairro: "Jaguaribe", quantidade: 2, status: "ABERTA", idEmpregador: 13, idCidade: 1, idCategoria: 11, dataPublicacao: "2026-11-05" },
    { id: 57, titulo: "Cabeleireira para dezembro", descricao: "Reforço na equipe no mês mais movimentado do salão.", tipo: "TEMPORARIO", valor: 140, periodo: "DIA", dataInicio: "2026-12-10", dataFim: "2026-12-31", horario: "Das 9h às 19h", bairro: "Jaguaribe", quantidade: 1, status: "ABERTA", idEmpregador: 13, idCidade: 1, idCategoria: 11, dataPublicacao: "2026-10-25" },
    { id: 58, titulo: "Atendente de bar para festival de cerveja", descricao: "Servir chope e organizar fichas em festival de cervejas artesanais.", tipo: "BICO", valor: 170, periodo: "TOTAL", dataInicio: "2026-12-12", dataFim: "2026-12-12", horario: "Das 16h à meia-noite", bairro: "Capivari", quantidade: 4, status: "ABERTA", idEmpregador: 14, idCidade: 1, idCategoria: 8, dataPublicacao: "2026-11-01" },
    { id: 59, titulo: "Auxiliar de produção cervejeira", descricao: "Limpeza de tanques, envase e rotulagem. Ensinamos o processo.", tipo: "FIXO", valor: 2100, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 7h às 16h", bairro: "Vila Inglesa", quantidade: 1, status: "ABERTA", idEmpregador: 14, idCidade: 1, idCategoria: 7, dataPublicacao: "2026-10-28" },
    { id: 60, titulo: "Vendedor da loja da fábrica", descricao: "Vendas, degustação guiada e explicação dos estilos de cerveja para turistas.", tipo: "FIXO", valor: 1800, periodo: "MES", dataInicio: null, dataFim: null, horario: "Quinta a domingo, das 12h às 20h", bairro: "Capivari", quantidade: 1, status: "ABERTA", idEmpregador: 14, idCidade: 1, idCategoria: 1, dataPublicacao: "2026-11-15" },
    { id: 61, titulo: "Montagem de estrutura para evento", descricao: "Montar tendas, mesas e palco para evento de fim de semana.", tipo: "BICO", valor: 220, periodo: "TOTAL", dataInicio: "2027-01-16", dataFim: "2027-01-17", horario: "Das 8h às 18h", bairro: "Capivari", quantidade: 3, status: "ABERTA", idEmpregador: 14, idCidade: 1, idCategoria: 8, dataPublicacao: "2026-10-25" },
    { id: 62, titulo: "Cuidador de idosos", descricao: "Higiene, alimentação e acompanhamento dos residentes. Curso de cuidador é desejável.", tipo: "FIXO", valor: 2300, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 12x36, diurno", bairro: "Bosque", quantidade: 3, status: "ABERTA", idEmpregador: 15, idCidade: 6, idCategoria: 6, dataPublicacao: "2026-11-07" },
    { id: 63, titulo: "Cuidador de idosos noturno", descricao: "Acompanhar os residentes durante a noite e registrar intercorrências.", tipo: "FIXO", valor: 2500, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 12x36, noturno", bairro: "Bosque", quantidade: 2, status: "ABERTA", idEmpregador: 15, idCidade: 6, idCategoria: 6, dataPublicacao: "2026-11-15" },
    { id: 64, titulo: "Cozinheira de casa de repouso", descricao: "Preparar refeições seguindo as orientações da nutricionista.", tipo: "FIXO", valor: 1900, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 6h às 14h", bairro: "Bosque", quantidade: 1, status: "ABERTA", idEmpregador: 15, idCidade: 6, idCategoria: 7, dataPublicacao: "2026-10-31" },
    { id: 65, titulo: "Auxiliar de limpeza", descricao: "Limpeza dos quartos, banheiros e áreas comuns.", tipo: "FIXO", valor: 1650, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 7h às 16h", bairro: "Bosque", quantidade: 1, status: "ABERTA", idEmpregador: 15, idCidade: 6, idCategoria: 5, dataPublicacao: "2026-10-31" },
    { id: 66, titulo: "Oficina de música para idosos", descricao: "Uma tarde de cantoria e violão com os residentes.", tipo: "BICO", valor: 120, periodo: "TOTAL", dataInicio: "2026-12-03", dataFim: "2026-12-03", horario: "Das 14h às 16h", bairro: "Bosque", quantidade: 1, status: "ABERTA", idEmpregador: 15, idCidade: 6, idCategoria: 13, dataPublicacao: "2026-11-08" },
    { id: 67, titulo: "Motorista entregador", descricao: "Entregas no Vale do Paraíba com veículo da empresa. CNH categoria B.", tipo: "FIXO", valor: 2900, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 6h às 15h", bairro: "Independência", quantidade: 2, status: "ABERTA", idEmpregador: 16, idCidade: 7, idCategoria: 10, dataPublicacao: "2026-11-08" },
    { id: 68, titulo: "Ajudante de entregas", descricao: "Carregar e descarregar mercadorias e acompanhar o motorista.", tipo: "FIXO", valor: 1800, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 6h às 15h", bairro: "Independência", quantidade: 3, status: "ABERTA", idEmpregador: 16, idCidade: 7, idCategoria: 10, dataPublicacao: "2026-11-03" },
    { id: 69, titulo: "Conferente para a Black Friday e o Natal", descricao: "Separar e conferir pedidos no pico de vendas do fim de ano.", tipo: "TEMPORARIO", valor: 130, periodo: "DIA", dataInicio: "2026-11-25", dataFim: "2026-12-24", horario: "Das 7h às 17h", bairro: "Independência", quantidade: 4, status: "ABERTA", idEmpregador: 16, idCidade: 7, idCategoria: 10, dataPublicacao: "2026-11-13" },
    { id: 70, titulo: "Auxiliar administrativo de logística", descricao: "Emitir notas, controlar rotas e atender clientes por telefone.", tipo: "FIXO", valor: 2200, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 8h às 17h", bairro: "Independência", quantidade: 1, status: "ABERTA", idEmpregador: 16, idCidade: 7, idCategoria: 12, dataPublicacao: "2026-10-28" },
    { id: 71, titulo: "Ajudante de mudança", descricao: "Carregar e descarregar uma mudança residencial em Pindamonhangaba.", tipo: "BICO", valor: 250, periodo: "TOTAL", dataInicio: "2026-12-14", dataFim: "2026-12-14", horario: "Das 8h às 14h", bairro: "Moreira César", quantidade: 2, status: "ABERTA", idEmpregador: 16, idCidade: 6, idCategoria: 10, dataPublicacao: "2026-10-26" },
    { id: 72, titulo: "Auxiliar contábil", descricao: "Lançamentos, conciliação bancária e organização de documentos dos clientes.", tipo: "FIXO", valor: 2000, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 8h às 17h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 17, idCidade: 7, idCategoria: 12, dataPublicacao: "2026-10-26" },
    { id: 73, titulo: "Estagiário de administração", descricao: "Apoio ao escritório. Para estudantes de administração ou contabilidade.", tipo: "FIXO", valor: 1000, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 8h às 14h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 17, idCidade: 7, idCategoria: 12, dataPublicacao: "2026-10-30" },
    { id: 74, titulo: "Assistente para imposto de renda", descricao: "Separar documentos e preencher declarações durante a temporada do IR.", tipo: "TEMPORARIO", valor: 1800, periodo: "MES", dataInicio: "2027-03-01", dataFim: "2027-05-31", horario: "Segunda a sexta, das 8h às 17h", bairro: "Centro", quantidade: 2, status: "ABERTA", idEmpregador: 17, idCidade: 7, idCategoria: 12, dataPublicacao: "2026-11-08" },
    { id: 75, titulo: "Digitação de documentos antigos", descricao: "Digitar e organizar fichas de clientes em planilha.", tipo: "BICO", valor: 400, periodo: "TOTAL", dataInicio: "2026-12-07", dataFim: "2026-12-11", horario: "Das 9h às 13h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 17, idCidade: 7, idCategoria: 12, dataPublicacao: "2026-11-17" },
    { id: 76, titulo: "Diarista duas vezes por semana", descricao: "Limpeza da casa, roupas e organização da cozinha.", tipo: "FIXO", valor: 160, periodo: "DIA", dataInicio: null, dataFim: null, horario: "Terças e sextas, das 8h às 16h", bairro: "Padre Eterno", quantidade: 1, status: "ABERTA", idEmpregador: 18, idCidade: 8, idCategoria: 5, dataPublicacao: "2026-10-26" },
    { id: 77, titulo: "Acompanhante para meu marido", descricao: "Acompanhar meu marido de 79 anos em consultas, caminhadas e na hora dos remédios.", tipo: "FIXO", valor: 1800, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 8h às 14h", bairro: "Padre Eterno", quantidade: 1, status: "ABERTA", idEmpregador: 18, idCidade: 8, idCategoria: 6, dataPublicacao: "2026-11-06" },
    { id: 78, titulo: "Poda das árvores do quintal", descricao: "Podar duas mangueiras e um pé de abacate, e recolher os galhos.", tipo: "BICO", valor: 180, periodo: "TOTAL", dataInicio: "2026-11-30", dataFim: "2026-11-30", horario: "Das 8h às 16h", bairro: "Padre Eterno", quantidade: 1, status: "ABERTA", idEmpregador: 18, idCidade: 8, idCategoria: 9, dataPublicacao: "2026-11-06" },
    { id: 79, titulo: "Faxina pesada de fim de ano", descricao: "Faxina completa antes de receber a família no Natal.", tipo: "BICO", valor: 200, periodo: "TOTAL", dataInicio: "2026-12-22", dataFim: "2026-12-22", horario: "Das 8h às 17h", bairro: "Padre Eterno", quantidade: 1, status: "ABERTA", idEmpregador: 18, idCidade: 8, idCategoria: 5, dataPublicacao: "2026-11-03" },
    { id: 80, titulo: "Padeiro", descricao: "Produção de pão francês, de forma e doces. Experiência com forno de lastro.", tipo: "FIXO", valor: 2300, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 3h às 11h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 19, idCidade: 6, idCategoria: 7, dataPublicacao: "2026-11-04" },
    { id: 81, titulo: "Atendente de padaria", descricao: "Atendimento no balcão, frios e café.", tipo: "FIXO", valor: 1750, periodo: "MES", dataInicio: null, dataFim: null, horario: "Escala 6x1, das 6h às 14h20", bairro: "Centro", quantidade: 2, status: "ABERTA", idEmpregador: 19, idCidade: 6, idCategoria: 1, dataPublicacao: "2026-11-15" },
    { id: 82, titulo: "Confeiteira para encomendas de Natal", descricao: "Produção de panetones, bolos e tortas para as encomendas de fim de ano.", tipo: "TEMPORARIO", valor: 110, periodo: "DIA", dataInicio: "2026-12-10", dataFim: "2027-01-02", horario: "Das 6h às 14h", bairro: "Centro", quantidade: 2, status: "ABERTA", idEmpregador: 19, idCidade: 6, idCategoria: 7, dataPublicacao: "2026-11-05" },
    { id: 83, titulo: "Salgadeira", descricao: "Produção de salgados fritos e assados para a vitrine e encomendas.", tipo: "FIXO", valor: 1800, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 5h às 13h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 19, idCidade: 6, idCategoria: 7, dataPublicacao: "2026-10-30" },
    { id: 84, titulo: "Entregador de pães por bicicleta", descricao: "Entregar pães e leite para clientes do centro logo cedo.", tipo: "FIXO", valor: 1500, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 6h às 11h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 19, idCidade: 6, idCategoria: 10, dataPublicacao: "2026-10-31" },
    { id: 85, titulo: "Trabalhador de horta orgânica", descricao: "Plantio, capina e colheita de hortaliças sem agrotóxico.", tipo: "FIXO", valor: 1900, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 7h às 16h", bairro: "Zona rural", quantidade: 2, status: "ABERTA", idEmpregador: 20, idCidade: 5, idCategoria: 3, dataPublicacao: "2026-11-02" },
    { id: 86, titulo: "Ajudante de plantio", descricao: "Preparar canteiros e plantar mudas na temporada de plantio.", tipo: "TEMPORARIO", valor: 100, periodo: "DIA", dataInicio: "2027-02-01", dataFim: "2027-04-30", horario: "Das 7h às 15h", bairro: "Zona rural", quantidade: 3, status: "ABERTA", idEmpregador: 20, idCidade: 5, idCategoria: 3, dataPublicacao: "2026-11-14" },
    { id: 87, titulo: "Montador de cestas orgânicas", descricao: "Lavar, separar e montar as cestas que vão para os clientes.", tipo: "FIXO", valor: 1600, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 7h às 13h", bairro: "Zona rural", quantidade: 1, status: "ABERTA", idEmpregador: 20, idCidade: 5, idCategoria: 1, dataPublicacao: "2026-11-04" },
    { id: 88, titulo: "Vendedor na feira de Campos", descricao: "Vender nossos produtos na feira de sábado em Campos do Jordão.", tipo: "BICO", valor: 150, periodo: "DIA", dataInicio: "2026-12-05", dataFim: "2026-12-20", horario: "Sábados, das 7h às 13h", bairro: "Vila Abernéssia", quantidade: 1, status: "ABERTA", idEmpregador: 20, idCidade: 1, idCategoria: 1, dataPublicacao: "2026-11-01" },
    { id: 89, titulo: "Guia de trilha", descricao: "Conduzir grupos na trilha da Pedra do Baú. Conhecer a região é essencial.", tipo: "TEMPORARIO", valor: 200, periodo: "DIA", dataInicio: "2026-12-15", dataFim: "2027-02-28", horario: "Das 7h às 16h", bairro: "Centro", quantidade: 2, status: "ABERTA", idEmpregador: 21, idCidade: 3, idCategoria: 2, dataPublicacao: "2026-10-29" },
    { id: 90, titulo: "Motorista de jipe para passeios", descricao: "Dirigir o jipe nos passeios pela serra. CNH B há pelo menos 3 anos.", tipo: "FIXO", valor: 2500, periodo: "MES", dataInicio: null, dataFim: null, horario: "Quinta a domingo, das 8h às 17h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 21, idCidade: 3, idCategoria: 10, dataPublicacao: "2026-11-02" },
    { id: 91, titulo: "Atendente de agência de turismo", descricao: "Vender passeios no balcão e pelo WhatsApp, e organizar a agenda dos guias.", tipo: "FIXO", valor: 1700, periodo: "MES", dataInicio: null, dataFim: null, horario: "Quarta a domingo, das 9h às 17h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 21, idCidade: 3, idCategoria: 12, dataPublicacao: "2026-11-05" },
    { id: 92, titulo: "Apoio em passeio de grupo", descricao: "Ajudar o guia com um grupo de 20 turistas em um sábado.", tipo: "BICO", valor: 180, periodo: "TOTAL", dataInicio: "2027-01-23", dataFim: "2027-01-23", horario: "Das 6h às 15h", bairro: "Serrano", quantidade: 2, status: "ABERTA", idEmpregador: 21, idCidade: 3, idCategoria: 2, dataPublicacao: "2026-11-01" },
    { id: 93, titulo: "Balconista de mercadinho", descricao: "Atender no balcão e no caixa, repor prateleiras.", tipo: "FIXO", valor: 1600, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 7h às 15h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 22, idCidade: 4, idCategoria: 1, dataPublicacao: "2026-11-09" },
    { id: 94, titulo: "Entregas de bicicleta no sábado", descricao: "Levar as compras dos clientes que moram perto do centro.", tipo: "BICO", valor: 120, periodo: "DIA", dataInicio: "2026-12-01", dataFim: "2026-12-24", horario: "Sábados, das 8h às 12h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 22, idCidade: 4, idCategoria: 10, dataPublicacao: "2026-11-04" },
    { id: 95, titulo: "Roçada do terreno dos fundos", descricao: "Roçar e limpar um terreno de 800 m² atrás do mercado.", tipo: "BICO", valor: 250, periodo: "TOTAL", dataInicio: "2026-11-29", dataFim: "2026-11-29", horario: "Das 7h às 16h", bairro: "Zona rural", quantidade: 1, status: "ABERTA", idEmpregador: 22, idCidade: 4, idCategoria: 9, dataPublicacao: "2026-10-30" },
    { id: 96, titulo: "Ajudante de marcenaria", descricao: "Lixar, montar e envernizar móveis rústicos. Ensinamos o ofício.", tipo: "FIXO", valor: 2200, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 7h às 17h", bairro: "Vila Maria", quantidade: 1, status: "ABERTA", idEmpregador: 23, idCidade: 8, idCategoria: 14, dataPublicacao: "2026-11-02" },
    { id: 97, titulo: "Instalação de deck de madeira", descricao: "Ajudar na instalação de um deck de 20 m² em uma casa.", tipo: "BICO", valor: 600, periodo: "TOTAL", dataInicio: "2026-12-02", dataFim: "2026-12-04", horario: "Das 8h às 17h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 23, idCidade: 8, idCategoria: 4, dataPublicacao: "2026-11-01" },
    { id: 98, titulo: "Pintor de móveis", descricao: "Pintura e acabamento de móveis para as encomendas de verão.", tipo: "TEMPORARIO", valor: 1800, periodo: "MES", dataInicio: "2026-12-01", dataFim: "2027-02-28", horario: "Segunda a sexta, das 8h às 17h", bairro: "Vila Maria", quantidade: 1, status: "ABERTA", idEmpregador: 23, idCidade: 8, idCategoria: 14, dataPublicacao: "2026-11-01" },
    { id: 99, titulo: "Banhista e tosador", descricao: "Banho e tosa em cães e gatos. Experiência é um diferencial.", tipo: "FIXO", valor: 1800, periodo: "MES", dataInicio: null, dataFim: null, horario: "Terça a sábado, das 9h às 18h", bairro: "Jardim das Nações", quantidade: 1, status: "ABERTA", idEmpregador: 24, idCidade: 7, idCategoria: 14, dataPublicacao: "2026-11-17" },
    { id: 100, titulo: "Atendente de pet shop", descricao: "Vendas, agendamentos de banho e organização da loja.", tipo: "FIXO", valor: 1700, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 9h às 18h", bairro: "Jardim das Nações", quantidade: 1, status: "ABERTA", idEmpregador: 24, idCidade: 7, idCategoria: 1, dataPublicacao: "2026-10-30" },
    { id: 101, titulo: "Cuidador do hotelzinho de cães", descricao: "Alimentar, passear e cuidar dos cães hospedados nas férias.", tipo: "TEMPORARIO", valor: 80, periodo: "DIA", dataInicio: "2026-12-20", dataFim: "2027-01-10", horario: "Das 8h às 12h e das 16h às 19h", bairro: "Jardim das Nações", quantidade: 1, status: "ABERTA", idEmpregador: 24, idCidade: 7, idCategoria: 14, dataPublicacao: "2026-11-10" },
    { id: 102, titulo: "Passeador de cães", descricao: "Passear com cães de clientes no bairro, de segunda a sexta.", tipo: "BICO", valor: 40, periodo: "HORA", dataInicio: "2026-12-01", dataFim: "2026-12-31", horario: "Fins de tarde", bairro: "Jardim das Nações", quantidade: 2, status: "ABERTA", idEmpregador: 24, idCidade: 7, idCategoria: 14, dataPublicacao: "2026-11-13" },
    { id: 103, titulo: "Caseiro de chácara", descricao: "Cuidar da casa, do gramado, das galinhas e receber a família nos fins de semana.", tipo: "FIXO", valor: 1800, periodo: "MES", dataInicio: null, dataFim: null, horario: "Moradia na chácara, folga aos domingos", bairro: "Zona rural", quantidade: 1, status: "ABERTA", idEmpregador: 25, idCidade: 2, idCategoria: 3, dataPublicacao: "2026-11-16" },
    { id: 104, titulo: "Faxina antes das férias", descricao: "Faxina completa da casa da chácara antes da chegada da família.", tipo: "BICO", valor: 180, periodo: "TOTAL", dataInicio: "2026-12-18", dataFim: "2026-12-18", horario: "Das 8h às 16h", bairro: "Zona rural", quantidade: 1, status: "ABERTA", idEmpregador: 25, idCidade: 2, idCategoria: 5, dataPublicacao: "2026-10-26" },
    { id: 105, titulo: "Limpeza da piscina e do pomar", descricao: "Limpar a piscina, podar as frutíferas e roçar em volta do lago.", tipo: "BICO", valor: 400, periodo: "TOTAL", dataInicio: "2026-12-12", dataFim: "2026-12-13", horario: "Das 7h às 17h", bairro: "Zona rural", quantidade: 2, status: "ABERTA", idEmpregador: 25, idCidade: 2, idCategoria: 9, dataPublicacao: "2026-11-01" },
    { id: 106, titulo: "Babá para as férias", descricao: "Cuidar de duas crianças (5 e 8 anos) durante as férias na chácara.", tipo: "TEMPORARIO", valor: 150, periodo: "DIA", dataInicio: "2026-12-26", dataFim: "2027-01-15", horario: "Das 8h às 18h", bairro: "Zona rural", quantidade: 1, status: "ABERTA", idEmpregador: 25, idCidade: 2, idCategoria: 6, dataPublicacao: "2026-10-27" },
    { id: 107, titulo: "Equipe da Festa do Pinhão", descricao: "Atendimento nas barracas, organização de filas e limpeza durante a festa.", tipo: "TEMPORARIO", valor: 130, periodo: "DIA", dataInicio: "2027-06-01", dataFim: "2027-06-30", horario: "Das 16h às 23h", bairro: "Vila Abernéssia", quantidade: 10, status: "ABERTA", idEmpregador: 26, idCidade: 1, idCategoria: 8, dataPublicacao: "2026-11-14" },
    { id: 108, titulo: "Montagem das barracas da festa", descricao: "Montar as barracas, a iluminação e o palco antes da abertura.", tipo: "BICO", valor: 200, periodo: "TOTAL", dataInicio: "2027-05-28", dataFim: "2027-05-30", horario: "Das 7h às 18h", bairro: "Vila Abernéssia", quantidade: 6, status: "ABERTA", idEmpregador: 26, idCidade: 1, idCategoria: 8, dataPublicacao: "2026-10-26" },
    { id: 109, titulo: "Apoio na cantata de Natal", descricao: "Organizar cadeiras, distribuir programas e orientar o público na praça.", tipo: "BICO", valor: 150, periodo: "TOTAL", dataInicio: "2026-12-20", dataFim: "2026-12-20", horario: "Das 15h às 23h", bairro: "Vila Abernéssia", quantidade: 4, status: "ABERTA", idEmpregador: 26, idCidade: 1, idCategoria: 8, dataPublicacao: "2026-10-29" },
    { id: 110, titulo: "Auxiliar de produção cultural", descricao: "Controle de expositores, planilhas e contato com fornecedores da festa.", tipo: "TEMPORARIO", valor: 1600, periodo: "MES", dataInicio: "2027-04-01", dataFim: "2027-06-30", horario: "Segunda a sexta, das 13h às 18h", bairro: "Vila Abernéssia", quantidade: 1, status: "ABERTA", idEmpregador: 26, idCidade: 1, idCategoria: 12, dataPublicacao: "2026-11-04" },
    { id: 111, titulo: "Mecânico de automóveis", descricao: "Manutenção de suspensão, freios e motor. Experiência comprovada.", tipo: "FIXO", valor: 2400, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 8h às 18h", bairro: "Araretama", quantidade: 1, status: "ABERTA", idEmpregador: 27, idCidade: 6, idCategoria: 14, dataPublicacao: "2026-11-02" },
    { id: 112, titulo: "Borracheiro", descricao: "Conserto e troca de pneus, balanceamento e atendimento no balcão.", tipo: "FIXO", valor: 1700, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 8h às 17h", bairro: "Araretama", quantidade: 1, status: "ABERTA", idEmpregador: 27, idCidade: 6, idCategoria: 14, dataPublicacao: "2026-11-13" },
    { id: 113, titulo: "Aprendiz de mecânico", descricao: "Para quem quer aprender a profissão. Jovem de 16 a 22 anos.", tipo: "FIXO", valor: 1300, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 8h às 14h", bairro: "Araretama", quantidade: 1, status: "ABERTA", idEmpregador: 27, idCidade: 6, idCategoria: 14, dataPublicacao: "2026-11-02" },
    { id: 114, titulo: "Jardineiro paisagista", descricao: "Manutenção de jardins de casas e pousadas atendidas pela floricultura.", tipo: "FIXO", valor: 2000, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 7h às 16h", bairro: "Jaguaribe", quantidade: 2, status: "ABERTA", idEmpregador: 28, idCidade: 1, idCategoria: 9, dataPublicacao: "2026-11-10" },
    { id: 115, titulo: "Atendente de floricultura", descricao: "Montar arranjos simples, atender clientes e cuidar das plantas da loja.", tipo: "FIXO", valor: 1700, periodo: "MES", dataInicio: null, dataFim: null, horario: "Terça a domingo, das 9h às 18h", bairro: "Capivari", quantidade: 1, status: "ABERTA", idEmpregador: 28, idCidade: 1, idCategoria: 1, dataPublicacao: "2026-11-14" },
    { id: 116, titulo: "Plantio de jardim de pousada", descricao: "Preparar a terra e plantar o jardim novo de uma pousada.", tipo: "BICO", valor: 160, periodo: "DIA", dataInicio: "2026-12-07", dataFim: "2026-12-11", horario: "Das 7h às 16h", bairro: "Descansópolis", quantidade: 2, status: "ABERTA", idEmpregador: 28, idCidade: 1, idCategoria: 9, dataPublicacao: "2026-10-28" },
    { id: 117, titulo: "Decoração floral de casamento", descricao: "Ajudar a montar a decoração de flores de um casamento ao ar livre.", tipo: "BICO", valor: 180, periodo: "TOTAL", dataInicio: "2027-01-30", dataFim: "2027-01-30", horario: "Das 8h às 16h", bairro: "Capivari", quantidade: 2, status: "ABERTA", idEmpregador: 28, idCidade: 1, idCategoria: 8, dataPublicacao: "2026-10-26" },
    { id: 118, titulo: "Cozinheira em casa de família", descricao: "Fazer almoço e jantar para um casal de idosos.", tipo: "FIXO", valor: 1700, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 8h às 16h", bairro: "Quiririm", quantidade: 1, status: "ABERTA", idEmpregador: 5, idCidade: 7, idCategoria: 5, dataPublicacao: "2026-11-03" },
    { id: 119, titulo: "Ajudante de colheita de milho", descricao: "Colheita manual de milho na propriedade de Monteiro Lobato.", tipo: "TEMPORARIO", valor: 110, periodo: "DIA", dataInicio: "2027-03-01", dataFim: "2027-04-15", horario: "Das 6h às 14h", bairro: "Zona rural", quantidade: 2, status: "ABERTA", idEmpregador: 3, idCidade: 4, idCategoria: 3, dataPublicacao: "2026-10-27" },
    { id: 120, titulo: "Copeiro para festa de 15 anos", descricao: "Servir bebidas e repor o buffet em uma festa para 120 convidados.", tipo: "BICO", valor: 220, periodo: "TOTAL", dataInicio: "2026-12-12", dataFim: "2026-12-12", horario: "Das 15h às 23h", bairro: "Centro", quantidade: 3, status: "ABERTA", idEmpregador: 4, idCidade: 2, idCategoria: 8, dataPublicacao: "2026-11-02" },
    { id: 121, titulo: "Vendedor para temporada de inverno", descricao: "Vendas na loja de chocolates durante julho, o mês mais movimentado.", tipo: "TEMPORARIO", valor: 1800, periodo: "MES", dataInicio: "2027-06-01", dataFim: "2027-07-31", horario: "Das 12h às 20h", bairro: "Capivari", quantidade: 2, status: "ABERTA", idEmpregador: 2, idCidade: 1, idCategoria: 1, dataPublicacao: "2026-10-26" },
    { id: 122, titulo: "Limpeza de calhas e telhado", descricao: "Limpar as calhas e trocar algumas telhas quebradas da pousada.", tipo: "BICO", valor: 250, periodo: "TOTAL", dataInicio: "2026-11-21", dataFim: "2026-11-22", horario: "Das 8h às 17h", bairro: "Capivari", quantidade: 1, status: "ABERTA", idEmpregador: 1, idCidade: 1, idCategoria: 9, dataPublicacao: "2026-10-31" },
    { id: 123, titulo: "Professor de inglês para adultos", descricao: "Turma de inglês para iniciantes na unidade de Pindamonhangaba.", tipo: "FIXO", valor: 50, periodo: "HORA", dataInicio: null, dataFim: null, horario: "Segundas e quartas, das 18h às 20h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 12, idCidade: 6, idCategoria: 13, dataPublicacao: "2026-11-09" },
    { id: 124, titulo: "Auxiliar de compras e estoque", descricao: "Fazer pedidos aos fornecedores e controlar o estoque no sistema.", tipo: "FIXO", valor: 2100, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sexta, das 8h às 17h", bairro: "Vila Abernéssia", quantidade: 1, status: "ABERTA", idEmpregador: 7, idCidade: 1, idCategoria: 12, dataPublicacao: "2026-10-31" },
    { id: 125, titulo: "Ajudante de padeiro em Tremembé", descricao: "Ajudar na produção da nossa nova unidade em Tremembé.", tipo: "FIXO", valor: 1800, periodo: "MES", dataInicio: null, dataFim: null, horario: "Segunda a sábado, das 5h às 13h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 19, idCidade: 8, idCategoria: 7, dataPublicacao: "2026-11-05" },
    { id: 126, titulo: "Frete de carga para Sapucaí-Mirim", descricao: "Levar carga de material de construção até Sapucaí-Mirim e ajudar a descarregar.", tipo: "BICO", valor: 300, periodo: "TOTAL", dataInicio: "2026-12-09", dataFim: "2026-12-09", horario: "Das 6h às 16h", bairro: "Centro", quantidade: 1, status: "ABERTA", idEmpregador: 16, idCidade: 5, idCategoria: 10, dataPublicacao: "2026-10-27" },
    { id: 127, titulo: "Garçom para festa de Halloween", descricao: "Reforço na festa temática do restaurante.", tipo: "BICO", valor: 170, periodo: "TOTAL", dataInicio: "2026-10-31", dataFim: "2026-10-31", horario: "Das 18h às 2h", bairro: "Capivari", quantidade: 2, status: "FECHADA", idEmpregador: 6, idCidade: 1, idCategoria: 8, dataPublicacao: "2026-10-12" },
    { id: 128, titulo: "Colhedor de morango (safra 2026)", descricao: "Colheita da safra de inverno.", tipo: "TEMPORARIO", valor: 115, periodo: "DIA", dataInicio: "2026-08-01", dataFim: "2026-10-15", horario: "Das 6h às 14h", bairro: "Quilombo", quantidade: 4, status: "FECHADA", idEmpregador: 11, idCidade: 3, idCategoria: 3, dataPublicacao: "2026-07-07" },
    { id: 129, titulo: "Equipe da Festa do Pinhão 2026", descricao: "Atendimento nas barracas da festa de 2026.", tipo: "TEMPORARIO", valor: 120, periodo: "DIA", dataInicio: "2026-06-01", dataFim: "2026-06-30", horario: "Das 16h às 23h", bairro: "Vila Abernéssia", quantidade: 8, status: "FECHADA", idEmpregador: 26, idCidade: 1, idCategoria: 8, dataPublicacao: "2026-05-10" },
    { id: 130, titulo: "Penteado para casamento", descricao: "Penteado da noiva e das madrinhas.", tipo: "BICO", valor: 250, periodo: "TOTAL", dataInicio: "2026-11-07", dataFim: "2026-11-07", horario: "Das 6h às 12h", bairro: "Jaguaribe", quantidade: 1, status: "FECHADA", idEmpregador: 13, idCidade: 1, idCategoria: 11, dataPublicacao: "2026-10-15" }
  ],

  candidaturas: [
    { id: 1, idTrabalhador: 1, idVaga: 1, status: "ENVIADA", mensagem: null, dataCandidatura: "2026-11-10", dataResposta: null },
    { id: 2, idTrabalhador: 1, idVaga: 6, status: "ACEITA", mensagem: "Pode vir conversar na loja segunda às 10h.", dataCandidatura: "2026-11-11", dataResposta: "2026-11-14" },
    { id: 3, idTrabalhador: 1, idVaga: 5, status: "ACEITA", mensagem: "Bem-vinda à equipe do festival!", dataCandidatura: "2026-06-20", dataResposta: "2026-06-25" },
    { id: 4, idTrabalhador: 3, idVaga: 13, status: "ACEITA", mensagem: "Chegar às 15h30 com roupa social preta.", dataCandidatura: "2026-11-12", dataResposta: "2026-11-16" },
    { id: 5, idTrabalhador: 3, idVaga: 15, status: "ENVIADA", mensagem: null, dataCandidatura: "2026-11-15", dataResposta: null },
    { id: 6, idTrabalhador: 3, idVaga: 3, status: "ENVIADA", mensagem: null, dataCandidatura: "2026-11-16", dataResposta: null },
    { id: 7, idTrabalhador: 2, idVaga: 4, status: "ENVIADA", mensagem: null, dataCandidatura: "2026-11-13", dataResposta: null },
    { id: 8, idTrabalhador: 2, idVaga: 14, status: "ACEITA", mensagem: "Te espero às 8h no salão.", dataCandidatura: "2026-11-12", dataResposta: "2026-11-15" },
    { id: 9, idTrabalhador: 4, idVaga: 16, status: "ACEITA", mensagem: "Fechado. Começamos segunda às 7h.", dataCandidatura: "2026-11-12", dataResposta: "2026-11-15" },
    { id: 10, idTrabalhador: 4, idVaga: 9, status: "ENVIADA", mensagem: null, dataCandidatura: "2026-11-16", dataResposta: null },
    { id: 11, idTrabalhador: 5, idVaga: 19, status: "RECUSADA", mensagem: "Preciso de alguém com experiência em cuidado noturno. Obrigado!", dataCandidatura: "2026-11-10", dataResposta: "2026-11-13" },
    { id: 12, idTrabalhador: 5, idVaga: 20, status: "ENVIADA", mensagem: null, dataCandidatura: "2026-11-14", dataResposta: null },
    { id: 13, idTrabalhador: 6, idVaga: 10, status: "ENVIADA", mensagem: null, dataCandidatura: "2026-11-11", dataResposta: null },
    { id: 14, idTrabalhador: 6, idVaga: 12, status: "CANCELADA", mensagem: null, dataCandidatura: "2026-11-09", dataResposta: "2026-11-12" },
    { id: 15, idTrabalhador: 6, idVaga: 11, status: "ENVIADA", mensagem: null, dataCandidatura: "2026-11-12", dataResposta: null }
  ]
};

const TIPOS = {
  FIXO: "Fixo",
  TEMPORARIO: "Temporário",
  BICO: "Bico"
};

const PERIODOS = {
  HORA: "por hora",
  DIA: "por dia",
  SEMANA: "por semana",
  MES: "por mês",
  TOTAL: "no total"
};

const DISPONIBILIDADES = {
  INTEGRAL: "Integral",
  MEIO_PERIODO: "Meio período",
  FINS_DE_SEMANA: "Fins de semana",
  BICOS: "Só bicos"
};

const STATUS_CANDIDATURA = {
  ENVIADA: "Aguardando resposta",
  ACEITA: "Aceita",
  RECUSADA: "Recusada",
  CANCELADA: "Cancelada"
};
