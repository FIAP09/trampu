-- SQLite 3.37 ou superior. Execute uma vez em um banco vazio.
PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

CREATE TABLE usuario (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL CHECK (length(trim(nome)) > 0),
    email TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (email LIKE '%_@_%._%'),
    telefone TEXT,
    cidade TEXT NOT NULL CHECK (length(trim(cidade)) > 0),
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('trabalhador','contratante'))
) STRICT;

CREATE TABLE categoria (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE CHECK (length(trim(nome)) > 0)
) STRICT;

CREATE TABLE oportunidade (
    id INTEGER PRIMARY KEY,
    contratante_id INTEGER NOT NULL REFERENCES usuario(id),
    categoria_id INTEGER NOT NULL REFERENCES categoria(id),
    titulo TEXT NOT NULL CHECK (length(trim(titulo)) > 0),
    descricao TEXT NOT NULL CHECK (length(trim(descricao)) > 0),
    cidade TEXT NOT NULL CHECK (length(trim(cidade)) > 0),
    local_servico TEXT NOT NULL CHECK (length(trim(local_servico)) > 0),
    data_servico TEXT NOT NULL CHECK (date(data_servico,'+0 days') IS data_servico),
    inicio TEXT NOT NULL CHECK (inicio GLOB '[0-2][0-9]:[0-5][0-9]' AND inicio < '24:00'),
    fim TEXT NOT NULL CHECK (fim GLOB '[0-2][0-9]:[0-5][0-9]' AND fim < '24:00' AND fim > inicio),
    remuneracao_centavos INTEGER NOT NULL CHECK (remuneracao_centavos > 0),
    quantidade_vagas INTEGER NOT NULL CHECK (quantidade_vagas > 0),
    requisitos TEXT,
    concluida INTEGER NOT NULL DEFAULT 0 CHECK (concluida IN (0,1))
) STRICT;

CREATE TABLE candidatura (
    id INTEGER PRIMARY KEY,
    trabalhador_id INTEGER NOT NULL REFERENCES usuario(id),
    oportunidade_id INTEGER NOT NULL REFERENCES oportunidade(id),
    data_candidatura TEXT NOT NULL DEFAULT CURRENT_DATE CHECK (date(data_candidatura,'+0 days') IS data_candidatura),
    status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente','Aprovada','Rejeitada')),
    UNIQUE (trabalhador_id,oportunidade_id)
) STRICT;

CREATE TABLE avaliacao (
    id INTEGER PRIMARY KEY,
    candidatura_id INTEGER NOT NULL REFERENCES candidatura(id),
    autor_id INTEGER NOT NULL REFERENCES usuario(id),
    nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT CHECK (length(comentario) <= 350),
    UNIQUE (candidatura_id,autor_id)
) STRICT;

-- O estado público é calculado das aprovações e da conclusão.
CREATE VIEW painel_oportunidade AS
SELECT o.*, count(c.id) AS aprovadas,
       CASE WHEN o.concluida = 1 THEN 'Concluída'
            WHEN count(c.id) = o.quantidade_vagas THEN 'Preenchida'
            ELSE 'Aberta' END AS status
FROM oportunidade o
LEFT JOIN candidatura c ON c.oportunidade_id=o.id AND c.status='Aprovada'
GROUP BY o.id;

-- Carga histórica e anúncios futuros fictícios, relativos ao dia da demonstração.
INSERT INTO usuario VALUES
(1,'Casa do Largo','casa@example.org',NULL,'Itu','contratante'),
(2,'Quintal Eventos','quintal@example.org',NULL,'Itu','contratante'),
(3,'Flora Jardins','flora@example.org',NULL,'Salto','contratante'),
(4,'Joana Lima','joana@example.org',NULL,'Itu','trabalhador'),
(5,'Caio Alves','caio@example.org',NULL,'Salto','trabalhador');
INSERT INTO categoria VALUES (1,'Alimentação'),(2,'Eventos'),(3,'Limpeza'),(4,'Jardinagem'),(5,'Comércio'),(6,'Serviços gerais');
INSERT INTO oportunidade VALUES
(1,1,1,'Atendente de salão','Apoio no jantar','Itu','Casa do Largo · Centro',date('now','localtime','+3 days'),'17:00','22:00',15000,3,'Atendimento ao público.',0),
(2,2,2,'Apoio em evento cultural','Orientação na entrada do evento','Itu','Espaço Quintal',date('now','localtime','+4 days'),'14:00','20:00',18000,2,'Comunicação.',0),
(3,3,4,'Auxiliar de jardinagem','Plantio de mudas','Salto','Viveiro Flora',date('now','localtime','+2 days'),'08:00','13:00',13000,1,NULL,0),
(4,2,2,'Recepção de oficina','Recepção dos participantes','Itu','Espaço Quintal',date('now','localtime','-2 days'),'09:00','12:00',10000,1,NULL,1);
INSERT INTO candidatura VALUES
(1,4,4,date('now','localtime','-4 days'),'Aprovada'),
(2,4,2,date('now','localtime'),'Pendente'),
(3,5,3,date('now','localtime'),'Aprovada');
INSERT INTO avaliacao VALUES (1,1,2,5,'Recepção atenciosa e pontual.');

CREATE TRIGGER publicar BEFORE INSERT ON oportunidade BEGIN
    SELECT CASE WHEN (SELECT tipo_usuario FROM usuario WHERE id=NEW.contratante_id) <> 'contratante'
        THEN RAISE(ABORT,'Perfil de contratante obrigatório') END;
    SELECT CASE WHEN NEW.data_servico || ' ' || NEW.inicio <= strftime('%Y-%m-%d %H:%M','now','localtime') OR NEW.concluida <> 0
        THEN RAISE(ABORT,'Informe um serviço futuro em aberto') END;
END;

CREATE TRIGGER inscrever BEFORE INSERT ON candidatura BEGIN
    SELECT CASE WHEN (SELECT tipo_usuario FROM usuario WHERE id=NEW.trabalhador_id) <> 'trabalhador'
        THEN RAISE(ABORT,'Perfil de trabalhador obrigatório') END;
    SELECT CASE WHEN NEW.status <> 'Pendente' OR NOT EXISTS (
        SELECT 1 FROM painel_oportunidade WHERE id=NEW.oportunidade_id AND status='Aberta'
        AND data_servico || ' ' || inicio > strftime('%Y-%m-%d %H:%M','now','localtime'))
        THEN RAISE(ABORT,'Candidatura exige seleção aberta') END;
END;

CREATE TRIGGER decidir BEFORE UPDATE OF status ON candidatura BEGIN
    SELECT CASE WHEN OLD.status <> 'Pendente' OR NEW.status='Pendente'
        THEN RAISE(ABORT,'Decisão de candidatura inválida') END;
    SELECT CASE WHEN NEW.status='Aprovada' AND NOT EXISTS (
        SELECT 1 FROM painel_oportunidade WHERE id=OLD.oportunidade_id AND status='Aberta'
        AND data_servico || ' ' || inicio > strftime('%Y-%m-%d %H:%M','now','localtime'))
        THEN RAISE(ABORT,'Seleção encerrada ou vagas esgotadas') END;
END;

CREATE TRIGGER fechar_selecao AFTER UPDATE OF status ON candidatura
WHEN NEW.status='Aprovada' AND (SELECT status FROM painel_oportunidade WHERE id=NEW.oportunidade_id)='Preenchida'
BEGIN
    UPDATE candidatura SET status='Rejeitada' WHERE oportunidade_id=NEW.oportunidade_id AND status='Pendente';
END;

CREATE TRIGGER concluir BEFORE UPDATE OF concluida ON oportunidade
WHEN OLD.concluida<>0 OR NEW.concluida<>1 OR OLD.data_servico || ' ' || OLD.fim > strftime('%Y-%m-%d %H:%M','now','localtime')
BEGIN SELECT RAISE(ABORT,'Aguarde o fim do serviço para concluir'); END;
CREATE TRIGGER concluir_selecao AFTER UPDATE OF concluida ON oportunidade BEGIN
    UPDATE candidatura SET status='Rejeitada' WHERE oportunidade_id=NEW.id AND status='Pendente';
END;

CREATE TRIGGER avaliar BEFORE INSERT ON avaliacao
WHEN NOT EXISTS (SELECT 1 FROM candidatura c JOIN oportunidade o ON o.id=c.oportunidade_id
    WHERE c.id=NEW.candidatura_id AND c.status='Aprovada' AND o.concluida=1
    AND NEW.autor_id IN (c.trabalhador_id,o.contratante_id))
BEGIN SELECT RAISE(ABORT,'Avaliação exige participação em serviço concluído'); END;

-- Os vínculos identificam as partes e o serviço ao longo de todo o histórico.
CREATE TRIGGER papel_fixo BEFORE UPDATE OF tipo_usuario ON usuario
BEGIN SELECT RAISE(ABORT,'O papel pertence ao perfil cadastrado'); END;
CREATE TRIGGER vinculo_fixo BEFORE UPDATE OF trabalhador_id,oportunidade_id ON candidatura
BEGIN SELECT RAISE(ABORT,'Vínculo de candidatura imutável'); END;
CREATE TRIGGER condicoes_fixas BEFORE UPDATE OF contratante_id,data_servico,inicio,fim,quantidade_vagas ON oportunidade
BEGIN SELECT RAISE(ABORT,'As condições da seleção pertencem à publicação original'); END;
CREATE TRIGGER avaliacao_fixa BEFORE UPDATE ON avaliacao
BEGIN SELECT RAISE(ABORT,'Avaliação já registrada'); END;
COMMIT;

-- Oferta por categoria, local e remuneração individual em reais.
SELECT p.titulo, u.nome AS contratante, k.nome AS categoria, p.cidade, p.data_servico,
       p.remuneracao_centavos/100.0 AS reais, p.quantidade_vagas-p.aprovadas AS vagas_livres
FROM painel_oportunidade p JOIN usuario u ON u.id=p.contratante_id JOIN categoria k ON k.id=p.categoria_id
WHERE p.status='Aberta' AND p.data_servico || ' ' || p.inicio > strftime('%Y-%m-%d %H:%M','now','localtime')
ORDER BY p.data_servico;

-- Painel de seleção, incluindo anúncios sem candidatura.
SELECT p.titulo, p.status, count(c.id) AS interessados, p.aprovadas
FROM painel_oportunidade p LEFT JOIN candidatura c ON c.oportunidade_id=p.id GROUP BY p.id;

-- Valor associado a participações concluídas. Pagamentos não são processados pelo protótipo.
SELECT u.nome, count(c.id) AS trabalhos_concluidos, sum(o.remuneracao_centavos)/100.0 AS reais_previstos
FROM candidatura c JOIN usuario u ON u.id=c.trabalhador_id JOIN oportunidade o ON o.id=c.oportunidade_id
WHERE c.status='Aprovada' AND o.concluida=1 GROUP BY u.id;
