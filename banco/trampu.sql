-- =====================================================================
-- TRAMPU - Trabalho local para cidades pequenas
-- Global Solution 2026/2 - CitizenTech - FIAP
--
-- Banco da entrega: SQLite 3
--   Como rodar:  sqlite3 trampu.db < banco/trampu.sql
--
-- Para rodar no Oracle (SQL Developer / Live SQL), execute ANTES:
--   ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';
--
-- Senhas: nunca em texto. Guardamos PBKDF2-HMAC-SHA256 com salt
-- aleatorio e 600.000 iteracoes, no formato:
--   pbkdf2_sha256$<iteracoes>$<salt base64>$<hash base64>
-- Senha de teste de TODOS os usuarios abaixo: Trampu@123
-- =====================================================================


-- =====================================================================
-- 1. CRIACAO DAS TABELAS
-- =====================================================================

CREATE TABLE CIDADE (
    id_cidade   INTEGER       NOT NULL,
    nome        VARCHAR(80)   NOT NULL,
    uf          CHAR(2)       NOT NULL,
    CONSTRAINT pk_cidade PRIMARY KEY (id_cidade),
    CONSTRAINT uq_cidade_nome_uf UNIQUE (nome, uf)
);

CREATE TABLE CATEGORIA (
    id_categoria  INTEGER       NOT NULL,
    nome          VARCHAR(50)   NOT NULL,
    descricao     VARCHAR(255),
    CONSTRAINT pk_categoria PRIMARY KEY (id_categoria),
    CONSTRAINT uq_categoria_nome UNIQUE (nome)
);

CREATE TABLE TRABALHADOR (
    id_trabalhador   INTEGER        NOT NULL,
    nome             VARCHAR(100)   NOT NULL,
    username         VARCHAR(30)    NOT NULL,
    cpf              CHAR(11)       NOT NULL,
    email            VARCHAR(100)   NOT NULL,
    telefone         VARCHAR(15)    NOT NULL,
    senha_hash       VARCHAR(255)   NOT NULL,
    descricao        VARCHAR(500),
    habilidades      VARCHAR(255),
    disponibilidade  VARCHAR(20),
    id_cidade        INTEGER        NOT NULL,  -- cidade onde mora
    data_cadastro    DATE           DEFAULT CURRENT_DATE,
    CONSTRAINT pk_trabalhador PRIMARY KEY (id_trabalhador),
    CONSTRAINT uq_trab_username UNIQUE (username),
    CONSTRAINT uq_trab_cpf UNIQUE (cpf),
    CONSTRAINT uq_trab_email UNIQUE (email),
    CONSTRAINT ck_trab_username CHECK (LENGTH(username) BETWEEN 3 AND 30),
    CONSTRAINT ck_trab_disponib CHECK (disponibilidade IN ('INTEGRAL', 'MEIO_PERIODO', 'FINS_DE_SEMANA', 'BICOS')),
    CONSTRAINT fk_trab_cidade FOREIGN KEY (id_cidade) REFERENCES CIDADE (id_cidade)
);

CREATE TABLE EMPREGADOR (
    id_empregador  INTEGER        NOT NULL,
    nome           VARCHAR(100)   NOT NULL,  -- nome da pessoa
    username       VARCHAR(30)    NOT NULL,
    documento      VARCHAR(14)    NOT NULL,  -- CPF ou CNPJ
    email          VARCHAR(100)   NOT NULL,
    telefone       VARCHAR(15)    NOT NULL,
    senha_hash     VARCHAR(255)   NOT NULL,
    descricao      VARCHAR(500),
    nome_negocio   VARCHAR(100),
    id_cidade      INTEGER        NOT NULL,
    data_cadastro  DATE           DEFAULT CURRENT_DATE,
    CONSTRAINT pk_empregador PRIMARY KEY (id_empregador),
    CONSTRAINT uq_emp_username UNIQUE (username),
    CONSTRAINT uq_emp_documento UNIQUE (documento),
    CONSTRAINT uq_emp_email UNIQUE (email),
    CONSTRAINT ck_emp_username CHECK (LENGTH(username) BETWEEN 3 AND 30),
    CONSTRAINT ck_emp_documento CHECK (LENGTH(documento) IN (11, 14)),
    CONSTRAINT fk_emp_cidade FOREIGN KEY (id_cidade) REFERENCES CIDADE (id_cidade)
);

-- Cidades em que o trabalhador aceita trabalhar (N:N)
CREATE TABLE TRABALHADOR_CIDADE (
    id_trabalhador  INTEGER  NOT NULL,
    id_cidade       INTEGER  NOT NULL,
    CONSTRAINT pk_trab_cidade PRIMARY KEY (id_trabalhador, id_cidade),
    CONSTRAINT fk_tc_trabalhador FOREIGN KEY (id_trabalhador) REFERENCES TRABALHADOR (id_trabalhador),
    CONSTRAINT fk_tc_cidade FOREIGN KEY (id_cidade) REFERENCES CIDADE (id_cidade)
);

CREATE TABLE VAGA (
    id_vaga            INTEGER        NOT NULL,
    titulo             VARCHAR(100)   NOT NULL,
    descricao          VARCHAR(500)   NOT NULL,
    tipo_vaga          VARCHAR(12)    NOT NULL,
    valor              DECIMAL(10,2)  NOT NULL,
    periodo_pagamento  VARCHAR(10)    NOT NULL,
    data_inicio        DATE,
    data_fim           DATE,
    horario            VARCHAR(100),
    bairro             VARCHAR(80),
    quantidade         INTEGER        DEFAULT 1 NOT NULL,
    status_vaga        VARCHAR(10)    DEFAULT 'ABERTA' NOT NULL,
    id_empregador      INTEGER        NOT NULL,
    id_cidade          INTEGER        NOT NULL,
    id_categoria       INTEGER        NOT NULL,
    data_publicacao    DATE           DEFAULT CURRENT_DATE,
    CONSTRAINT pk_vaga PRIMARY KEY (id_vaga),
    CONSTRAINT ck_vaga_tipo CHECK (tipo_vaga IN ('FIXO', 'TEMPORARIO', 'BICO')),
    CONSTRAINT ck_vaga_valor CHECK (valor > 0),
    CONSTRAINT ck_vaga_periodo CHECK (periodo_pagamento IN ('HORA', 'DIA', 'SEMANA', 'MES', 'TOTAL')),
    CONSTRAINT ck_vaga_quantidade CHECK (quantidade > 0),
    CONSTRAINT ck_vaga_status CHECK (status_vaga IN ('ABERTA', 'FECHADA')),
    -- FIXO nao tem datas; TEMPORARIO e BICO exigem inicio e fim
    CONSTRAINT ck_vaga_datas_por_tipo CHECK (
        (tipo_vaga = 'FIXO' AND data_inicio IS NULL AND data_fim IS NULL)
        OR
        (tipo_vaga <> 'FIXO' AND data_inicio IS NOT NULL AND data_fim IS NOT NULL AND data_fim >= data_inicio)
    ),
    CONSTRAINT fk_vaga_empregador FOREIGN KEY (id_empregador) REFERENCES EMPREGADOR (id_empregador),
    CONSTRAINT fk_vaga_cidade FOREIGN KEY (id_cidade) REFERENCES CIDADE (id_cidade),
    CONSTRAINT fk_vaga_categoria FOREIGN KEY (id_categoria) REFERENCES CATEGORIA (id_categoria)
);

-- ENVIADA   -> trabalhador se candidatou, aguardando o empregador
-- ACEITA    -> empregador aceitou (telefones liberados entre os dois)
-- RECUSADA  -> empregador descartou
-- CANCELADA -> o proprio trabalhador desistiu
CREATE TABLE CANDIDATURA (
    id_candidatura      INTEGER        NOT NULL,
    id_trabalhador      INTEGER        NOT NULL,
    id_vaga             INTEGER        NOT NULL,
    status_candidatura  VARCHAR(10)    DEFAULT 'ENVIADA' NOT NULL,
    mensagem            VARCHAR(255),  -- recado do empregador ao aceitar/recusar
    data_candidatura    DATE           DEFAULT CURRENT_DATE NOT NULL,
    data_resposta       DATE,
    CONSTRAINT pk_candidatura PRIMARY KEY (id_candidatura),
    CONSTRAINT uq_cand_trab_vaga UNIQUE (id_trabalhador, id_vaga),
    CONSTRAINT ck_cand_status CHECK (status_candidatura IN ('ENVIADA', 'ACEITA', 'RECUSADA', 'CANCELADA')),
    -- pendente nao tem resposta; qualquer outro status precisa da data
    CONSTRAINT ck_cand_resposta CHECK (
        (status_candidatura = 'ENVIADA' AND data_resposta IS NULL)
        OR
        (status_candidatura <> 'ENVIADA' AND data_resposta IS NOT NULL AND data_resposta >= data_candidatura)
    ),
    CONSTRAINT fk_cand_trabalhador FOREIGN KEY (id_trabalhador) REFERENCES TRABALHADOR (id_trabalhador),
    CONSTRAINT fk_cand_vaga FOREIGN KEY (id_vaga) REFERENCES VAGA (id_vaga)
);


-- =====================================================================
-- 2. DADOS DE EXEMPLO
-- =====================================================================

-- ---------- Cidades (Serra da Mantiqueira e Vale do Paraiba) ----------
INSERT INTO CIDADE (id_cidade, nome, uf) VALUES (1, 'Campos do Jordão', 'SP');
INSERT INTO CIDADE (id_cidade, nome, uf) VALUES (2, 'Santo Antônio do Pinhal', 'SP');
INSERT INTO CIDADE (id_cidade, nome, uf) VALUES (3, 'São Bento do Sapucaí', 'SP');
INSERT INTO CIDADE (id_cidade, nome, uf) VALUES (4, 'Monteiro Lobato', 'SP');
INSERT INTO CIDADE (id_cidade, nome, uf) VALUES (5, 'Sapucaí-Mirim', 'MG');
INSERT INTO CIDADE (id_cidade, nome, uf) VALUES (6, 'Pindamonhangaba', 'SP');
INSERT INTO CIDADE (id_cidade, nome, uf) VALUES (7, 'Taubaté', 'SP');
INSERT INTO CIDADE (id_cidade, nome, uf) VALUES (8, 'Tremembé', 'SP');

-- ---------- Categorias ----------
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (1, 'Comércio e atendimento', 'Atendente, balconista, caixa, repositor, vendedor');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (2, 'Turismo e hotelaria', 'Camareira, recepção de pousada, guia, monitor de passeio');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (3, 'Rural e agro', 'Colheita, ordenha, trato de animais, caseiro de sítio');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (4, 'Construção e reforma', 'Pedreiro, ajudante, pintor, eletricista, encanador');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (5, 'Serviços domésticos', 'Diarista, faxina, passadeira, cozinheira em casa de família');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (6, 'Cuidados', 'Babá, cuidador de idoso, acompanhante');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (7, 'Alimentação', 'Ajudante de cozinha, padeiro, salgadeira, chapeiro');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (8, 'Eventos e festas', 'Garçom, copeiro, montagem de festa, quermesse, rodeio');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (9, 'Jardinagem e manutenção', 'Roçada de terreno, jardineiro, limpeza de piscina, pequenos reparos');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (10, 'Transporte e entregas', 'Motoboy, entregador, motorista, mudança, carga e descarga');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (11, 'Beleza e estética', 'Cabeleireiro, manicure, auxiliar de salão');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (12, 'Escritório e administrativo', 'Recepcionista, auxiliar administrativo, digitação');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (13, 'Aulas e reforço', 'Reforço escolar, aula de música, informática básica');
INSERT INTO CATEGORIA (id_categoria, nome, descricao) VALUES (14, 'Outros', 'Trabalhos que não se encaixam nas demais categorias');

-- ---------- Trabalhadores (senha: Trampu@123) ----------
INSERT INTO TRABALHADOR (id_trabalhador, nome, username, cpf, email, telefone, senha_hash, descricao, habilidades, disponibilidade, id_cidade)
VALUES (1, 'Ana Paula Souza', 'anapaula', '11122233344', 'ana.souza@email.com', '12991110001',
        'pbkdf2_sha256$600000$pceH99E3TllaxdEKkva+Dw==$9SAP46l8WM+0lRDXFUD9k8iVsBLJvwLYbkeJuzx6VbU=',
        'Trabalho há 6 anos em pousadas de Campos. Sou caprichosa e pontual.',
        'limpeza, arrumação de quartos, atendimento', 'INTEGRAL', 1);

INSERT INTO TRABALHADOR (id_trabalhador, nome, username, cpf, email, telefone, senha_hash, descricao, habilidades, disponibilidade, id_cidade)
VALUES (2, 'Carlos Eduardo Lima', 'carlinhos.lima', '22233344455', 'carlos.lima@email.com', '12991110002',
        'pbkdf2_sha256$600000$IkNo22tD6HDyMlOOpNmiYQ==$/A4sdzzRRe3Z5nYjLs+xtUDgvtTYIZC8n5nT6eG7LqY=',
        'Faço jardinagem e roçada. Tenho roçadeira própria.',
        'jardinagem, roçada, pequenos reparos', 'BICOS', 2);

INSERT INTO TRABALHADOR (id_trabalhador, nome, username, cpf, email, telefone, senha_hash, descricao, habilidades, disponibilidade, id_cidade)
VALUES (3, 'Juliana Ribeiro', 'ju.ribeiro', '33344455566', 'juliana.ribeiro@email.com', '12991110003',
        'pbkdf2_sha256$600000$VAoxIz2WfzvqQp1Pa+W+GA==$UCM+EcuMGrr5oNr1xdoXqlmQRTialKIo22aaVyLEqvU=',
        'Estudante, trabalho como garçonete em eventos nos fins de semana.',
        'garçonete, caixa, inglês básico', 'FINS_DE_SEMANA', 1);

INSERT INTO TRABALHADOR (id_trabalhador, nome, username, cpf, email, telefone, senha_hash, descricao, habilidades, disponibilidade, id_cidade)
VALUES (4, 'Marcos Antônio Pereira', 'marcos.pedreiro', '44455566677', 'marcos.pereira@email.com', '12991110004',
        'pbkdf2_sha256$600000$gypdT/bH6TlynPG/a6UJfA==$MxSK/ywS5qW7teeasADWlyy2GjuRczmcdrIctgIN390=',
        'Pedreiro há 15 anos. Faço reboco, muro, piso e pintura.',
        'pedreiro, pintura, reboco, piso', 'INTEGRAL', 3);

INSERT INTO TRABALHADOR (id_trabalhador, nome, username, cpf, email, telefone, senha_hash, descricao, habilidades, disponibilidade, id_cidade)
VALUES (5, 'Fernanda Oliveira', 'fe.oliveira', '55566677788', 'fernanda.oliveira@email.com', '12991110005',
        'pbkdf2_sha256$600000$OkRyB+ALC2dgADLg1ARrVQ==$Kuz5jR0EFaqGk+uVBWxPO/dhu9ziXa2tC6/iMKuqT6U=',
        'Tenho experiência em recepção e rotinas administrativas.',
        'recepção, Excel, atendimento ao público', 'MEIO_PERIODO', 6);

INSERT INTO TRABALHADOR (id_trabalhador, nome, username, cpf, email, telefone, senha_hash, descricao, habilidades, disponibilidade, id_cidade)
VALUES (6, 'José Benedito Santos', 'zebenedito', '66677788899', 'jose.santos@email.com', '12991110006',
        'pbkdf2_sha256$600000$6DfXY1e3cC+iU7Z12iBiRQ==$fiQAkmJUbnOK5xYOtGMiM1nSJgOKTqanoAYA8qF34iM=',
        'Cresci na roça. Sei lidar com gado, ordenha e colheita.',
        'colheita, ordenha, trato de animais', 'INTEGRAL', 4);

-- ---------- Cidades onde cada trabalhador aceita trabalhar ----------
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (1, 1);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (1, 2);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (2, 2);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (2, 1);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (2, 3);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (3, 1);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (3, 2);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (4, 3);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (4, 1);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (4, 5);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (5, 6);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (5, 7);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (5, 8);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (6, 4);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (6, 3);
INSERT INTO TRABALHADOR_CIDADE (id_trabalhador, id_cidade) VALUES (6, 7);

-- ---------- Empregadores (senha: Trampu@123) ----------
INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (1, 'Roberto Almeida', 'pousadaserrazul', '12345678000101', 'roberto@pousadaserrazul.com', '12992220001',
        'pbkdf2_sha256$600000$jgPAJWKCrYNtED/mEAwkCw==$DCPrEELPjsl8g24QPM8Zq8C057VnM6C8F35A1xw/seo=',
        'Toco a pousada com minha família há 12 anos. Na temporada de inverno sempre precisamos de reforço.',
        'Pousada Serra Azul', 1);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (2, 'Maria Helena Costa', 'chocolatesdamaria', '23456789000102', 'maria@chocolatesdamaria.com', '12992220002',
        'pbkdf2_sha256$600000$vg0LA5JO90ElT/18k5ZJog==$dx48ddC58zbGcIxiID3S82/0SMqBfwGulU4BljMhzBw=',
        'Chocolate artesanal feito em Campos desde 2009.',
        'Chocolates da Maria', 1);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (3, 'Antônio Carlos Moreira', 'sitiobomretiro', '77788899900', 'antonio.moreira@email.com', '12992220003',
        'pbkdf2_sha256$600000$Pt0NhRlh4C9KX04NDpEi0A==$o3OmHc/9sevF8qKjeJO6/yiDBHLCQYAQWcJ16At5LZY=',
        'Produtor rural. Tenho gado de leite e lavoura no sítio.',
        'Sítio Bom Retiro', 3);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (4, 'Luciana Prado', 'lu.eventos', '34567890000103', 'luciana@pradoeventos.com', '12992220004',
        'pbkdf2_sha256$600000$r2ptVKXw0D4bczlh0SDqJA==$BTlk4qv3K7vIVB76PQQjrnI8lYiObnkhDUdwbDRvXV0=',
        'Organizo casamentos e festas na serra. Sempre preciso de garçons e montadores.',
        'Prado Festas e Eventos', 2);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (5, 'Paulo Henrique Dias', 'paulodias', '88899900011', 'paulo.dias@email.com', '12992220005',
        'pbkdf2_sha256$600000$4TKiki1EQAGnPnXWjSn4MA==$uFPw5njH4bR3qORn8eIN95YaByYTVsvwkN328hwkdtI=',
        'Aposentado. Contrato serviços para minha casa e para cuidar da minha mãe.',
        NULL, 7);

-- ---------- Mais empregadores da região (senha: Trampu@123) ----------
INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (6, 'Sérgio Nogueira', 'saborserra', '45678901000104', 'contato@sabordaserra.com', '12992220006',
        'pbkdf2_sha256$600000$cohkAn6LvxJ2iG82Se2tHg==$WivpGXMMKd1k2ZamPmr4G44qjy6w3GD8bgPAHd90KY4=',
        'Restaurante de comida mineira e fondue no Capivari. Na temporada o movimento triplica.',
        'Restaurante Sabor da Serra', 1);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (7, 'Cláudia Martins', 'supermantiqueira', '56789012000105', 'rh@supermantiqueira.com', '12992220007',
        'pbkdf2_sha256$600000$cdVxDgYLFCrJ1wGoUoNGhA==$Szquz7ji7KmgWpHjgOYb+E9PyQ346V7GjUNtE+0/lHM=',
        'Supermercado de bairro em Abernéssia, com entrega em casa.',
        'Supermercado Mantiqueira', 1);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (8, 'Eduardo Kenji Sato', 'hotelaraucarias', '67890123000106', 'reservas@hotelaraucarias.com', '12992220008',
        'pbkdf2_sha256$600000$igaxyVjdlzkowhG2t7Xirw==$g12ulYJZsf2HyRQS3pRLy+71Ldk0ev8tagGclCNhj9E=',
        'Hotel com 40 apartamentos, restaurante e área verde no Alto da Boa Vista.',
        'Hotel Vale das Araucárias', 1);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (9, 'Ricardo Fonseca', 'construpinhal', '78901234000107', 'obras@construpinhal.com', '12992220009',
        'pbkdf2_sha256$600000$AdlIQUNdmr06YO50uW9osA==$z8cgU+h+jO/nOTSqWVboFppqr3DwWwWa4oLS/HYK7QY=',
        'Pequena construtora de casas e reformas em Santo Antônio do Pinhal e região.',
        'Construtora Pinhal', 2);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (10, 'Beatriz Lacerda', 'pousadapicoagudo', '89012345000108', 'beatriz@pousadapicoagudo.com', '12992220010',
        'pbkdf2_sha256$600000$F1TOmXPM1FUDBZvIxgLo6g==$Z7k4/78Zm+BPzc38En9e+stRaOg3Jt9binghe6vubxE=',
        'Pousada de chalés com vista para o Pico Agudo. Atendimento de família.',
        'Pousada Pico Agudo', 2);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (11, 'Joaquim Ribeiro', 'fazendasantaclara', '90123456000109', 'joaquim@fazendasantaclara.com', '12992220011',
        'pbkdf2_sha256$600000$qCKH5tGFbLOT+oPL4P8rbQ==$m3VhgG8G7Ada3pmojOqPma8PAiDjBTX6rTfo/rXoz68=',
        'Produzimos morango, leite e queijo em São Bento do Sapucaí há três gerações.',
        'Fazenda Santa Clara', 3);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (12, 'Patrícia Andrade', 'acordesmusica', '01234567000110', 'patricia@escolaacordes.com', '12992220012',
        'pbkdf2_sha256$600000$aZtjyWUw1H4AuYPveMPkqg==$aMmZdLJbXuCX43p8fh6a+NGeRT8YlCsK9DYvafCCW34=',
        'Escola de música e reforço escolar em Taubaté, com turmas para crianças e adultos.',
        'Escola Acordes', 7);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (13, 'Vanessa Rocha', 'belaserra.salao', '11223344000111', 'vanessa@belaserra.com', '12992220013',
        'pbkdf2_sha256$600000$dkAJ7G8CJMgNHsMI4+EL+Q==$X2owurmReoACE+/3lyrdM3hAScNXGw+yuXIzOYHyZPI=',
        'Salão de beleza no Jaguaribe. Atendemos noivas e formaturas da região.',
        'Salão Bela Serra', 1);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (14, 'Guilherme Prado', 'cervejamontanha', '22334455000112', 'gui@cervejamontanha.com', '12992220014',
        'pbkdf2_sha256$600000$ciBdI70g/uVIuyExuN5TGQ==$gw+AenwQc5VabGuoVwDQRd4VfmxFMhYgS01T/p3M5Po=',
        'Cervejaria artesanal com bar e eventos aos fins de semana.',
        'Cervejaria Montanha', 1);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (15, 'Rosana Teixeira', 'recantodosavos', '33445566000113', 'contato@recantodosavos.com', '12992220015',
        'pbkdf2_sha256$600000$raYh8q9/vkl4oVNoI7coVA==$3H1TjsGa6I5JglBKMoSZvED8+/OO77FepKlaZh9alxU=',
        'Casa de repouso com 18 residentes em Pindamonhangaba.',
        'Recanto dos Avós', 6);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (16, 'Fábio Cardoso', 'valelogistica', '44556677000114', 'rh@valelogistica.com', '12992220016',
        'pbkdf2_sha256$600000$8OGIlMUnkX9egtoVoYvm8Q==$1hmubl/YM4DirjXDnbop5Qax1Te1jsySVT+0QLy8A4k=',
        'Transportadora e entregas para o comércio do Vale do Paraíba.',
        'Vale Logística', 7);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (17, 'Silvia Moraes', 'contabilsilva', '55667788000115', 'silvia@contabilsilva.com', '12992220017',
        'pbkdf2_sha256$600000$WL5b+vjWSbCzkPvQdnnIzA==$Tn04SJM0XvKs9ooLmmObxmh9vphIzoQ5Q3p9tKNB/mY=',
        'Escritório de contabilidade que atende pequenos negócios da região.',
        'Contabilidade Silva', 7);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (18, 'Aparecida Gomes', 'dona.cida', '12345609871', 'cida.gomes@email.com', '12992220018',
        'pbkdf2_sha256$600000$PLnVXK7YmVQCTXEYv8aKpA==$WmsDfrZQDYW5QywL59aFvWk+Hfa56gXT1F9sqrDYEmo=',
        'Moro sozinha com meu marido em Tremembé e preciso de ajuda em casa.',
        NULL, 8);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (19, 'Marcelo Duarte', 'paodaserra', '66778899000116', 'marcelo@paodaserra.com', '12992220019',
        'pbkdf2_sha256$600000$hIEgTqZDbpmbOJyAGp9Wtg==$gNr8fXAeVVqyF6vwUUHvqm6tVZCRXnXcNpQjGeBQcbM=',
        'Padaria e confeitaria no centro de Pindamonhangaba, aberta todos os dias.',
        'Padaria Pão da Serra', 6);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (20, 'Helena Vasconcelos', 'sitiohortensias', '77889900000117', 'helena@sitiohortensias.com', '12992220020',
        'pbkdf2_sha256$600000$xb3rAQEtq3/v/3kNXkY+5w==$/svSrLO3cSCOpnIfGnkQV0QF3UtYyOgo7RtQHLNLQLA=',
        'Sítio de orgânicos em Sapucaí-Mirim. Vendemos cestas para Campos e São Paulo.',
        'Sítio das Hortênsias', 5);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (21, 'Thiago Bastos', 'serraaventura', '88990011000118', 'thiago@serraaventura.com', '12992220021',
        'pbkdf2_sha256$600000$1ev1OhicjvEZQ+10F9LaxA==$2V0ewNy3v14rGBSbFg1C+cMUk/jwwcpUSOTSu4RTIIs=',
        'Agência de turismo de aventura: trilhas, escalada na Pedra do Baú e passeios de jipe.',
        'Serra Aventura', 3);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (22, 'José Carlos Pires', 'mercadinhodoze', '23456781234', 'ze.pires@email.com', '12992220022',
        'pbkdf2_sha256$600000$LgSfzQKDE4dblZMoRrIHlw==$1+gl5qfw7A3YWnk98HxmdrOZ4kqZyF90jtJA324Mjlo=',
        'Mercadinho de família no centro de Monteiro Lobato.',
        'Mercadinho do Zé', 4);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (23, 'Otávio Lemos', 'artemadeira', '99001122000119', 'otavio@artemadeira.com', '12992220023',
        'pbkdf2_sha256$600000$98+xphO4kxnCMgDmhcvyVA==$dkzlh/470lCnKhvZyUaujxx9kPKDiXF2BpUYVAC5IqM=',
        'Marcenaria de móveis rústicos sob encomenda.',
        'Arte em Madeira', 8);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (24, 'Camila Freitas', 'amigofiel.pet', '10293847000120', 'camila@amigofielpet.com', '12992220024',
        'pbkdf2_sha256$600000$TLLHl32uvgX7pHw/uTCy2w==$othMbQ0Od94ejWG8uZ125UPvSuuQObSG0wJSF8n+Hvs=',
        'Pet shop com banho e tosa e hotelzinho para cães.',
        'Pet Shop Amigo Fiel', 7);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (25, 'Família Andrade', 'chacaraandrade', '34567812345', 'andrade.familia@email.com', '12992220025',
        'pbkdf2_sha256$600000$cyPk4mTjWohi/N8qPxmpoQ==$TD+p9Jgz97fqS9m0Hvc5GHR/7lWSnIX92DhN+mAeaao=',
        'Temos uma chácara de fim de semana e precisamos de gente de confiança da região.',
        NULL, 2);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (26, 'Neusa Barbosa', 'festadopinhao', '21324354000121', 'neusa@festadopinhao.org', '12992220026',
        'pbkdf2_sha256$600000$gxKbeIM37A+QO8a9hZmdWA==$3M7PIDCLXyNoNa/1++rm/fpghS23m9tceBMcm2j+v5U=',
        'Associação que organiza a Festa do Pinhão e eventos culturais da cidade.',
        'Associação Festa do Pinhão', 1);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (27, 'Rogério Alves', 'mecanicaserrana', '32435465000122', 'rogerio@mecanicaserrana.com', '12992220027',
        'pbkdf2_sha256$600000$5C4dGYfSAdKo8Xol5S2RnQ==$N7zTy79erqcT3vA3zOTIklEPNS1LlB4sKGBG8qc2FOY=',
        'Oficina mecânica e borracharia na entrada de Pindamonhangaba.',
        'Auto Mecânica Serrana', 6);

INSERT INTO EMPREGADOR (id_empregador, nome, username, documento, email, telefone, senha_hash, descricao, nome_negocio, id_cidade)
VALUES (28, 'Lívia Campos', 'jardimencantado', '43546576000123', 'livia@jardimencantado.com', '12992220028',
        'pbkdf2_sha256$600000$rmQNQeCx7DDttlIoTEDEvA==$RJthllJ1Vkt3NhweoeKuBPjNRFje7ElXFjq65Judp6s=',
        'Floricultura e paisagismo para casas e pousadas da serra.',
        'Jardim Encantado', 1);

-- ---------- Vagas ----------
-- Pousada Serra Azul (Campos do Jordão)
INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (1, 'Camareira para temporada de inverno', 'Arrumação e limpeza de quartos durante a alta temporada. Alimentação no local.',
        'TEMPORARIO', 120.00, 'DIA', '2027-06-20', '2027-07-31', 'Escala 6x1, das 8h às 16h', 'Capivari', 3, 'ABERTA', 1, 1, 2);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (2, 'Recepcionista de pousada', 'Check-in, check-out, reservas por telefone e WhatsApp. Inglês básico é um diferencial.',
        'FIXO', 2100.00, 'MES', NULL, NULL, 'Escala 6x1, das 14h às 22h', 'Capivari', 1, 'ABERTA', 1, 1, 2);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (3, 'Auxiliar de cozinha para temporada', 'Preparo do café da manhã e apoio na cozinha do restaurante da pousada.',
        'TEMPORARIO', 130.00, 'DIA', '2027-06-25', '2027-07-31', 'Das 6h às 14h', 'Capivari', 2, 'ABERTA', 1, 1, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (4, 'Jardineiro para fim de semana', 'Poda, limpeza dos canteiros e corte de grama da área externa.',
        'BICO', 160.00, 'DIA', '2026-12-05', '2026-12-06', 'Das 8h às 17h', 'Capivari', 1, 'ABERTA', 1, 1, 9);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (5, 'Recepção no Festival de Inverno', 'Reforço na recepção durante o festival de julho.',
        'TEMPORARIO', 110.00, 'DIA', '2026-07-01', '2026-07-31', 'Das 14h às 22h', 'Capivari', 1, 'FECHADA', 1, 1, 2);

-- Chocolates da Maria (Campos do Jordão)
INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (6, 'Atendente de chocolateria', 'Atendimento ao cliente, caixa e organização da loja.',
        'FIXO', 1900.00, 'MES', NULL, NULL, 'Terça a domingo, das 10h às 18h', 'Capivari', 2, 'ABERTA', 2, 1, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (7, 'Ajudante de produção de chocolate', 'Apoio na produção e embalagem para as vendas de Natal e Ano Novo.',
        'TEMPORARIO', 95.00, 'DIA', '2026-12-01', '2027-01-10', 'Segunda a sábado, das 7h às 15h', 'Vila Abernéssia', 2, 'ABERTA', 2, 1, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (8, 'Vendedor de fim de ano', 'Vendas na loja durante dezembro.',
        'TEMPORARIO', 1700.00, 'MES', '2026-12-01', '2026-12-31', 'Das 12h às 20h', 'Capivari', 1, 'ABERTA', 2, 1, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (9, 'Pintura da fachada da loja', 'Pintura externa completa, material fornecido.',
        'BICO', 1800.00, 'TOTAL', '2026-12-07', '2026-12-12', 'Das 7h às 17h', 'Capivari', 1, 'ABERTA', 2, 1, 4);

-- Sitio Bom Retiro (Sao Bento do Sapucai)
INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (10, 'Ajudante de colheita', 'Colheita na lavoura do sítio. Transporte saindo do centro.',
        'TEMPORARIO', 110.00, 'DIA', '2027-04-01', '2027-06-30', 'Segunda a sexta, das 6h às 14h', 'Zona rural', 4, 'ABERTA', 3, 3, 3);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (11, 'Caseiro de sítio', 'Cuidar da casa, do pomar e dos animais. Moradia no local.',
        'FIXO', 2200.00, 'MES', NULL, NULL, 'Moradia no sítio, folga aos domingos', 'Zona rural', 1, 'ABERTA', 3, 3, 3);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (12, 'Ordenha e trato de gado', 'Ordenha da manhã e trato do gado na propriedade de Monteiro Lobato.',
        'FIXO', 1800.00, 'MES', NULL, NULL, 'Das 5h às 11h', 'Zona rural', 1, 'ABERTA', 3, 4, 3);

-- Prado Festas e Eventos (Santo Antonio do Pinhal)
INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (13, 'Garçom para casamento', 'Serviço de mesa em casamento para 150 convidados. Usar roupa social preta.',
        'BICO', 200.00, 'TOTAL', '2026-11-28', '2026-11-28', 'Das 16h à meia-noite', 'Centro', 4, 'ABERTA', 4, 2, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (14, 'Montagem de festa', 'Montagem de tenda, mesas e decoração para o casamento de sábado.',
        'BICO', 150.00, 'TOTAL', '2026-11-27', '2026-11-27', 'Das 8h às 17h', 'Centro', 2, 'ABERTA', 4, 2, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (15, 'Copeira para confraternização', 'Festa de fim de ano de uma empresa em Campos do Jordão.',
        'BICO', 180.00, 'TOTAL', '2026-12-12', '2026-12-12', 'Das 18h às 23h', 'Jardim do Embaixador', 2, 'ABERTA', 4, 1, 8);

-- Paulo Henrique Dias (pessoa fisica, Taubate)
INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (16, 'Pedreiro para muro', 'Levantar e rebocar um muro de 12 metros. Material já comprado.',
        'BICO', 250.00, 'DIA', '2026-11-23', '2026-11-27', 'Das 7h às 17h', 'Centro', 1, 'ABERTA', 5, 7, 4);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (17, 'Diarista quinzenal', 'Limpeza completa de casa com 3 quartos, a cada 15 dias.',
        'FIXO', 170.00, 'DIA', NULL, NULL, 'A cada 15 dias, das 8h às 16h', 'Centro', 1, 'ABERTA', 5, 7, 5);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (18, 'Roçada de terreno', 'Roçar terreno de 500 m² em Tremembé.',
        'BICO', 180.00, 'TOTAL', '2026-11-21', '2026-11-21', 'A partir das 7h', 'Centro', 1, 'ABERTA', 5, 8, 9);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (19, 'Cuidador de idoso noturno', 'Acompanhar minha mãe de 84 anos durante a noite.',
        'FIXO', 2400.00, 'MES', NULL, NULL, 'Escala 12x36, das 19h às 7h', 'Centro', 1, 'ABERTA', 5, 7, 6);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (20, 'Reforço escolar de matemática', 'Aulas para meu neto do 7º ano.',
        'FIXO', 40.00, 'HORA', NULL, NULL, 'Terças e quintas, das 15h às 17h', 'Centro', 1, 'ABERTA', 5, 7, 13);

-- ---------- Mais vagas (empregadores 6 a 28) ----------
INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (21, 'Cozinheiro de comida mineira', 'Preparo de pratos do cardápio e organização da cozinha. Experiência em fogão a lenha é um diferencial.',
        'FIXO', 2300.00, 'MES', NULL, NULL, 'Terça a domingo, das 11h às 19h', 'Capivari', 1, 'ABERTA', 6, 1, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (22, 'Garçom para temporada de inverno', 'Atendimento às mesas no período de maior movimento do ano. Gorjeta dividida entre a equipe.',
        'TEMPORARIO', 150.00, 'DIA', '2027-06-15', '2027-07-31', 'Das 18h à meia-noite', 'Capivari', 4, 'ABERTA', 6, 1, 2);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (23, 'Ajudante de cozinha para férias de verão', 'Pré-preparo, lavagem de louça e apoio ao cozinheiro durante as férias.',
        'TEMPORARIO', 120.00, 'DIA', '2026-12-20', '2027-01-31', 'Das 10h às 18h', 'Capivari', 2, 'ABERTA', 6, 1, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (24, 'Caixa de restaurante', 'Fechamento de contas, cartão e PIX. Atenção e simpatia com o cliente.',
        'FIXO', 1850.00, 'MES', NULL, NULL, 'Escala 6x1, das 17h à 1h', 'Capivari', 1, 'ABERTA', 6, 1, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (25, 'Garçom extra para o Réveillon', 'Reforço no jantar de Ano Novo do restaurante. Traje preto e branco.',
        'BICO', 180.00, 'TOTAL', '2026-12-31', '2026-12-31', 'Das 19h às 3h', 'Capivari', 3, 'ABERTA', 6, 1, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (26, 'Repositor de mercadorias', 'Reposição de gôndolas, conferência de validade e organização do estoque.',
        'FIXO', 1700.00, 'MES', NULL, NULL, 'Escala 6x1, das 7h às 15h20', 'Vila Abernéssia', 2, 'ABERTA', 7, 1, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (27, 'Operador de caixa', 'Atendimento no caixa, sangria e fechamento. Ensinamos a usar o sistema.',
        'FIXO', 1800.00, 'MES', NULL, NULL, 'Escala 6x1, das 13h às 21h20', 'Vila Abernéssia', 2, 'ABERTA', 7, 1, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (28, 'Entregador com moto própria', 'Entregas de compras para clientes em Campos. Pagamos combustível à parte.',
        'FIXO', 1900.00, 'MES', NULL, NULL, 'Segunda a sábado, das 9h às 17h', 'Vila Abernéssia', 1, 'ABERTA', 7, 1, 10);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (29, 'Empacotador para o fim de ano', 'Ajudar no caixa e no empacotamento durante o movimento de Natal e Ano Novo.',
        'TEMPORARIO', 90.00, 'DIA', '2026-12-15', '2027-01-05', 'Das 14h às 22h', 'Vila Abernéssia', 3, 'ABERTA', 7, 1, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (30, 'Açougueiro', 'Cortes, atendimento no balcão do açougue e limpeza da área.',
        'FIXO', 2000.00, 'MES', NULL, NULL, 'Escala 6x1, das 6h às 14h20', 'Vila Abernéssia', 1, 'ABERTA', 7, 1, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (31, 'Camareira de hotel', 'Arrumação de apartamentos e áreas comuns. Uniforme e refeição no local.',
        'FIXO', 1950.00, 'MES', NULL, NULL, 'Escala 6x1, das 7h às 15h', 'Alto da Boa Vista', 3, 'ABERTA', 8, 1, 2);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (32, 'Recepcionista noturno', 'Atendimento na recepção durante a noite, check-in tardio e rondas internas.',
        'FIXO', 2200.00, 'MES', NULL, NULL, 'Escala 12x36, noturno', 'Alto da Boa Vista', 1, 'ABERTA', 8, 1, 2);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (33, 'Auxiliar de manutenção predial', 'Pequenos reparos elétricos e hidráulicos, pintura e cuidado da área verde.',
        'FIXO', 2100.00, 'MES', NULL, NULL, 'Segunda a sábado, das 7h às 16h', 'Alto da Boa Vista', 1, 'ABERTA', 8, 1, 9);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (34, 'Copeira do café da manhã', 'Montagem e reposição do buffet de café da manhã na alta temporada.',
        'TEMPORARIO', 140.00, 'DIA', '2027-06-20', '2027-07-31', 'Das 6h às 14h', 'Alto da Boa Vista', 2, 'ABERTA', 8, 1, 2);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (35, 'Auxiliar de reservas', 'Responder e-mails e WhatsApp de hóspedes, controlar reservas e pagamentos.',
        'FIXO', 2400.00, 'MES', NULL, NULL, 'Segunda a sexta, das 9h às 18h', 'Alto da Boa Vista', 1, 'ABERTA', 8, 1, 12);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (36, 'Pedreiro de obra', 'Alvenaria, reboco e contrapiso em obras de casas na região.',
        'FIXO', 2800.00, 'MES', NULL, NULL, 'Segunda a sexta, das 7h às 17h', 'Centro', 2, 'ABERTA', 9, 2, 4);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (37, 'Servente de pedreiro', 'Preparar massa, carregar material e manter a obra organizada.',
        'FIXO', 1900.00, 'MES', NULL, NULL, 'Segunda a sexta, das 7h às 17h', 'Centro', 3, 'ABERTA', 9, 2, 4);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (38, 'Eletricista para casa nova', 'Instalação elétrica completa de casa de 90 m². Material por conta da obra.',
        'BICO', 2500.00, 'TOTAL', '2026-12-01', '2026-12-15', 'Das 7h às 17h', 'Pico Agudo', 1, 'ABERTA', 9, 2, 4);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (39, 'Azulejista para reforma', 'Assentamento de piso e azulejo em reforma de pousada em Tremembé.',
        'TEMPORARIO', 180.00, 'DIA', '2027-01-10', '2027-03-10', 'Das 7h às 16h', 'Centro', 2, 'ABERTA', 9, 8, 4);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (40, 'Encanador para troca de tubulação', 'Trocar a tubulação de água de uma cozinha e um banheiro.',
        'BICO', 900.00, 'TOTAL', '2026-11-28', '2026-11-30', 'Das 7h às 17h', 'Centro', 1, 'ABERTA', 9, 2, 4);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (41, 'Camareira para chalés', 'Limpeza e arrumação de chalés na temporada de verão.',
        'TEMPORARIO', 130.00, 'DIA', '2026-12-18', '2027-02-28', 'Das 8h às 16h', 'Pico Agudo', 2, 'ABERTA', 10, 2, 2);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (42, 'Cozinheira de café colonial', 'Preparar bolos, pães e quitutes do café colonial servido aos hóspedes.',
        'FIXO', 2100.00, 'MES', NULL, NULL, 'Quarta a domingo, das 6h às 14h', 'Pico Agudo', 1, 'ABERTA', 10, 2, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (43, 'Limpeza de trilha e jardim', 'Roçar a trilha até o mirante e limpar os canteiros da entrada.',
        'BICO', 350.00, 'TOTAL', '2026-12-05', '2026-12-06', 'Das 8h às 17h', 'Pico Agudo', 1, 'ABERTA', 10, 2, 9);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (44, 'Recepcionista de pousada', 'Recepção de hóspedes, reservas por telefone e indicação de passeios.',
        'FIXO', 1900.00, 'MES', NULL, NULL, 'Escala 5x2, das 14h às 22h', 'Pico Agudo', 1, 'ABERTA', 10, 2, 2);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (45, 'Colhedor de morango', 'Colheita e seleção de morangos na estufa. Transporte saindo do centro.',
        'TEMPORARIO', 120.00, 'DIA', '2027-05-01', '2027-09-30', 'Segunda a sábado, das 6h às 14h', 'Quilombo', 6, 'ABERTA', 11, 3, 3);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (46, 'Ordenhador', 'Ordenha mecânica de 30 vacas e limpeza do curral.',
        'FIXO', 2000.00, 'MES', NULL, NULL, 'Das 4h30 às 10h30, folga quinzenal', 'Quilombo', 1, 'ABERTA', 11, 3, 3);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (47, 'Auxiliar de queijaria', 'Produção de queijo minas e frescal, embalagem e controle de temperatura.',
        'FIXO', 1900.00, 'MES', NULL, NULL, 'Segunda a sexta, das 7h às 16h', 'Quilombo', 1, 'ABERTA', 11, 3, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (48, 'Ajudante para cercar pasto', 'Fincar mourões e esticar arame em um pasto de 3 hectares.',
        'BICO', 140.00, 'DIA', '2026-12-08', '2026-12-10', 'Das 7h às 16h', 'Quilombo', 3, 'ABERTA', 11, 3, 3);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (49, 'Motorista de caminhão leve', 'Entregar leite e queijo em São Bento, Campos e Santo Antônio. CNH categoria C.',
        'FIXO', 2600.00, 'MES', NULL, NULL, 'Segunda a sábado, das 5h às 13h', 'Quilombo', 1, 'ABERTA', 11, 3, 10);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (50, 'Professor de violão', 'Aulas em grupo para crianças e adolescentes. Material didático da escola.',
        'FIXO', 60.00, 'HORA', NULL, NULL, 'Terças e quintas à tarde', 'Centro', 1, 'ABERTA', 12, 7, 13);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (51, 'Professor de reforço do ensino fundamental', 'Reforço de português e matemática para alunos do 1º ao 9º ano.',
        'FIXO', 45.00, 'HORA', NULL, NULL, 'Segunda a sexta, das 14h às 18h', 'Centro', 2, 'ABERTA', 12, 7, 13);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (52, 'Professor de informática básica para idosos', 'Ensinar a usar celular, WhatsApp, internet e banco pelo aplicativo.',
        'FIXO', 55.00, 'HORA', NULL, NULL, 'Sábados de manhã', 'Centro', 1, 'ABERTA', 12, 7, 13);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (53, 'Recepcionista de escola', 'Atender pais e alunos, agendar aulas experimentais e receber mensalidades.',
        'FIXO', 1700.00, 'MES', NULL, NULL, 'Segunda a sexta, das 13h às 19h', 'Centro', 1, 'ABERTA', 12, 7, 12);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (54, 'Manicure e pedicure', 'Atendimento no salão. Pagamos diária fixa mais comissão por serviço.',
        'FIXO', 50.00, 'DIA', NULL, NULL, 'Terça a sábado, das 9h às 19h', 'Jaguaribe', 1, 'ABERTA', 13, 1, 11);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (55, 'Auxiliar de cabeleireiro', 'Lavar cabelos, preparar produtos e ajudar nos atendimentos. Ensinamos a profissão.',
        'FIXO', 1600.00, 'MES', NULL, NULL, 'Terça a sábado, das 9h às 18h', 'Jaguaribe', 1, 'ABERTA', 13, 1, 11);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (56, 'Maquiadora para formatura', 'Maquiagem de formandas em um sábado de manhã.',
        'BICO', 300.00, 'TOTAL', '2026-12-19', '2026-12-19', 'Das 6h às 13h', 'Jaguaribe', 2, 'ABERTA', 13, 1, 11);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (57, 'Cabeleireira para dezembro', 'Reforço na equipe no mês mais movimentado do salão.',
        'TEMPORARIO', 140.00, 'DIA', '2026-12-10', '2026-12-31', 'Das 9h às 19h', 'Jaguaribe', 1, 'ABERTA', 13, 1, 11);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (58, 'Atendente de bar para festival de cerveja', 'Servir chope e organizar fichas em festival de cervejas artesanais.',
        'BICO', 170.00, 'TOTAL', '2026-12-12', '2026-12-12', 'Das 16h à meia-noite', 'Capivari', 4, 'ABERTA', 14, 1, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (59, 'Auxiliar de produção cervejeira', 'Limpeza de tanques, envase e rotulagem. Ensinamos o processo.',
        'FIXO', 2100.00, 'MES', NULL, NULL, 'Segunda a sexta, das 7h às 16h', 'Vila Inglesa', 1, 'ABERTA', 14, 1, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (60, 'Vendedor da loja da fábrica', 'Vendas, degustação guiada e explicação dos estilos de cerveja para turistas.',
        'FIXO', 1800.00, 'MES', NULL, NULL, 'Quinta a domingo, das 12h às 20h', 'Capivari', 1, 'ABERTA', 14, 1, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (61, 'Montagem de estrutura para evento', 'Montar tendas, mesas e palco para evento de fim de semana.',
        'BICO', 220.00, 'TOTAL', '2027-01-16', '2027-01-17', 'Das 8h às 18h', 'Capivari', 3, 'ABERTA', 14, 1, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (62, 'Cuidador de idosos', 'Higiene, alimentação e acompanhamento dos residentes. Curso de cuidador é desejável.',
        'FIXO', 2300.00, 'MES', NULL, NULL, 'Escala 12x36, diurno', 'Bosque', 3, 'ABERTA', 15, 6, 6);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (63, 'Cuidador de idosos noturno', 'Acompanhar os residentes durante a noite e registrar intercorrências.',
        'FIXO', 2500.00, 'MES', NULL, NULL, 'Escala 12x36, noturno', 'Bosque', 2, 'ABERTA', 15, 6, 6);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (64, 'Cozinheira de casa de repouso', 'Preparar refeições seguindo as orientações da nutricionista.',
        'FIXO', 1900.00, 'MES', NULL, NULL, 'Segunda a sábado, das 6h às 14h', 'Bosque', 1, 'ABERTA', 15, 6, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (65, 'Auxiliar de limpeza', 'Limpeza dos quartos, banheiros e áreas comuns.',
        'FIXO', 1650.00, 'MES', NULL, NULL, 'Segunda a sexta, das 7h às 16h', 'Bosque', 1, 'ABERTA', 15, 6, 5);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (66, 'Oficina de música para idosos', 'Uma tarde de cantoria e violão com os residentes.',
        'BICO', 120.00, 'TOTAL', '2026-12-03', '2026-12-03', 'Das 14h às 16h', 'Bosque', 1, 'ABERTA', 15, 6, 13);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (67, 'Motorista entregador', 'Entregas no Vale do Paraíba com veículo da empresa. CNH categoria B.',
        'FIXO', 2900.00, 'MES', NULL, NULL, 'Segunda a sexta, das 6h às 15h', 'Independência', 2, 'ABERTA', 16, 7, 10);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (68, 'Ajudante de entregas', 'Carregar e descarregar mercadorias e acompanhar o motorista.',
        'FIXO', 1800.00, 'MES', NULL, NULL, 'Segunda a sexta, das 6h às 15h', 'Independência', 3, 'ABERTA', 16, 7, 10);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (69, 'Conferente para a Black Friday e o Natal', 'Separar e conferir pedidos no pico de vendas do fim de ano.',
        'TEMPORARIO', 130.00, 'DIA', '2026-11-25', '2026-12-24', 'Das 7h às 17h', 'Independência', 4, 'ABERTA', 16, 7, 10);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (70, 'Auxiliar administrativo de logística', 'Emitir notas, controlar rotas e atender clientes por telefone.',
        'FIXO', 2200.00, 'MES', NULL, NULL, 'Segunda a sexta, das 8h às 17h', 'Independência', 1, 'ABERTA', 16, 7, 12);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (71, 'Ajudante de mudança', 'Carregar e descarregar uma mudança residencial em Pindamonhangaba.',
        'BICO', 250.00, 'TOTAL', '2026-12-14', '2026-12-14', 'Das 8h às 14h', 'Moreira César', 2, 'ABERTA', 16, 6, 10);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (72, 'Auxiliar contábil', 'Lançamentos, conciliação bancária e organização de documentos dos clientes.',
        'FIXO', 2000.00, 'MES', NULL, NULL, 'Segunda a sexta, das 8h às 17h', 'Centro', 1, 'ABERTA', 17, 7, 12);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (73, 'Estagiário de administração', 'Apoio ao escritório. Para estudantes de administração ou contabilidade.',
        'FIXO', 1000.00, 'MES', NULL, NULL, 'Segunda a sexta, das 8h às 14h', 'Centro', 1, 'ABERTA', 17, 7, 12);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (74, 'Assistente para imposto de renda', 'Separar documentos e preencher declarações durante a temporada do IR.',
        'TEMPORARIO', 1800.00, 'MES', '2027-03-01', '2027-05-31', 'Segunda a sexta, das 8h às 17h', 'Centro', 2, 'ABERTA', 17, 7, 12);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (75, 'Digitação de documentos antigos', 'Digitar e organizar fichas de clientes em planilha.',
        'BICO', 400.00, 'TOTAL', '2026-12-07', '2026-12-11', 'Das 9h às 13h', 'Centro', 1, 'ABERTA', 17, 7, 12);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (76, 'Diarista duas vezes por semana', 'Limpeza da casa, roupas e organização da cozinha.',
        'FIXO', 160.00, 'DIA', NULL, NULL, 'Terças e sextas, das 8h às 16h', 'Padre Eterno', 1, 'ABERTA', 18, 8, 5);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (77, 'Acompanhante para meu marido', 'Acompanhar meu marido de 79 anos em consultas, caminhadas e na hora dos remédios.',
        'FIXO', 1800.00, 'MES', NULL, NULL, 'Segunda a sexta, das 8h às 14h', 'Padre Eterno', 1, 'ABERTA', 18, 8, 6);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (78, 'Poda das árvores do quintal', 'Podar duas mangueiras e um pé de abacate, e recolher os galhos.',
        'BICO', 180.00, 'TOTAL', '2026-11-30', '2026-11-30', 'Das 8h às 16h', 'Padre Eterno', 1, 'ABERTA', 18, 8, 9);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (79, 'Faxina pesada de fim de ano', 'Faxina completa antes de receber a família no Natal.',
        'BICO', 200.00, 'TOTAL', '2026-12-22', '2026-12-22', 'Das 8h às 17h', 'Padre Eterno', 1, 'ABERTA', 18, 8, 5);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (80, 'Padeiro', 'Produção de pão francês, de forma e doces. Experiência com forno de lastro.',
        'FIXO', 2300.00, 'MES', NULL, NULL, 'Segunda a sábado, das 3h às 11h', 'Centro', 1, 'ABERTA', 19, 6, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (81, 'Atendente de padaria', 'Atendimento no balcão, frios e café.',
        'FIXO', 1750.00, 'MES', NULL, NULL, 'Escala 6x1, das 6h às 14h20', 'Centro', 2, 'ABERTA', 19, 6, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (82, 'Confeiteira para encomendas de Natal', 'Produção de panetones, bolos e tortas para as encomendas de fim de ano.',
        'TEMPORARIO', 110.00, 'DIA', '2026-12-10', '2027-01-02', 'Das 6h às 14h', 'Centro', 2, 'ABERTA', 19, 6, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (83, 'Salgadeira', 'Produção de salgados fritos e assados para a vitrine e encomendas.',
        'FIXO', 1800.00, 'MES', NULL, NULL, 'Segunda a sábado, das 5h às 13h', 'Centro', 1, 'ABERTA', 19, 6, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (84, 'Entregador de pães por bicicleta', 'Entregar pães e leite para clientes do centro logo cedo.',
        'FIXO', 1500.00, 'MES', NULL, NULL, 'Segunda a sábado, das 6h às 11h', 'Centro', 1, 'ABERTA', 19, 6, 10);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (85, 'Trabalhador de horta orgânica', 'Plantio, capina e colheita de hortaliças sem agrotóxico.',
        'FIXO', 1900.00, 'MES', NULL, NULL, 'Segunda a sexta, das 7h às 16h', 'Zona rural', 2, 'ABERTA', 20, 5, 3);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (86, 'Ajudante de plantio', 'Preparar canteiros e plantar mudas na temporada de plantio.',
        'TEMPORARIO', 100.00, 'DIA', '2027-02-01', '2027-04-30', 'Das 7h às 15h', 'Zona rural', 3, 'ABERTA', 20, 5, 3);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (87, 'Montador de cestas orgânicas', 'Lavar, separar e montar as cestas que vão para os clientes.',
        'FIXO', 1600.00, 'MES', NULL, NULL, 'Segunda a sexta, das 7h às 13h', 'Zona rural', 1, 'ABERTA', 20, 5, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (88, 'Vendedor na feira de Campos', 'Vender nossos produtos na feira de sábado em Campos do Jordão.',
        'BICO', 150.00, 'DIA', '2026-12-05', '2026-12-20', 'Sábados, das 7h às 13h', 'Vila Abernéssia', 1, 'ABERTA', 20, 1, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (89, 'Guia de trilha', 'Conduzir grupos na trilha da Pedra do Baú. Conhecer a região é essencial.',
        'TEMPORARIO', 200.00, 'DIA', '2026-12-15', '2027-02-28', 'Das 7h às 16h', 'Centro', 2, 'ABERTA', 21, 3, 2);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (90, 'Motorista de jipe para passeios', 'Dirigir o jipe nos passeios pela serra. CNH B há pelo menos 3 anos.',
        'FIXO', 2500.00, 'MES', NULL, NULL, 'Quinta a domingo, das 8h às 17h', 'Centro', 1, 'ABERTA', 21, 3, 10);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (91, 'Atendente de agência de turismo', 'Vender passeios no balcão e pelo WhatsApp, e organizar a agenda dos guias.',
        'FIXO', 1700.00, 'MES', NULL, NULL, 'Quarta a domingo, das 9h às 17h', 'Centro', 1, 'ABERTA', 21, 3, 12);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (92, 'Apoio em passeio de grupo', 'Ajudar o guia com um grupo de 20 turistas em um sábado.',
        'BICO', 180.00, 'TOTAL', '2027-01-23', '2027-01-23', 'Das 6h às 15h', 'Serrano', 2, 'ABERTA', 21, 3, 2);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (93, 'Balconista de mercadinho', 'Atender no balcão e no caixa, repor prateleiras.',
        'FIXO', 1600.00, 'MES', NULL, NULL, 'Segunda a sábado, das 7h às 15h', 'Centro', 1, 'ABERTA', 22, 4, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (94, 'Entregas de bicicleta no sábado', 'Levar as compras dos clientes que moram perto do centro.',
        'BICO', 120.00, 'DIA', '2026-12-01', '2026-12-24', 'Sábados, das 8h às 12h', 'Centro', 1, 'ABERTA', 22, 4, 10);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (95, 'Roçada do terreno dos fundos', 'Roçar e limpar um terreno de 800 m² atrás do mercado.',
        'BICO', 250.00, 'TOTAL', '2026-11-29', '2026-11-29', 'Das 7h às 16h', 'Zona rural', 1, 'ABERTA', 22, 4, 9);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (96, 'Ajudante de marcenaria', 'Lixar, montar e envernizar móveis rústicos. Ensinamos o ofício.',
        'FIXO', 2200.00, 'MES', NULL, NULL, 'Segunda a sexta, das 7h às 17h', 'Vila Maria', 1, 'ABERTA', 23, 8, 14);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (97, 'Instalação de deck de madeira', 'Ajudar na instalação de um deck de 20 m² em uma casa.',
        'BICO', 600.00, 'TOTAL', '2026-12-02', '2026-12-04', 'Das 8h às 17h', 'Centro', 1, 'ABERTA', 23, 8, 4);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (98, 'Pintor de móveis', 'Pintura e acabamento de móveis para as encomendas de verão.',
        'TEMPORARIO', 1800.00, 'MES', '2026-12-01', '2027-02-28', 'Segunda a sexta, das 8h às 17h', 'Vila Maria', 1, 'ABERTA', 23, 8, 14);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (99, 'Banhista e tosador', 'Banho e tosa em cães e gatos. Experiência é um diferencial.',
        'FIXO', 1800.00, 'MES', NULL, NULL, 'Terça a sábado, das 9h às 18h', 'Jardim das Nações', 1, 'ABERTA', 24, 7, 14);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (100, 'Atendente de pet shop', 'Vendas, agendamentos de banho e organização da loja.',
        'FIXO', 1700.00, 'MES', NULL, NULL, 'Segunda a sábado, das 9h às 18h', 'Jardim das Nações', 1, 'ABERTA', 24, 7, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (101, 'Cuidador do hotelzinho de cães', 'Alimentar, passear e cuidar dos cães hospedados nas férias.',
        'TEMPORARIO', 80.00, 'DIA', '2026-12-20', '2027-01-10', 'Das 8h às 12h e das 16h às 19h', 'Jardim das Nações', 1, 'ABERTA', 24, 7, 14);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (102, 'Passeador de cães', 'Passear com cães de clientes no bairro, de segunda a sexta.',
        'BICO', 40.00, 'HORA', '2026-12-01', '2026-12-31', 'Fins de tarde', 'Jardim das Nações', 2, 'ABERTA', 24, 7, 14);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (103, 'Caseiro de chácara', 'Cuidar da casa, do gramado, das galinhas e receber a família nos fins de semana.',
        'FIXO', 1800.00, 'MES', NULL, NULL, 'Moradia na chácara, folga aos domingos', 'Zona rural', 1, 'ABERTA', 25, 2, 3);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (104, 'Faxina antes das férias', 'Faxina completa da casa da chácara antes da chegada da família.',
        'BICO', 180.00, 'TOTAL', '2026-12-18', '2026-12-18', 'Das 8h às 16h', 'Zona rural', 1, 'ABERTA', 25, 2, 5);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (105, 'Limpeza da piscina e do pomar', 'Limpar a piscina, podar as frutíferas e roçar em volta do lago.',
        'BICO', 400.00, 'TOTAL', '2026-12-12', '2026-12-13', 'Das 7h às 17h', 'Zona rural', 2, 'ABERTA', 25, 2, 9);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (106, 'Babá para as férias', 'Cuidar de duas crianças (5 e 8 anos) durante as férias na chácara.',
        'TEMPORARIO', 150.00, 'DIA', '2026-12-26', '2027-01-15', 'Das 8h às 18h', 'Zona rural', 1, 'ABERTA', 25, 2, 6);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (107, 'Equipe da Festa do Pinhão', 'Atendimento nas barracas, organização de filas e limpeza durante a festa.',
        'TEMPORARIO', 130.00, 'DIA', '2027-06-01', '2027-06-30', 'Das 16h às 23h', 'Vila Abernéssia', 10, 'ABERTA', 26, 1, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (108, 'Montagem das barracas da festa', 'Montar as barracas, a iluminação e o palco antes da abertura.',
        'BICO', 200.00, 'TOTAL', '2027-05-28', '2027-05-30', 'Das 7h às 18h', 'Vila Abernéssia', 6, 'ABERTA', 26, 1, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (109, 'Apoio na cantata de Natal', 'Organizar cadeiras, distribuir programas e orientar o público na praça.',
        'BICO', 150.00, 'TOTAL', '2026-12-20', '2026-12-20', 'Das 15h às 23h', 'Vila Abernéssia', 4, 'ABERTA', 26, 1, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (110, 'Auxiliar de produção cultural', 'Controle de expositores, planilhas e contato com fornecedores da festa.',
        'TEMPORARIO', 1600.00, 'MES', '2027-04-01', '2027-06-30', 'Segunda a sexta, das 13h às 18h', 'Vila Abernéssia', 1, 'ABERTA', 26, 1, 12);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (111, 'Mecânico de automóveis', 'Manutenção de suspensão, freios e motor. Experiência comprovada.',
        'FIXO', 2400.00, 'MES', NULL, NULL, 'Segunda a sexta, das 8h às 18h', 'Araretama', 1, 'ABERTA', 27, 6, 14);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (112, 'Borracheiro', 'Conserto e troca de pneus, balanceamento e atendimento no balcão.',
        'FIXO', 1700.00, 'MES', NULL, NULL, 'Segunda a sábado, das 8h às 17h', 'Araretama', 1, 'ABERTA', 27, 6, 14);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (113, 'Aprendiz de mecânico', 'Para quem quer aprender a profissão. Jovem de 16 a 22 anos.',
        'FIXO', 1300.00, 'MES', NULL, NULL, 'Segunda a sexta, das 8h às 14h', 'Araretama', 1, 'ABERTA', 27, 6, 14);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (114, 'Jardineiro paisagista', 'Manutenção de jardins de casas e pousadas atendidas pela floricultura.',
        'FIXO', 2000.00, 'MES', NULL, NULL, 'Segunda a sexta, das 7h às 16h', 'Jaguaribe', 2, 'ABERTA', 28, 1, 9);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (115, 'Atendente de floricultura', 'Montar arranjos simples, atender clientes e cuidar das plantas da loja.',
        'FIXO', 1700.00, 'MES', NULL, NULL, 'Terça a domingo, das 9h às 18h', 'Capivari', 1, 'ABERTA', 28, 1, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (116, 'Plantio de jardim de pousada', 'Preparar a terra e plantar o jardim novo de uma pousada.',
        'BICO', 160.00, 'DIA', '2026-12-07', '2026-12-11', 'Das 7h às 16h', 'Descansópolis', 2, 'ABERTA', 28, 1, 9);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (117, 'Decoração floral de casamento', 'Ajudar a montar a decoração de flores de um casamento ao ar livre.',
        'BICO', 180.00, 'TOTAL', '2027-01-30', '2027-01-30', 'Das 8h às 16h', 'Capivari', 2, 'ABERTA', 28, 1, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (118, 'Cozinheira em casa de família', 'Fazer almoço e jantar para um casal de idosos.',
        'FIXO', 1700.00, 'MES', NULL, NULL, 'Segunda a sexta, das 8h às 16h', 'Quiririm', 1, 'ABERTA', 5, 7, 5);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (119, 'Ajudante de colheita de milho', 'Colheita manual de milho na propriedade de Monteiro Lobato.',
        'TEMPORARIO', 110.00, 'DIA', '2027-03-01', '2027-04-15', 'Das 6h às 14h', 'Zona rural', 2, 'ABERTA', 3, 4, 3);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (120, 'Copeiro para festa de 15 anos', 'Servir bebidas e repor o buffet em uma festa para 120 convidados.',
        'BICO', 220.00, 'TOTAL', '2026-12-12', '2026-12-12', 'Das 15h às 23h', 'Centro', 3, 'ABERTA', 4, 2, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (121, 'Vendedor para temporada de inverno', 'Vendas na loja de chocolates durante julho, o mês mais movimentado.',
        'TEMPORARIO', 1800.00, 'MES', '2027-06-01', '2027-07-31', 'Das 12h às 20h', 'Capivari', 2, 'ABERTA', 2, 1, 1);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (122, 'Limpeza de calhas e telhado', 'Limpar as calhas e trocar algumas telhas quebradas da pousada.',
        'BICO', 250.00, 'TOTAL', '2026-11-21', '2026-11-22', 'Das 8h às 17h', 'Capivari', 1, 'ABERTA', 1, 1, 9);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (123, 'Professor de inglês para adultos', 'Turma de inglês para iniciantes na unidade de Pindamonhangaba.',
        'FIXO', 50.00, 'HORA', NULL, NULL, 'Segundas e quartas, das 18h às 20h', 'Centro', 1, 'ABERTA', 12, 6, 13);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (124, 'Auxiliar de compras e estoque', 'Fazer pedidos aos fornecedores e controlar o estoque no sistema.',
        'FIXO', 2100.00, 'MES', NULL, NULL, 'Segunda a sexta, das 8h às 17h', 'Vila Abernéssia', 1, 'ABERTA', 7, 1, 12);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (125, 'Ajudante de padeiro em Tremembé', 'Ajudar na produção da nossa nova unidade em Tremembé.',
        'FIXO', 1800.00, 'MES', NULL, NULL, 'Segunda a sábado, das 5h às 13h', 'Centro', 1, 'ABERTA', 19, 8, 7);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (126, 'Frete de carga para Sapucaí-Mirim', 'Levar carga de material de construção até Sapucaí-Mirim e ajudar a descarregar.',
        'BICO', 300.00, 'TOTAL', '2026-12-09', '2026-12-09', 'Das 6h às 16h', 'Centro', 1, 'ABERTA', 16, 5, 10);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (127, 'Garçom para festa de Halloween', 'Reforço na festa temática do restaurante.',
        'BICO', 170.00, 'TOTAL', '2026-10-31', '2026-10-31', 'Das 18h às 2h', 'Capivari', 2, 'FECHADA', 6, 1, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (128, 'Colhedor de morango (safra 2026)', 'Colheita da safra de inverno.',
        'TEMPORARIO', 115.00, 'DIA', '2026-08-01', '2026-10-15', 'Das 6h às 14h', 'Quilombo', 4, 'FECHADA', 11, 3, 3);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (129, 'Equipe da Festa do Pinhão 2026', 'Atendimento nas barracas da festa de 2026.',
        'TEMPORARIO', 120.00, 'DIA', '2026-06-01', '2026-06-30', 'Das 16h às 23h', 'Vila Abernéssia', 8, 'FECHADA', 26, 1, 8);

INSERT INTO VAGA (id_vaga, titulo, descricao, tipo_vaga, valor, periodo_pagamento, data_inicio, data_fim, horario, bairro, quantidade, status_vaga, id_empregador, id_cidade, id_categoria)
VALUES (130, 'Penteado para casamento', 'Penteado da noiva e das madrinhas.',
        'BICO', 250.00, 'TOTAL', '2026-11-07', '2026-11-07', 'Das 6h às 12h', 'Jaguaribe', 1, 'FECHADA', 13, 1, 11);

-- ---------- Candidaturas ----------
INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (1, 1, 1, 'ENVIADA', NULL, '2026-11-10', NULL);

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (2, 1, 6, 'ACEITA', 'Pode vir conversar na loja segunda às 10h.', '2026-11-11', '2026-11-14');

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (3, 1, 5, 'ACEITA', 'Bem-vinda à equipe do festival!', '2026-06-20', '2026-06-25');

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (4, 3, 13, 'ACEITA', 'Chegar às 15h30 com roupa social preta.', '2026-11-12', '2026-11-16');

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (5, 3, 15, 'ENVIADA', NULL, '2026-11-15', NULL);

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (6, 3, 3, 'ENVIADA', NULL, '2026-11-16', NULL);

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (7, 2, 4, 'ENVIADA', NULL, '2026-11-13', NULL);

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (8, 2, 14, 'ACEITA', 'Te espero às 8h no salão.', '2026-11-12', '2026-11-15');

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (9, 4, 16, 'ACEITA', 'Fechado. Começamos segunda às 7h.', '2026-11-12', '2026-11-15');

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (10, 4, 9, 'ENVIADA', NULL, '2026-11-16', NULL);

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (11, 5, 19, 'RECUSADA', 'Preciso de alguém com experiência em cuidado noturno. Obrigado!', '2026-11-10', '2026-11-13');

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (12, 5, 20, 'ENVIADA', NULL, '2026-11-14', NULL);

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (13, 6, 10, 'ENVIADA', NULL, '2026-11-11', NULL);

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (14, 6, 12, 'CANCELADA', NULL, '2026-11-09', '2026-11-12');

INSERT INTO CANDIDATURA (id_candidatura, id_trabalhador, id_vaga, status_candidatura, mensagem, data_candidatura, data_resposta)
VALUES (15, 6, 11, 'ENVIADA', NULL, '2026-11-12', NULL);


-- =====================================================================
-- 3. CONSULTAS (perguntas que o sistema responde)
-- =====================================================================

-- 3.1 Quais vagas estão abertas, de quem são e onde?
SELECT v.id_vaga,
       v.titulo,
       v.tipo_vaga,
       v.valor,
       v.periodo_pagamento,
       c.nome AS cidade,
       cat.nome AS categoria,
       COALESCE(e.nome_negocio, e.nome) AS empregador
FROM VAGA v
JOIN CIDADE c ON c.id_cidade = v.id_cidade
JOIN CATEGORIA cat ON cat.id_categoria = v.id_categoria
JOIN EMPREGADOR e ON e.id_empregador = v.id_empregador
WHERE v.status_vaga = 'ABERTA'
ORDER BY c.nome, v.titulo;

-- 3.2 Quais vagas abertas combinam com as cidades em que a Ana (id 1) aceita trabalhar?
SELECT v.titulo,
       c.nome AS cidade,
       v.tipo_vaga,
       v.valor,
       v.periodo_pagamento,
       v.data_inicio,
       v.data_fim
FROM VAGA v
JOIN TRABALHADOR_CIDADE tc ON tc.id_cidade = v.id_cidade
JOIN CIDADE c ON c.id_cidade = v.id_cidade
WHERE tc.id_trabalhador = 1
  AND v.status_vaga = 'ABERTA'
ORDER BY v.tipo_vaga, v.valor DESC;

-- 3.3 Quem se candidatou às vagas da Pousada Serra Azul (empregador 1) e em que situação está?
SELECT v.titulo,
       t.nome AS trabalhador,
       t.username,
       ct.nome AS mora_em,
       ca.status_candidatura,
       ca.data_candidatura
FROM CANDIDATURA ca
JOIN VAGA v ON v.id_vaga = ca.id_vaga
JOIN TRABALHADOR t ON t.id_trabalhador = ca.id_trabalhador
JOIN CIDADE ct ON ct.id_cidade = t.id_cidade
WHERE v.id_empregador = 1
ORDER BY v.titulo, ca.data_candidatura;

-- 3.4 Quantas vagas abertas existem em cada cidade? (inclui cidades sem vaga)
SELECT c.nome AS cidade,
       c.uf,
       COUNT(v.id_vaga) AS vagas_abertas
FROM CIDADE c
LEFT JOIN VAGA v ON v.id_cidade = c.id_cidade AND v.status_vaga = 'ABERTA'
GROUP BY c.nome, c.uf
ORDER BY vagas_abertas DESC, c.nome;

-- 3.5 Quantos lugares ainda restam em cada vaga aberta? (quantidade - aceitos)
SELECT v.titulo,
       v.quantidade,
       COUNT(ca.id_candidatura) AS aceitos,
       v.quantidade - COUNT(ca.id_candidatura) AS restantes
FROM VAGA v
LEFT JOIN CANDIDATURA ca ON ca.id_vaga = v.id_vaga AND ca.status_candidatura = 'ACEITA'
WHERE v.status_vaga = 'ABERTA'
GROUP BY v.id_vaga, v.titulo, v.quantidade
ORDER BY restantes DESC, v.titulo;

-- 3.6 Quais categorias têm mais vagas e qual o valor médio pago por dia?
SELECT cat.nome AS categoria,
       COUNT(v.id_vaga) AS total_vagas,
       AVG(CASE WHEN v.periodo_pagamento = 'DIA' THEN v.valor END) AS media_por_dia
FROM CATEGORIA cat
LEFT JOIN VAGA v ON v.id_categoria = cat.id_categoria
GROUP BY cat.nome
ORDER BY total_vagas DESC, cat.nome;
