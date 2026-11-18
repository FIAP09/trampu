package br.com.trampu.dados;

import br.com.trampu.model.Candidatura;
import br.com.trampu.model.Categoria;
import br.com.trampu.model.Cidade;
import br.com.trampu.model.Disponibilidade;
import br.com.trampu.model.Empregador;
import br.com.trampu.model.PeriodoPagamento;
import br.com.trampu.model.StatusCandidatura;
import br.com.trampu.model.StatusVaga;
import br.com.trampu.model.TipoVaga;
import br.com.trampu.model.Trabalhador;
import br.com.trampu.model.Vaga;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Guarda os dados do sistema em listas (em memória).
 * Os dados iniciais são os mesmos do script banco/trampu.sql,
 * inclusive os hashes de senha (senha de teste: Trampu@123).
 */
public class BaseDeDados {

    private final List<Cidade> cidades = new ArrayList<>();
    private final List<Categoria> categorias = new ArrayList<>();
    private final List<Trabalhador> trabalhadores = new ArrayList<>();
    private final List<Empregador> empregadores = new ArrayList<>();
    private final List<Vaga> vagas = new ArrayList<>();
    private final List<Candidatura> candidaturas = new ArrayList<>();

    public BaseDeDados() {
        carregarDadosIniciais();
    }

    public List<Cidade> getCidades() {
        return cidades;
    }

    public List<Categoria> getCategorias() {
        return categorias;
    }

    public List<Trabalhador> getTrabalhadores() {
        return trabalhadores;
    }

    public List<Empregador> getEmpregadores() {
        return empregadores;
    }

    public List<Vaga> getVagas() {
        return vagas;
    }

    public List<Candidatura> getCandidaturas() {
        return candidaturas;
    }

    // ------------------------------------------------------------------
    // Geração de IDs (equivalente à PK no banco)
    // ------------------------------------------------------------------

    public int proximoIdTrabalhador() {
        int maior = 0;
        for (Trabalhador t : trabalhadores) {
            maior = Math.max(maior, t.getId());
        }
        return maior + 1;
    }

    public int proximoIdEmpregador() {
        int maior = 0;
        for (Empregador e : empregadores) {
            maior = Math.max(maior, e.getId());
        }
        return maior + 1;
    }

    public int proximoIdVaga() {
        int maior = 0;
        for (Vaga v : vagas) {
            maior = Math.max(maior, v.getId());
        }
        return maior + 1;
    }

    public int proximoIdCandidatura() {
        int maior = 0;
        for (Candidatura c : candidaturas) {
            maior = Math.max(maior, c.getId());
        }
        return maior + 1;
    }

    // ------------------------------------------------------------------
    // Buscas simples por ID (usadas na carga inicial)
    // ------------------------------------------------------------------

    private Cidade cidade(int id) {
        for (Cidade c : cidades) {
            if (c.getId() == id) {
                return c;
            }
        }
        throw new IllegalStateException("Cidade não encontrada: " + id);
    }

    private Categoria categoria(int id) {
        for (Categoria c : categorias) {
            if (c.getId() == id) {
                return c;
            }
        }
        throw new IllegalStateException("Categoria não encontrada: " + id);
    }

    private Trabalhador trabalhador(int id) {
        for (Trabalhador t : trabalhadores) {
            if (t.getId() == id) {
                return t;
            }
        }
        throw new IllegalStateException("Trabalhador não encontrado: " + id);
    }

    private Empregador empregador(int id) {
        for (Empregador e : empregadores) {
            if (e.getId() == id) {
                return e;
            }
        }
        throw new IllegalStateException("Empregador não encontrado: " + id);
    }

    private Vaga vaga(int id) {
        for (Vaga v : vagas) {
            if (v.getId() == id) {
                return v;
            }
        }
        throw new IllegalStateException("Vaga não encontrada: " + id);
    }

    // ------------------------------------------------------------------
    // Carga inicial
    // ------------------------------------------------------------------

    private void carregarDadosIniciais() {
        carregarCidades();
        carregarCategorias();
        carregarTrabalhadores();
        carregarEmpregadores();
        carregarVagas();
        carregarCandidaturas();
    }

    private void carregarCidades() {
        cidades.add(new Cidade(1, "Campos do Jordão", "SP"));
        cidades.add(new Cidade(2, "Santo Antônio do Pinhal", "SP"));
        cidades.add(new Cidade(3, "São Bento do Sapucaí", "SP"));
        cidades.add(new Cidade(4, "Monteiro Lobato", "SP"));
        cidades.add(new Cidade(5, "Sapucaí-Mirim", "MG"));
        cidades.add(new Cidade(6, "Pindamonhangaba", "SP"));
        cidades.add(new Cidade(7, "Taubaté", "SP"));
        cidades.add(new Cidade(8, "Tremembé", "SP"));
    }

    private void carregarCategorias() {
        categorias.add(new Categoria(1, "Comércio e atendimento", "Atendente, balconista, caixa, repositor, vendedor"));
        categorias.add(new Categoria(2, "Turismo e hotelaria", "Camareira, recepção de pousada, guia, monitor de passeio"));
        categorias.add(new Categoria(3, "Rural e agro", "Colheita, ordenha, trato de animais, caseiro de sítio"));
        categorias.add(new Categoria(4, "Construção e reforma", "Pedreiro, ajudante, pintor, eletricista, encanador"));
        categorias.add(new Categoria(5, "Serviços domésticos", "Diarista, faxina, passadeira, cozinheira em casa de família"));
        categorias.add(new Categoria(6, "Cuidados", "Babá, cuidador de idoso, acompanhante"));
        categorias.add(new Categoria(7, "Alimentação", "Ajudante de cozinha, padeiro, salgadeira, chapeiro"));
        categorias.add(new Categoria(8, "Eventos e festas", "Garçom, copeiro, montagem de festa, quermesse, rodeio"));
        categorias.add(new Categoria(9, "Jardinagem e manutenção", "Roçada de terreno, jardineiro, limpeza de piscina, pequenos reparos"));
        categorias.add(new Categoria(10, "Transporte e entregas", "Motoboy, entregador, motorista, mudança, carga e descarga"));
        categorias.add(new Categoria(11, "Beleza e estética", "Cabeleireiro, manicure, auxiliar de salão"));
        categorias.add(new Categoria(12, "Escritório e administrativo", "Recepcionista, auxiliar administrativo, digitação"));
        categorias.add(new Categoria(13, "Aulas e reforço", "Reforço escolar, aula de música, informática básica"));
        categorias.add(new Categoria(14, "Outros", "Trabalhos que não se encaixam nas demais categorias"));
    }

    private void addTrabalhador(int id, String nome, String username, String cpf, String email, String telefone,
                                String hash, String descricao, String habilidades,
                                Disponibilidade disp, int idCidade, int... cidadesAtuacao) {
        Trabalhador t = new Trabalhador(id, nome, username, cpf, email, telefone, hash, cidade(idCidade), disp);
        t.setDescricao(descricao);
        t.setHabilidades(habilidades);
        for (int idAtuacao : cidadesAtuacao) {
            t.adicionarCidadeAtuacao(cidade(idAtuacao));
        }
        trabalhadores.add(t);
    }

    private void carregarTrabalhadores() {
        addTrabalhador(1, "Ana Paula Souza", "anapaula", "11122233344", "ana.souza@email.com", "12991110001",
                "pbkdf2_sha256$600000$pceH99E3TllaxdEKkva+Dw==$9SAP46l8WM+0lRDXFUD9k8iVsBLJvwLYbkeJuzx6VbU=",
                "Trabalho há 6 anos em pousadas de Campos. Sou caprichosa e pontual.",
                "limpeza, arrumação de quartos, atendimento", Disponibilidade.INTEGRAL, 1, 1, 2);

        addTrabalhador(2, "Carlos Eduardo Lima", "carlinhos.lima", "22233344455", "carlos.lima@email.com", "12991110002",
                "pbkdf2_sha256$600000$IkNo22tD6HDyMlOOpNmiYQ==$/A4sdzzRRe3Z5nYjLs+xtUDgvtTYIZC8n5nT6eG7LqY=",
                "Faço jardinagem e roçada. Tenho roçadeira própria.",
                "jardinagem, roçada, pequenos reparos", Disponibilidade.BICOS, 2, 2, 1, 3);

        addTrabalhador(3, "Juliana Ribeiro", "ju.ribeiro", "33344455566", "juliana.ribeiro@email.com", "12991110003",
                "pbkdf2_sha256$600000$VAoxIz2WfzvqQp1Pa+W+GA==$UCM+EcuMGrr5oNr1xdoXqlmQRTialKIo22aaVyLEqvU=",
                "Estudante, trabalho como garçonete em eventos nos fins de semana.",
                "garçonete, caixa, inglês básico", Disponibilidade.FINS_DE_SEMANA, 1, 1, 2);

        addTrabalhador(4, "Marcos Antônio Pereira", "marcos.pedreiro", "44455566677", "marcos.pereira@email.com", "12991110004",
                "pbkdf2_sha256$600000$gypdT/bH6TlynPG/a6UJfA==$MxSK/ywS5qW7teeasADWlyy2GjuRczmcdrIctgIN390=",
                "Pedreiro há 15 anos. Faço reboco, muro, piso e pintura.",
                "pedreiro, pintura, reboco, piso", Disponibilidade.INTEGRAL, 3, 3, 1, 5);

        addTrabalhador(5, "Fernanda Oliveira", "fe.oliveira", "55566677788", "fernanda.oliveira@email.com", "12991110005",
                "pbkdf2_sha256$600000$OkRyB+ALC2dgADLg1ARrVQ==$Kuz5jR0EFaqGk+uVBWxPO/dhu9ziXa2tC6/iMKuqT6U=",
                "Tenho experiência em recepção e rotinas administrativas.",
                "recepção, Excel, atendimento ao público", Disponibilidade.MEIO_PERIODO, 6, 6, 7, 8);

        addTrabalhador(6, "José Benedito Santos", "zebenedito", "66677788899", "jose.santos@email.com", "12991110006",
                "pbkdf2_sha256$600000$6DfXY1e3cC+iU7Z12iBiRQ==$fiQAkmJUbnOK5xYOtGMiM1nSJgOKTqanoAYA8qF34iM=",
                "Cresci na roça. Sei lidar com gado, ordenha e colheita.",
                "colheita, ordenha, trato de animais", Disponibilidade.INTEGRAL, 4, 4, 3, 7);
    }

    private void addEmpregador(int id, String nome, String username, String documento, String email, String telefone,
                               String hash, String descricao, String nomeNegocio, int idCidade) {
        Empregador e = new Empregador(id, nome, username, documento, email, telefone, hash, cidade(idCidade));
        e.setDescricao(descricao);
        e.setNomeNegocio(nomeNegocio);
        empregadores.add(e);
    }

    private void carregarEmpregadores() {
        addEmpregador(1, "Roberto Almeida", "pousadaserrazul", "12345678000101", "roberto@pousadaserrazul.com", "12992220001",
                "pbkdf2_sha256$600000$jgPAJWKCrYNtED/mEAwkCw==$DCPrEELPjsl8g24QPM8Zq8C057VnM6C8F35A1xw/seo=",
                "Toco a pousada com minha família há 12 anos. Na temporada de inverno sempre precisamos de reforço.",
                "Pousada Serra Azul", 1);

        addEmpregador(2, "Maria Helena Costa", "chocolatesdamaria", "23456789000102", "maria@chocolatesdamaria.com", "12992220002",
                "pbkdf2_sha256$600000$vg0LA5JO90ElT/18k5ZJog==$dx48ddC58zbGcIxiID3S82/0SMqBfwGulU4BljMhzBw=",
                "Chocolate artesanal feito em Campos desde 2009.",
                "Chocolates da Maria", 1);

        addEmpregador(3, "Antônio Carlos Moreira", "sitiobomretiro", "77788899900", "antonio.moreira@email.com", "12992220003",
                "pbkdf2_sha256$600000$Pt0NhRlh4C9KX04NDpEi0A==$o3OmHc/9sevF8qKjeJO6/yiDBHLCQYAQWcJ16At5LZY=",
                "Produtor rural. Tenho gado de leite e lavoura no sítio.",
                "Sítio Bom Retiro", 3);

        addEmpregador(4, "Luciana Prado", "lu.eventos", "34567890000103", "luciana@pradoeventos.com", "12992220004",
                "pbkdf2_sha256$600000$r2ptVKXw0D4bczlh0SDqJA==$BTlk4qv3K7vIVB76PQQjrnI8lYiObnkhDUdwbDRvXV0=",
                "Organizo casamentos e festas na serra. Sempre preciso de garçons e montadores.",
                "Prado Festas e Eventos", 2);

        addEmpregador(5, "Paulo Henrique Dias", "paulodias", "88899900011", "paulo.dias@email.com", "12992220005",
                "pbkdf2_sha256$600000$4TKiki1EQAGnPnXWjSn4MA==$uFPw5njH4bR3qORn8eIN95YaByYTVsvwkN328hwkdtI=",
                "Aposentado. Contrato serviços para minha casa e para cuidar da minha mãe.",
                null, 7);

        // mais empregadores da região
        addEmpregador(6, "Sérgio Nogueira", "saborserra", "45678901000104", "contato@sabordaserra.com", "12992220006",
                "pbkdf2_sha256$600000$cohkAn6LvxJ2iG82Se2tHg==$WivpGXMMKd1k2ZamPmr4G44qjy6w3GD8bgPAHd90KY4=",
                "Restaurante de comida mineira e fondue no Capivari. Na temporada o movimento triplica.",
                "Restaurante Sabor da Serra", 1);
        addEmpregador(7, "Cláudia Martins", "supermantiqueira", "56789012000105", "rh@supermantiqueira.com", "12992220007",
                "pbkdf2_sha256$600000$cdVxDgYLFCrJ1wGoUoNGhA==$Szquz7ji7KmgWpHjgOYb+E9PyQ346V7GjUNtE+0/lHM=",
                "Supermercado de bairro em Abernéssia, com entrega em casa.",
                "Supermercado Mantiqueira", 1);
        addEmpregador(8, "Eduardo Kenji Sato", "hotelaraucarias", "67890123000106", "reservas@hotelaraucarias.com", "12992220008",
                "pbkdf2_sha256$600000$igaxyVjdlzkowhG2t7Xirw==$g12ulYJZsf2HyRQS3pRLy+71Ldk0ev8tagGclCNhj9E=",
                "Hotel com 40 apartamentos, restaurante e área verde no Alto da Boa Vista.",
                "Hotel Vale das Araucárias", 1);
        addEmpregador(9, "Ricardo Fonseca", "construpinhal", "78901234000107", "obras@construpinhal.com", "12992220009",
                "pbkdf2_sha256$600000$AdlIQUNdmr06YO50uW9osA==$z8cgU+h+jO/nOTSqWVboFppqr3DwWwWa4oLS/HYK7QY=",
                "Pequena construtora de casas e reformas em Santo Antônio do Pinhal e região.",
                "Construtora Pinhal", 2);
        addEmpregador(10, "Beatriz Lacerda", "pousadapicoagudo", "89012345000108", "beatriz@pousadapicoagudo.com", "12992220010",
                "pbkdf2_sha256$600000$F1TOmXPM1FUDBZvIxgLo6g==$Z7k4/78Zm+BPzc38En9e+stRaOg3Jt9binghe6vubxE=",
                "Pousada de chalés com vista para o Pico Agudo. Atendimento de família.",
                "Pousada Pico Agudo", 2);
        addEmpregador(11, "Joaquim Ribeiro", "fazendasantaclara", "90123456000109", "joaquim@fazendasantaclara.com", "12992220011",
                "pbkdf2_sha256$600000$qCKH5tGFbLOT+oPL4P8rbQ==$m3VhgG8G7Ada3pmojOqPma8PAiDjBTX6rTfo/rXoz68=",
                "Produzimos morango, leite e queijo em São Bento do Sapucaí há três gerações.",
                "Fazenda Santa Clara", 3);
        addEmpregador(12, "Patrícia Andrade", "acordesmusica", "01234567000110", "patricia@escolaacordes.com", "12992220012",
                "pbkdf2_sha256$600000$aZtjyWUw1H4AuYPveMPkqg==$aMmZdLJbXuCX43p8fh6a+NGeRT8YlCsK9DYvafCCW34=",
                "Escola de música e reforço escolar em Taubaté, com turmas para crianças e adultos.",
                "Escola Acordes", 7);
        addEmpregador(13, "Vanessa Rocha", "belaserra.salao", "11223344000111", "vanessa@belaserra.com", "12992220013",
                "pbkdf2_sha256$600000$dkAJ7G8CJMgNHsMI4+EL+Q==$X2owurmReoACE+/3lyrdM3hAScNXGw+yuXIzOYHyZPI=",
                "Salão de beleza no Jaguaribe. Atendemos noivas e formaturas da região.",
                "Salão Bela Serra", 1);
        addEmpregador(14, "Guilherme Prado", "cervejamontanha", "22334455000112", "gui@cervejamontanha.com", "12992220014",
                "pbkdf2_sha256$600000$ciBdI70g/uVIuyExuN5TGQ==$gw+AenwQc5VabGuoVwDQRd4VfmxFMhYgS01T/p3M5Po=",
                "Cervejaria artesanal com bar e eventos aos fins de semana.",
                "Cervejaria Montanha", 1);
        addEmpregador(15, "Rosana Teixeira", "recantodosavos", "33445566000113", "contato@recantodosavos.com", "12992220015",
                "pbkdf2_sha256$600000$raYh8q9/vkl4oVNoI7coVA==$3H1TjsGa6I5JglBKMoSZvED8+/OO77FepKlaZh9alxU=",
                "Casa de repouso com 18 residentes em Pindamonhangaba.",
                "Recanto dos Avós", 6);
        addEmpregador(16, "Fábio Cardoso", "valelogistica", "44556677000114", "rh@valelogistica.com", "12992220016",
                "pbkdf2_sha256$600000$8OGIlMUnkX9egtoVoYvm8Q==$1hmubl/YM4DirjXDnbop5Qax1Te1jsySVT+0QLy8A4k=",
                "Transportadora e entregas para o comércio do Vale do Paraíba.",
                "Vale Logística", 7);
        addEmpregador(17, "Silvia Moraes", "contabilsilva", "55667788000115", "silvia@contabilsilva.com", "12992220017",
                "pbkdf2_sha256$600000$WL5b+vjWSbCzkPvQdnnIzA==$Tn04SJM0XvKs9ooLmmObxmh9vphIzoQ5Q3p9tKNB/mY=",
                "Escritório de contabilidade que atende pequenos negócios da região.",
                "Contabilidade Silva", 7);
        addEmpregador(18, "Aparecida Gomes", "dona.cida", "12345609871", "cida.gomes@email.com", "12992220018",
                "pbkdf2_sha256$600000$PLnVXK7YmVQCTXEYv8aKpA==$WmsDfrZQDYW5QywL59aFvWk+Hfa56gXT1F9sqrDYEmo=",
                "Moro sozinha com meu marido em Tremembé e preciso de ajuda em casa.",
                null, 8);
        addEmpregador(19, "Marcelo Duarte", "paodaserra", "66778899000116", "marcelo@paodaserra.com", "12992220019",
                "pbkdf2_sha256$600000$hIEgTqZDbpmbOJyAGp9Wtg==$gNr8fXAeVVqyF6vwUUHvqm6tVZCRXnXcNpQjGeBQcbM=",
                "Padaria e confeitaria no centro de Pindamonhangaba, aberta todos os dias.",
                "Padaria Pão da Serra", 6);
        addEmpregador(20, "Helena Vasconcelos", "sitiohortensias", "77889900000117", "helena@sitiohortensias.com", "12992220020",
                "pbkdf2_sha256$600000$xb3rAQEtq3/v/3kNXkY+5w==$/svSrLO3cSCOpnIfGnkQV0QF3UtYyOgo7RtQHLNLQLA=",
                "Sítio de orgânicos em Sapucaí-Mirim. Vendemos cestas para Campos e São Paulo.",
                "Sítio das Hortênsias", 5);
        addEmpregador(21, "Thiago Bastos", "serraaventura", "88990011000118", "thiago@serraaventura.com", "12992220021",
                "pbkdf2_sha256$600000$1ev1OhicjvEZQ+10F9LaxA==$2V0ewNy3v14rGBSbFg1C+cMUk/jwwcpUSOTSu4RTIIs=",
                "Agência de turismo de aventura: trilhas, escalada na Pedra do Baú e passeios de jipe.",
                "Serra Aventura", 3);
        addEmpregador(22, "José Carlos Pires", "mercadinhodoze", "23456781234", "ze.pires@email.com", "12992220022",
                "pbkdf2_sha256$600000$LgSfzQKDE4dblZMoRrIHlw==$1+gl5qfw7A3YWnk98HxmdrOZ4kqZyF90jtJA324Mjlo=",
                "Mercadinho de família no centro de Monteiro Lobato.",
                "Mercadinho do Zé", 4);
        addEmpregador(23, "Otávio Lemos", "artemadeira", "99001122000119", "otavio@artemadeira.com", "12992220023",
                "pbkdf2_sha256$600000$98+xphO4kxnCMgDmhcvyVA==$dkzlh/470lCnKhvZyUaujxx9kPKDiXF2BpUYVAC5IqM=",
                "Marcenaria de móveis rústicos sob encomenda.",
                "Arte em Madeira", 8);
        addEmpregador(24, "Camila Freitas", "amigofiel.pet", "10293847000120", "camila@amigofielpet.com", "12992220024",
                "pbkdf2_sha256$600000$TLLHl32uvgX7pHw/uTCy2w==$othMbQ0Od94ejWG8uZ125UPvSuuQObSG0wJSF8n+Hvs=",
                "Pet shop com banho e tosa e hotelzinho para cães.",
                "Pet Shop Amigo Fiel", 7);
        addEmpregador(25, "Família Andrade", "chacaraandrade", "34567812345", "andrade.familia@email.com", "12992220025",
                "pbkdf2_sha256$600000$cyPk4mTjWohi/N8qPxmpoQ==$TD+p9Jgz97fqS9m0Hvc5GHR/7lWSnIX92DhN+mAeaao=",
                "Temos uma chácara de fim de semana e precisamos de gente de confiança da região.",
                null, 2);
        addEmpregador(26, "Neusa Barbosa", "festadopinhao", "21324354000121", "neusa@festadopinhao.org", "12992220026",
                "pbkdf2_sha256$600000$gxKbeIM37A+QO8a9hZmdWA==$3M7PIDCLXyNoNa/1++rm/fpghS23m9tceBMcm2j+v5U=",
                "Associação que organiza a Festa do Pinhão e eventos culturais da cidade.",
                "Associação Festa do Pinhão", 1);
        addEmpregador(27, "Rogério Alves", "mecanicaserrana", "32435465000122", "rogerio@mecanicaserrana.com", "12992220027",
                "pbkdf2_sha256$600000$5C4dGYfSAdKo8Xol5S2RnQ==$N7zTy79erqcT3vA3zOTIklEPNS1LlB4sKGBG8qc2FOY=",
                "Oficina mecânica e borracharia na entrada de Pindamonhangaba.",
                "Auto Mecânica Serrana", 6);
        addEmpregador(28, "Lívia Campos", "jardimencantado", "43546576000123", "livia@jardimencantado.com", "12992220028",
                "pbkdf2_sha256$600000$rmQNQeCx7DDttlIoTEDEvA==$RJthllJ1Vkt3NhweoeKuBPjNRFje7ElXFjq65Judp6s=",
                "Floricultura e paisagismo para casas e pousadas da serra.",
                "Jardim Encantado", 1);
    }

    private void addVaga(int id, String titulo, String descricao, TipoVaga tipo, double valor, PeriodoPagamento periodo,
                         String inicio, String fim, String horario, String bairro, int quantidade, StatusVaga status,
                         int idEmpregador, int idCidade, int idCategoria) {
        Vaga v = new Vaga(id, titulo, descricao, tipo, valor, periodo, quantidade,
                empregador(idEmpregador), cidade(idCidade), categoria(idCategoria));
        v.setDataInicio(inicio == null ? null : LocalDate.parse(inicio));
        v.setDataFim(fim == null ? null : LocalDate.parse(fim));
        v.setHorario(horario);
        v.setBairro(bairro);
        v.setStatus(status);
        vagas.add(v);
    }

    private void carregarVagas() {
        TipoVaga FIXO = TipoVaga.FIXO, TEMP = TipoVaga.TEMPORARIO, BICO = TipoVaga.BICO;
        StatusVaga ABERTA = StatusVaga.ABERTA, FECHADA = StatusVaga.FECHADA;

        // Pousada Serra Azul
        addVaga(1, "Camareira para temporada de inverno", "Arrumação e limpeza de quartos durante a alta temporada. Alimentação no local.",
                TEMP, 120, PeriodoPagamento.DIA, "2027-06-20", "2027-07-31", "Escala 6x1, das 8h às 16h", "Capivari", 3, ABERTA, 1, 1, 2);
        addVaga(2, "Recepcionista de pousada", "Check-in, check-out, reservas por telefone e WhatsApp. Inglês básico é um diferencial.",
                FIXO, 2100, PeriodoPagamento.MES, null, null, "Escala 6x1, das 14h às 22h", "Capivari", 1, ABERTA, 1, 1, 2);
        addVaga(3, "Auxiliar de cozinha para temporada", "Preparo do café da manhã e apoio na cozinha do restaurante da pousada.",
                TEMP, 130, PeriodoPagamento.DIA, "2027-06-25", "2027-07-31", "Das 6h às 14h", "Capivari", 2, ABERTA, 1, 1, 7);
        addVaga(4, "Jardineiro para fim de semana", "Poda, limpeza dos canteiros e corte de grama da área externa.",
                BICO, 160, PeriodoPagamento.DIA, "2026-12-05", "2026-12-06", "Das 8h às 17h", "Capivari", 1, ABERTA, 1, 1, 9);
        addVaga(5, "Recepção no Festival de Inverno", "Reforço na recepção durante o festival de julho.",
                TEMP, 110, PeriodoPagamento.DIA, "2026-07-01", "2026-07-31", "Das 14h às 22h", "Capivari", 1, FECHADA, 1, 1, 2);

        // Chocolates da Maria
        addVaga(6, "Atendente de chocolateria", "Atendimento ao cliente, caixa e organização da loja.",
                FIXO, 1900, PeriodoPagamento.MES, null, null, "Terça a domingo, das 10h às 18h", "Capivari", 2, ABERTA, 2, 1, 1);
        addVaga(7, "Ajudante de produção de chocolate", "Apoio na produção e embalagem para as vendas de Natal e Ano Novo.",
                TEMP, 95, PeriodoPagamento.DIA, "2026-12-01", "2027-01-10", "Segunda a sábado, das 7h às 15h", "Vila Abernéssia", 2, ABERTA, 2, 1, 7);
        addVaga(8, "Vendedor de fim de ano", "Vendas na loja durante dezembro.",
                TEMP, 1700, PeriodoPagamento.MES, "2026-12-01", "2026-12-31", "Das 12h às 20h", "Capivari", 1, ABERTA, 2, 1, 1);
        addVaga(9, "Pintura da fachada da loja", "Pintura externa completa, material fornecido.",
                BICO, 1800, PeriodoPagamento.TOTAL, "2026-12-07", "2026-12-12", "Das 7h às 17h", "Capivari", 1, ABERTA, 2, 1, 4);

        // Sítio Bom Retiro
        addVaga(10, "Ajudante de colheita", "Colheita na lavoura do sítio. Transporte saindo do centro.",
                TEMP, 110, PeriodoPagamento.DIA, "2027-04-01", "2027-06-30", "Segunda a sexta, das 6h às 14h", "Zona rural", 4, ABERTA, 3, 3, 3);
        addVaga(11, "Caseiro de sítio", "Cuidar da casa, do pomar e dos animais. Moradia no local.",
                FIXO, 2200, PeriodoPagamento.MES, null, null, "Moradia no sítio, folga aos domingos", "Zona rural", 1, ABERTA, 3, 3, 3);
        addVaga(12, "Ordenha e trato de gado", "Ordenha da manhã e trato do gado na propriedade de Monteiro Lobato.",
                FIXO, 1800, PeriodoPagamento.MES, null, null, "Das 5h às 11h", "Zona rural", 1, ABERTA, 3, 4, 3);

        // Prado Festas e Eventos
        addVaga(13, "Garçom para casamento", "Serviço de mesa em casamento para 150 convidados. Usar roupa social preta.",
                BICO, 200, PeriodoPagamento.TOTAL, "2026-11-28", "2026-11-28", "Das 16h à meia-noite", "Centro", 4, ABERTA, 4, 2, 8);
        addVaga(14, "Montagem de festa", "Montagem de tenda, mesas e decoração para o casamento de sábado.",
                BICO, 150, PeriodoPagamento.TOTAL, "2026-11-27", "2026-11-27", "Das 8h às 17h", "Centro", 2, ABERTA, 4, 2, 8);
        addVaga(15, "Copeira para confraternização", "Festa de fim de ano de uma empresa em Campos do Jordão.",
                BICO, 180, PeriodoPagamento.TOTAL, "2026-12-12", "2026-12-12", "Das 18h às 23h", "Jardim do Embaixador", 2, ABERTA, 4, 1, 8);

        // Paulo Henrique Dias
        addVaga(16, "Pedreiro para muro", "Levantar e rebocar um muro de 12 metros. Material já comprado.",
                BICO, 250, PeriodoPagamento.DIA, "2026-11-23", "2026-11-27", "Das 7h às 17h", "Centro", 1, ABERTA, 5, 7, 4);
        addVaga(17, "Diarista quinzenal", "Limpeza completa de casa com 3 quartos, a cada 15 dias.",
                FIXO, 170, PeriodoPagamento.DIA, null, null, "A cada 15 dias, das 8h às 16h", "Centro", 1, ABERTA, 5, 7, 5);
        addVaga(18, "Roçada de terreno", "Roçar terreno de 500 m² em Tremembé.",
                BICO, 180, PeriodoPagamento.TOTAL, "2026-11-21", "2026-11-21", "A partir das 7h", "Centro", 1, ABERTA, 5, 8, 9);
        addVaga(19, "Cuidador de idoso noturno", "Acompanhar minha mãe de 84 anos durante a noite.",
                FIXO, 2400, PeriodoPagamento.MES, null, null, "Escala 12x36, das 19h às 7h", "Centro", 1, ABERTA, 5, 7, 6);
        addVaga(20, "Reforço escolar de matemática", "Aulas para meu neto do 7º ano.",
                FIXO, 40, PeriodoPagamento.HORA, null, null, "Terças e quintas, das 15h às 17h", "Centro", 1, ABERTA, 5, 7, 13);

        // mais vagas (empregadores 6 a 28)
        addVaga(21, "Cozinheiro de comida mineira", "Preparo de pratos do cardápio e organização da cozinha. Experiência em fogão a lenha é um diferencial.",
                FIXO, 2300, PeriodoPagamento.MES, null, null, "Terça a domingo, das 11h às 19h", "Capivari", 1, ABERTA, 6, 1, 7);
        addVaga(22, "Garçom para temporada de inverno", "Atendimento às mesas no período de maior movimento do ano. Gorjeta dividida entre a equipe.",
                TEMP, 150, PeriodoPagamento.DIA, "2027-06-15", "2027-07-31", "Das 18h à meia-noite", "Capivari", 4, ABERTA, 6, 1, 2);
        addVaga(23, "Ajudante de cozinha para férias de verão", "Pré-preparo, lavagem de louça e apoio ao cozinheiro durante as férias.",
                TEMP, 120, PeriodoPagamento.DIA, "2026-12-20", "2027-01-31", "Das 10h às 18h", "Capivari", 2, ABERTA, 6, 1, 7);
        addVaga(24, "Caixa de restaurante", "Fechamento de contas, cartão e PIX. Atenção e simpatia com o cliente.",
                FIXO, 1850, PeriodoPagamento.MES, null, null, "Escala 6x1, das 17h à 1h", "Capivari", 1, ABERTA, 6, 1, 1);
        addVaga(25, "Garçom extra para o Réveillon", "Reforço no jantar de Ano Novo do restaurante. Traje preto e branco.",
                BICO, 180, PeriodoPagamento.TOTAL, "2026-12-31", "2026-12-31", "Das 19h às 3h", "Capivari", 3, ABERTA, 6, 1, 8);
        addVaga(26, "Repositor de mercadorias", "Reposição de gôndolas, conferência de validade e organização do estoque.",
                FIXO, 1700, PeriodoPagamento.MES, null, null, "Escala 6x1, das 7h às 15h20", "Vila Abernéssia", 2, ABERTA, 7, 1, 1);
        addVaga(27, "Operador de caixa", "Atendimento no caixa, sangria e fechamento. Ensinamos a usar o sistema.",
                FIXO, 1800, PeriodoPagamento.MES, null, null, "Escala 6x1, das 13h às 21h20", "Vila Abernéssia", 2, ABERTA, 7, 1, 1);
        addVaga(28, "Entregador com moto própria", "Entregas de compras para clientes em Campos. Pagamos combustível à parte.",
                FIXO, 1900, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 9h às 17h", "Vila Abernéssia", 1, ABERTA, 7, 1, 10);
        addVaga(29, "Empacotador para o fim de ano", "Ajudar no caixa e no empacotamento durante o movimento de Natal e Ano Novo.",
                TEMP, 90, PeriodoPagamento.DIA, "2026-12-15", "2027-01-05", "Das 14h às 22h", "Vila Abernéssia", 3, ABERTA, 7, 1, 1);
        addVaga(30, "Açougueiro", "Cortes, atendimento no balcão do açougue e limpeza da área.",
                FIXO, 2000, PeriodoPagamento.MES, null, null, "Escala 6x1, das 6h às 14h20", "Vila Abernéssia", 1, ABERTA, 7, 1, 7);
        addVaga(31, "Camareira de hotel", "Arrumação de apartamentos e áreas comuns. Uniforme e refeição no local.",
                FIXO, 1950, PeriodoPagamento.MES, null, null, "Escala 6x1, das 7h às 15h", "Alto da Boa Vista", 3, ABERTA, 8, 1, 2);
        addVaga(32, "Recepcionista noturno", "Atendimento na recepção durante a noite, check-in tardio e rondas internas.",
                FIXO, 2200, PeriodoPagamento.MES, null, null, "Escala 12x36, noturno", "Alto da Boa Vista", 1, ABERTA, 8, 1, 2);
        addVaga(33, "Auxiliar de manutenção predial", "Pequenos reparos elétricos e hidráulicos, pintura e cuidado da área verde.",
                FIXO, 2100, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 7h às 16h", "Alto da Boa Vista", 1, ABERTA, 8, 1, 9);
        addVaga(34, "Copeira do café da manhã", "Montagem e reposição do buffet de café da manhã na alta temporada.",
                TEMP, 140, PeriodoPagamento.DIA, "2027-06-20", "2027-07-31", "Das 6h às 14h", "Alto da Boa Vista", 2, ABERTA, 8, 1, 2);
        addVaga(35, "Auxiliar de reservas", "Responder e-mails e WhatsApp de hóspedes, controlar reservas e pagamentos.",
                FIXO, 2400, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 9h às 18h", "Alto da Boa Vista", 1, ABERTA, 8, 1, 12);
        addVaga(36, "Pedreiro de obra", "Alvenaria, reboco e contrapiso em obras de casas na região.",
                FIXO, 2800, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 7h às 17h", "Centro", 2, ABERTA, 9, 2, 4);
        addVaga(37, "Servente de pedreiro", "Preparar massa, carregar material e manter a obra organizada.",
                FIXO, 1900, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 7h às 17h", "Centro", 3, ABERTA, 9, 2, 4);
        addVaga(38, "Eletricista para casa nova", "Instalação elétrica completa de casa de 90 m². Material por conta da obra.",
                BICO, 2500, PeriodoPagamento.TOTAL, "2026-12-01", "2026-12-15", "Das 7h às 17h", "Pico Agudo", 1, ABERTA, 9, 2, 4);
        addVaga(39, "Azulejista para reforma", "Assentamento de piso e azulejo em reforma de pousada em Tremembé.",
                TEMP, 180, PeriodoPagamento.DIA, "2027-01-10", "2027-03-10", "Das 7h às 16h", "Centro", 2, ABERTA, 9, 8, 4);
        addVaga(40, "Encanador para troca de tubulação", "Trocar a tubulação de água de uma cozinha e um banheiro.",
                BICO, 900, PeriodoPagamento.TOTAL, "2026-11-28", "2026-11-30", "Das 7h às 17h", "Centro", 1, ABERTA, 9, 2, 4);
        addVaga(41, "Camareira para chalés", "Limpeza e arrumação de chalés na temporada de verão.",
                TEMP, 130, PeriodoPagamento.DIA, "2026-12-18", "2027-02-28", "Das 8h às 16h", "Pico Agudo", 2, ABERTA, 10, 2, 2);
        addVaga(42, "Cozinheira de café colonial", "Preparar bolos, pães e quitutes do café colonial servido aos hóspedes.",
                FIXO, 2100, PeriodoPagamento.MES, null, null, "Quarta a domingo, das 6h às 14h", "Pico Agudo", 1, ABERTA, 10, 2, 7);
        addVaga(43, "Limpeza de trilha e jardim", "Roçar a trilha até o mirante e limpar os canteiros da entrada.",
                BICO, 350, PeriodoPagamento.TOTAL, "2026-12-05", "2026-12-06", "Das 8h às 17h", "Pico Agudo", 1, ABERTA, 10, 2, 9);
        addVaga(44, "Recepcionista de pousada", "Recepção de hóspedes, reservas por telefone e indicação de passeios.",
                FIXO, 1900, PeriodoPagamento.MES, null, null, "Escala 5x2, das 14h às 22h", "Pico Agudo", 1, ABERTA, 10, 2, 2);
        addVaga(45, "Colhedor de morango", "Colheita e seleção de morangos na estufa. Transporte saindo do centro.",
                TEMP, 120, PeriodoPagamento.DIA, "2027-05-01", "2027-09-30", "Segunda a sábado, das 6h às 14h", "Quilombo", 6, ABERTA, 11, 3, 3);
        addVaga(46, "Ordenhador", "Ordenha mecânica de 30 vacas e limpeza do curral.",
                FIXO, 2000, PeriodoPagamento.MES, null, null, "Das 4h30 às 10h30, folga quinzenal", "Quilombo", 1, ABERTA, 11, 3, 3);
        addVaga(47, "Auxiliar de queijaria", "Produção de queijo minas e frescal, embalagem e controle de temperatura.",
                FIXO, 1900, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 7h às 16h", "Quilombo", 1, ABERTA, 11, 3, 7);
        addVaga(48, "Ajudante para cercar pasto", "Fincar mourões e esticar arame em um pasto de 3 hectares.",
                BICO, 140, PeriodoPagamento.DIA, "2026-12-08", "2026-12-10", "Das 7h às 16h", "Quilombo", 3, ABERTA, 11, 3, 3);
        addVaga(49, "Motorista de caminhão leve", "Entregar leite e queijo em São Bento, Campos e Santo Antônio. CNH categoria C.",
                FIXO, 2600, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 5h às 13h", "Quilombo", 1, ABERTA, 11, 3, 10);
        addVaga(50, "Professor de violão", "Aulas em grupo para crianças e adolescentes. Material didático da escola.",
                FIXO, 60, PeriodoPagamento.HORA, null, null, "Terças e quintas à tarde", "Centro", 1, ABERTA, 12, 7, 13);
        addVaga(51, "Professor de reforço do ensino fundamental", "Reforço de português e matemática para alunos do 1º ao 9º ano.",
                FIXO, 45, PeriodoPagamento.HORA, null, null, "Segunda a sexta, das 14h às 18h", "Centro", 2, ABERTA, 12, 7, 13);
        addVaga(52, "Professor de informática básica para idosos", "Ensinar a usar celular, WhatsApp, internet e banco pelo aplicativo.",
                FIXO, 55, PeriodoPagamento.HORA, null, null, "Sábados de manhã", "Centro", 1, ABERTA, 12, 7, 13);
        addVaga(53, "Recepcionista de escola", "Atender pais e alunos, agendar aulas experimentais e receber mensalidades.",
                FIXO, 1700, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 13h às 19h", "Centro", 1, ABERTA, 12, 7, 12);
        addVaga(54, "Manicure e pedicure", "Atendimento no salão. Pagamos diária fixa mais comissão por serviço.",
                FIXO, 50, PeriodoPagamento.DIA, null, null, "Terça a sábado, das 9h às 19h", "Jaguaribe", 1, ABERTA, 13, 1, 11);
        addVaga(55, "Auxiliar de cabeleireiro", "Lavar cabelos, preparar produtos e ajudar nos atendimentos. Ensinamos a profissão.",
                FIXO, 1600, PeriodoPagamento.MES, null, null, "Terça a sábado, das 9h às 18h", "Jaguaribe", 1, ABERTA, 13, 1, 11);
        addVaga(56, "Maquiadora para formatura", "Maquiagem de formandas em um sábado de manhã.",
                BICO, 300, PeriodoPagamento.TOTAL, "2026-12-19", "2026-12-19", "Das 6h às 13h", "Jaguaribe", 2, ABERTA, 13, 1, 11);
        addVaga(57, "Cabeleireira para dezembro", "Reforço na equipe no mês mais movimentado do salão.",
                TEMP, 140, PeriodoPagamento.DIA, "2026-12-10", "2026-12-31", "Das 9h às 19h", "Jaguaribe", 1, ABERTA, 13, 1, 11);
        addVaga(58, "Atendente de bar para festival de cerveja", "Servir chope e organizar fichas em festival de cervejas artesanais.",
                BICO, 170, PeriodoPagamento.TOTAL, "2026-12-12", "2026-12-12", "Das 16h à meia-noite", "Capivari", 4, ABERTA, 14, 1, 8);
        addVaga(59, "Auxiliar de produção cervejeira", "Limpeza de tanques, envase e rotulagem. Ensinamos o processo.",
                FIXO, 2100, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 7h às 16h", "Vila Inglesa", 1, ABERTA, 14, 1, 7);
        addVaga(60, "Vendedor da loja da fábrica", "Vendas, degustação guiada e explicação dos estilos de cerveja para turistas.",
                FIXO, 1800, PeriodoPagamento.MES, null, null, "Quinta a domingo, das 12h às 20h", "Capivari", 1, ABERTA, 14, 1, 1);
        addVaga(61, "Montagem de estrutura para evento", "Montar tendas, mesas e palco para evento de fim de semana.",
                BICO, 220, PeriodoPagamento.TOTAL, "2027-01-16", "2027-01-17", "Das 8h às 18h", "Capivari", 3, ABERTA, 14, 1, 8);
        addVaga(62, "Cuidador de idosos", "Higiene, alimentação e acompanhamento dos residentes. Curso de cuidador é desejável.",
                FIXO, 2300, PeriodoPagamento.MES, null, null, "Escala 12x36, diurno", "Bosque", 3, ABERTA, 15, 6, 6);
        addVaga(63, "Cuidador de idosos noturno", "Acompanhar os residentes durante a noite e registrar intercorrências.",
                FIXO, 2500, PeriodoPagamento.MES, null, null, "Escala 12x36, noturno", "Bosque", 2, ABERTA, 15, 6, 6);
        addVaga(64, "Cozinheira de casa de repouso", "Preparar refeições seguindo as orientações da nutricionista.",
                FIXO, 1900, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 6h às 14h", "Bosque", 1, ABERTA, 15, 6, 7);
        addVaga(65, "Auxiliar de limpeza", "Limpeza dos quartos, banheiros e áreas comuns.",
                FIXO, 1650, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 7h às 16h", "Bosque", 1, ABERTA, 15, 6, 5);
        addVaga(66, "Oficina de música para idosos", "Uma tarde de cantoria e violão com os residentes.",
                BICO, 120, PeriodoPagamento.TOTAL, "2026-12-03", "2026-12-03", "Das 14h às 16h", "Bosque", 1, ABERTA, 15, 6, 13);
        addVaga(67, "Motorista entregador", "Entregas no Vale do Paraíba com veículo da empresa. CNH categoria B.",
                FIXO, 2900, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 6h às 15h", "Independência", 2, ABERTA, 16, 7, 10);
        addVaga(68, "Ajudante de entregas", "Carregar e descarregar mercadorias e acompanhar o motorista.",
                FIXO, 1800, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 6h às 15h", "Independência", 3, ABERTA, 16, 7, 10);
        addVaga(69, "Conferente para a Black Friday e o Natal", "Separar e conferir pedidos no pico de vendas do fim de ano.",
                TEMP, 130, PeriodoPagamento.DIA, "2026-11-25", "2026-12-24", "Das 7h às 17h", "Independência", 4, ABERTA, 16, 7, 10);
        addVaga(70, "Auxiliar administrativo de logística", "Emitir notas, controlar rotas e atender clientes por telefone.",
                FIXO, 2200, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 8h às 17h", "Independência", 1, ABERTA, 16, 7, 12);
        addVaga(71, "Ajudante de mudança", "Carregar e descarregar uma mudança residencial em Pindamonhangaba.",
                BICO, 250, PeriodoPagamento.TOTAL, "2026-12-14", "2026-12-14", "Das 8h às 14h", "Moreira César", 2, ABERTA, 16, 6, 10);
        addVaga(72, "Auxiliar contábil", "Lançamentos, conciliação bancária e organização de documentos dos clientes.",
                FIXO, 2000, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 8h às 17h", "Centro", 1, ABERTA, 17, 7, 12);
        addVaga(73, "Estagiário de administração", "Apoio ao escritório. Para estudantes de administração ou contabilidade.",
                FIXO, 1000, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 8h às 14h", "Centro", 1, ABERTA, 17, 7, 12);
        addVaga(74, "Assistente para imposto de renda", "Separar documentos e preencher declarações durante a temporada do IR.",
                TEMP, 1800, PeriodoPagamento.MES, "2027-03-01", "2027-05-31", "Segunda a sexta, das 8h às 17h", "Centro", 2, ABERTA, 17, 7, 12);
        addVaga(75, "Digitação de documentos antigos", "Digitar e organizar fichas de clientes em planilha.",
                BICO, 400, PeriodoPagamento.TOTAL, "2026-12-07", "2026-12-11", "Das 9h às 13h", "Centro", 1, ABERTA, 17, 7, 12);
        addVaga(76, "Diarista duas vezes por semana", "Limpeza da casa, roupas e organização da cozinha.",
                FIXO, 160, PeriodoPagamento.DIA, null, null, "Terças e sextas, das 8h às 16h", "Padre Eterno", 1, ABERTA, 18, 8, 5);
        addVaga(77, "Acompanhante para meu marido", "Acompanhar meu marido de 79 anos em consultas, caminhadas e na hora dos remédios.",
                FIXO, 1800, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 8h às 14h", "Padre Eterno", 1, ABERTA, 18, 8, 6);
        addVaga(78, "Poda das árvores do quintal", "Podar duas mangueiras e um pé de abacate, e recolher os galhos.",
                BICO, 180, PeriodoPagamento.TOTAL, "2026-11-30", "2026-11-30", "Das 8h às 16h", "Padre Eterno", 1, ABERTA, 18, 8, 9);
        addVaga(79, "Faxina pesada de fim de ano", "Faxina completa antes de receber a família no Natal.",
                BICO, 200, PeriodoPagamento.TOTAL, "2026-12-22", "2026-12-22", "Das 8h às 17h", "Padre Eterno", 1, ABERTA, 18, 8, 5);
        addVaga(80, "Padeiro", "Produção de pão francês, de forma e doces. Experiência com forno de lastro.",
                FIXO, 2300, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 3h às 11h", "Centro", 1, ABERTA, 19, 6, 7);
        addVaga(81, "Atendente de padaria", "Atendimento no balcão, frios e café.",
                FIXO, 1750, PeriodoPagamento.MES, null, null, "Escala 6x1, das 6h às 14h20", "Centro", 2, ABERTA, 19, 6, 1);
        addVaga(82, "Confeiteira para encomendas de Natal", "Produção de panetones, bolos e tortas para as encomendas de fim de ano.",
                TEMP, 110, PeriodoPagamento.DIA, "2026-12-10", "2027-01-02", "Das 6h às 14h", "Centro", 2, ABERTA, 19, 6, 7);
        addVaga(83, "Salgadeira", "Produção de salgados fritos e assados para a vitrine e encomendas.",
                FIXO, 1800, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 5h às 13h", "Centro", 1, ABERTA, 19, 6, 7);
        addVaga(84, "Entregador de pães por bicicleta", "Entregar pães e leite para clientes do centro logo cedo.",
                FIXO, 1500, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 6h às 11h", "Centro", 1, ABERTA, 19, 6, 10);
        addVaga(85, "Trabalhador de horta orgânica", "Plantio, capina e colheita de hortaliças sem agrotóxico.",
                FIXO, 1900, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 7h às 16h", "Zona rural", 2, ABERTA, 20, 5, 3);
        addVaga(86, "Ajudante de plantio", "Preparar canteiros e plantar mudas na temporada de plantio.",
                TEMP, 100, PeriodoPagamento.DIA, "2027-02-01", "2027-04-30", "Das 7h às 15h", "Zona rural", 3, ABERTA, 20, 5, 3);
        addVaga(87, "Montador de cestas orgânicas", "Lavar, separar e montar as cestas que vão para os clientes.",
                FIXO, 1600, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 7h às 13h", "Zona rural", 1, ABERTA, 20, 5, 1);
        addVaga(88, "Vendedor na feira de Campos", "Vender nossos produtos na feira de sábado em Campos do Jordão.",
                BICO, 150, PeriodoPagamento.DIA, "2026-12-05", "2026-12-20", "Sábados, das 7h às 13h", "Vila Abernéssia", 1, ABERTA, 20, 1, 1);
        addVaga(89, "Guia de trilha", "Conduzir grupos na trilha da Pedra do Baú. Conhecer a região é essencial.",
                TEMP, 200, PeriodoPagamento.DIA, "2026-12-15", "2027-02-28", "Das 7h às 16h", "Centro", 2, ABERTA, 21, 3, 2);
        addVaga(90, "Motorista de jipe para passeios", "Dirigir o jipe nos passeios pela serra. CNH B há pelo menos 3 anos.",
                FIXO, 2500, PeriodoPagamento.MES, null, null, "Quinta a domingo, das 8h às 17h", "Centro", 1, ABERTA, 21, 3, 10);
        addVaga(91, "Atendente de agência de turismo", "Vender passeios no balcão e pelo WhatsApp, e organizar a agenda dos guias.",
                FIXO, 1700, PeriodoPagamento.MES, null, null, "Quarta a domingo, das 9h às 17h", "Centro", 1, ABERTA, 21, 3, 12);
        addVaga(92, "Apoio em passeio de grupo", "Ajudar o guia com um grupo de 20 turistas em um sábado.",
                BICO, 180, PeriodoPagamento.TOTAL, "2027-01-23", "2027-01-23", "Das 6h às 15h", "Serrano", 2, ABERTA, 21, 3, 2);
        addVaga(93, "Balconista de mercadinho", "Atender no balcão e no caixa, repor prateleiras.",
                FIXO, 1600, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 7h às 15h", "Centro", 1, ABERTA, 22, 4, 1);
        addVaga(94, "Entregas de bicicleta no sábado", "Levar as compras dos clientes que moram perto do centro.",
                BICO, 120, PeriodoPagamento.DIA, "2026-12-01", "2026-12-24", "Sábados, das 8h às 12h", "Centro", 1, ABERTA, 22, 4, 10);
        addVaga(95, "Roçada do terreno dos fundos", "Roçar e limpar um terreno de 800 m² atrás do mercado.",
                BICO, 250, PeriodoPagamento.TOTAL, "2026-11-29", "2026-11-29", "Das 7h às 16h", "Zona rural", 1, ABERTA, 22, 4, 9);
        addVaga(96, "Ajudante de marcenaria", "Lixar, montar e envernizar móveis rústicos. Ensinamos o ofício.",
                FIXO, 2200, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 7h às 17h", "Vila Maria", 1, ABERTA, 23, 8, 14);
        addVaga(97, "Instalação de deck de madeira", "Ajudar na instalação de um deck de 20 m² em uma casa.",
                BICO, 600, PeriodoPagamento.TOTAL, "2026-12-02", "2026-12-04", "Das 8h às 17h", "Centro", 1, ABERTA, 23, 8, 4);
        addVaga(98, "Pintor de móveis", "Pintura e acabamento de móveis para as encomendas de verão.",
                TEMP, 1800, PeriodoPagamento.MES, "2026-12-01", "2027-02-28", "Segunda a sexta, das 8h às 17h", "Vila Maria", 1, ABERTA, 23, 8, 14);
        addVaga(99, "Banhista e tosador", "Banho e tosa em cães e gatos. Experiência é um diferencial.",
                FIXO, 1800, PeriodoPagamento.MES, null, null, "Terça a sábado, das 9h às 18h", "Jardim das Nações", 1, ABERTA, 24, 7, 14);
        addVaga(100, "Atendente de pet shop", "Vendas, agendamentos de banho e organização da loja.",
                FIXO, 1700, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 9h às 18h", "Jardim das Nações", 1, ABERTA, 24, 7, 1);
        addVaga(101, "Cuidador do hotelzinho de cães", "Alimentar, passear e cuidar dos cães hospedados nas férias.",
                TEMP, 80, PeriodoPagamento.DIA, "2026-12-20", "2027-01-10", "Das 8h às 12h e das 16h às 19h", "Jardim das Nações", 1, ABERTA, 24, 7, 14);
        addVaga(102, "Passeador de cães", "Passear com cães de clientes no bairro, de segunda a sexta.",
                BICO, 40, PeriodoPagamento.HORA, "2026-12-01", "2026-12-31", "Fins de tarde", "Jardim das Nações", 2, ABERTA, 24, 7, 14);
        addVaga(103, "Caseiro de chácara", "Cuidar da casa, do gramado, das galinhas e receber a família nos fins de semana.",
                FIXO, 1800, PeriodoPagamento.MES, null, null, "Moradia na chácara, folga aos domingos", "Zona rural", 1, ABERTA, 25, 2, 3);
        addVaga(104, "Faxina antes das férias", "Faxina completa da casa da chácara antes da chegada da família.",
                BICO, 180, PeriodoPagamento.TOTAL, "2026-12-18", "2026-12-18", "Das 8h às 16h", "Zona rural", 1, ABERTA, 25, 2, 5);
        addVaga(105, "Limpeza da piscina e do pomar", "Limpar a piscina, podar as frutíferas e roçar em volta do lago.",
                BICO, 400, PeriodoPagamento.TOTAL, "2026-12-12", "2026-12-13", "Das 7h às 17h", "Zona rural", 2, ABERTA, 25, 2, 9);
        addVaga(106, "Babá para as férias", "Cuidar de duas crianças (5 e 8 anos) durante as férias na chácara.",
                TEMP, 150, PeriodoPagamento.DIA, "2026-12-26", "2027-01-15", "Das 8h às 18h", "Zona rural", 1, ABERTA, 25, 2, 6);
        addVaga(107, "Equipe da Festa do Pinhão", "Atendimento nas barracas, organização de filas e limpeza durante a festa.",
                TEMP, 130, PeriodoPagamento.DIA, "2027-06-01", "2027-06-30", "Das 16h às 23h", "Vila Abernéssia", 10, ABERTA, 26, 1, 8);
        addVaga(108, "Montagem das barracas da festa", "Montar as barracas, a iluminação e o palco antes da abertura.",
                BICO, 200, PeriodoPagamento.TOTAL, "2027-05-28", "2027-05-30", "Das 7h às 18h", "Vila Abernéssia", 6, ABERTA, 26, 1, 8);
        addVaga(109, "Apoio na cantata de Natal", "Organizar cadeiras, distribuir programas e orientar o público na praça.",
                BICO, 150, PeriodoPagamento.TOTAL, "2026-12-20", "2026-12-20", "Das 15h às 23h", "Vila Abernéssia", 4, ABERTA, 26, 1, 8);
        addVaga(110, "Auxiliar de produção cultural", "Controle de expositores, planilhas e contato com fornecedores da festa.",
                TEMP, 1600, PeriodoPagamento.MES, "2027-04-01", "2027-06-30", "Segunda a sexta, das 13h às 18h", "Vila Abernéssia", 1, ABERTA, 26, 1, 12);
        addVaga(111, "Mecânico de automóveis", "Manutenção de suspensão, freios e motor. Experiência comprovada.",
                FIXO, 2400, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 8h às 18h", "Araretama", 1, ABERTA, 27, 6, 14);
        addVaga(112, "Borracheiro", "Conserto e troca de pneus, balanceamento e atendimento no balcão.",
                FIXO, 1700, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 8h às 17h", "Araretama", 1, ABERTA, 27, 6, 14);
        addVaga(113, "Aprendiz de mecânico", "Para quem quer aprender a profissão. Jovem de 16 a 22 anos.",
                FIXO, 1300, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 8h às 14h", "Araretama", 1, ABERTA, 27, 6, 14);
        addVaga(114, "Jardineiro paisagista", "Manutenção de jardins de casas e pousadas atendidas pela floricultura.",
                FIXO, 2000, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 7h às 16h", "Jaguaribe", 2, ABERTA, 28, 1, 9);
        addVaga(115, "Atendente de floricultura", "Montar arranjos simples, atender clientes e cuidar das plantas da loja.",
                FIXO, 1700, PeriodoPagamento.MES, null, null, "Terça a domingo, das 9h às 18h", "Capivari", 1, ABERTA, 28, 1, 1);
        addVaga(116, "Plantio de jardim de pousada", "Preparar a terra e plantar o jardim novo de uma pousada.",
                BICO, 160, PeriodoPagamento.DIA, "2026-12-07", "2026-12-11", "Das 7h às 16h", "Descansópolis", 2, ABERTA, 28, 1, 9);
        addVaga(117, "Decoração floral de casamento", "Ajudar a montar a decoração de flores de um casamento ao ar livre.",
                BICO, 180, PeriodoPagamento.TOTAL, "2027-01-30", "2027-01-30", "Das 8h às 16h", "Capivari", 2, ABERTA, 28, 1, 8);
        addVaga(118, "Cozinheira em casa de família", "Fazer almoço e jantar para um casal de idosos.",
                FIXO, 1700, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 8h às 16h", "Quiririm", 1, ABERTA, 5, 7, 5);
        addVaga(119, "Ajudante de colheita de milho", "Colheita manual de milho na propriedade de Monteiro Lobato.",
                TEMP, 110, PeriodoPagamento.DIA, "2027-03-01", "2027-04-15", "Das 6h às 14h", "Zona rural", 2, ABERTA, 3, 4, 3);
        addVaga(120, "Copeiro para festa de 15 anos", "Servir bebidas e repor o buffet em uma festa para 120 convidados.",
                BICO, 220, PeriodoPagamento.TOTAL, "2026-12-12", "2026-12-12", "Das 15h às 23h", "Centro", 3, ABERTA, 4, 2, 8);
        addVaga(121, "Vendedor para temporada de inverno", "Vendas na loja de chocolates durante julho, o mês mais movimentado.",
                TEMP, 1800, PeriodoPagamento.MES, "2027-06-01", "2027-07-31", "Das 12h às 20h", "Capivari", 2, ABERTA, 2, 1, 1);
        addVaga(122, "Limpeza de calhas e telhado", "Limpar as calhas e trocar algumas telhas quebradas da pousada.",
                BICO, 250, PeriodoPagamento.TOTAL, "2026-11-21", "2026-11-22", "Das 8h às 17h", "Capivari", 1, ABERTA, 1, 1, 9);
        addVaga(123, "Professor de inglês para adultos", "Turma de inglês para iniciantes na unidade de Pindamonhangaba.",
                FIXO, 50, PeriodoPagamento.HORA, null, null, "Segundas e quartas, das 18h às 20h", "Centro", 1, ABERTA, 12, 6, 13);
        addVaga(124, "Auxiliar de compras e estoque", "Fazer pedidos aos fornecedores e controlar o estoque no sistema.",
                FIXO, 2100, PeriodoPagamento.MES, null, null, "Segunda a sexta, das 8h às 17h", "Vila Abernéssia", 1, ABERTA, 7, 1, 12);
        addVaga(125, "Ajudante de padeiro em Tremembé", "Ajudar na produção da nossa nova unidade em Tremembé.",
                FIXO, 1800, PeriodoPagamento.MES, null, null, "Segunda a sábado, das 5h às 13h", "Centro", 1, ABERTA, 19, 8, 7);
        addVaga(126, "Frete de carga para Sapucaí-Mirim", "Levar carga de material de construção até Sapucaí-Mirim e ajudar a descarregar.",
                BICO, 300, PeriodoPagamento.TOTAL, "2026-12-09", "2026-12-09", "Das 6h às 16h", "Centro", 1, ABERTA, 16, 5, 10);
        addVaga(127, "Garçom para festa de Halloween", "Reforço na festa temática do restaurante.",
                BICO, 170, PeriodoPagamento.TOTAL, "2026-10-31", "2026-10-31", "Das 18h às 2h", "Capivari", 2, FECHADA, 6, 1, 8);
        addVaga(128, "Colhedor de morango (safra 2026)", "Colheita da safra de inverno.",
                TEMP, 115, PeriodoPagamento.DIA, "2026-08-01", "2026-10-15", "Das 6h às 14h", "Quilombo", 4, FECHADA, 11, 3, 3);
        addVaga(129, "Equipe da Festa do Pinhão 2026", "Atendimento nas barracas da festa de 2026.",
                TEMP, 120, PeriodoPagamento.DIA, "2026-06-01", "2026-06-30", "Das 16h às 23h", "Vila Abernéssia", 8, FECHADA, 26, 1, 8);
        addVaga(130, "Penteado para casamento", "Penteado da noiva e das madrinhas.",
                BICO, 250, PeriodoPagamento.TOTAL, "2026-11-07", "2026-11-07", "Das 6h às 12h", "Jaguaribe", 1, FECHADA, 13, 1, 11);
    }

    private void addCandidatura(int id, int idTrabalhador, int idVaga, StatusCandidatura status, String mensagem,
                                String data, String dataResposta) {
        Candidatura c = new Candidatura(id, trabalhador(idTrabalhador), vaga(idVaga));
        c.setStatus(status);
        c.setMensagem(mensagem);
        c.setDataCandidatura(LocalDate.parse(data));
        c.setDataResposta(dataResposta == null ? null : LocalDate.parse(dataResposta));
        candidaturas.add(c);
    }

    private void carregarCandidaturas() {
        StatusCandidatura ENVIADA = StatusCandidatura.ENVIADA, ACEITA = StatusCandidatura.ACEITA;
        addCandidatura(1, 1, 1, ENVIADA, null, "2026-11-10", null);
        addCandidatura(2, 1, 6, ACEITA, "Pode vir conversar na loja segunda às 10h.", "2026-11-11", "2026-11-14");
        addCandidatura(3, 1, 5, ACEITA, "Bem-vinda à equipe do festival!", "2026-06-20", "2026-06-25");
        addCandidatura(4, 3, 13, ACEITA, "Chegar às 15h30 com roupa social preta.", "2026-11-12", "2026-11-16");
        addCandidatura(5, 3, 15, ENVIADA, null, "2026-11-15", null);
        addCandidatura(6, 3, 3, ENVIADA, null, "2026-11-16", null);
        addCandidatura(7, 2, 4, ENVIADA, null, "2026-11-13", null);
        addCandidatura(8, 2, 14, ACEITA, "Te espero às 8h no salão.", "2026-11-12", "2026-11-15");
        addCandidatura(9, 4, 16, ACEITA, "Fechado. Começamos segunda às 7h.", "2026-11-12", "2026-11-15");
        addCandidatura(10, 4, 9, ENVIADA, null, "2026-11-16", null);
        addCandidatura(11, 5, 19, StatusCandidatura.RECUSADA,
                "Preciso de alguém com experiência em cuidado noturno. Obrigado!", "2026-11-10", "2026-11-13");
        addCandidatura(12, 5, 20, ENVIADA, null, "2026-11-14", null);
        addCandidatura(13, 6, 10, ENVIADA, null, "2026-11-11", null);
        addCandidatura(14, 6, 12, StatusCandidatura.CANCELADA, null, "2026-11-09", "2026-11-12");
        addCandidatura(15, 6, 11, ENVIADA, null, "2026-11-12", null);
    }
}
