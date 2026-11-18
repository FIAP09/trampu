# Trampu

**Seu próximo trampo está mais perto do que você imagina.**

Uma diária de jardinagem pode estar disponível a poucas quadras de quem procura trabalho. Quando a divulgação depende de indicações, essa pessoa pode nunca saber da oportunidade. O Trampu reúne serviços temporários por cidade, categoria, data e remuneração. Trabalhadores podem manifestar interesse e acompanhar a decisão. Pequenos negócios, famílias e organizadores podem formar equipes para um turno.

Projeto acadêmico da Global Solution FIAP 2026/2. O desafio CitizenTech orienta a proposta de partir de uma necessidade local e identificar quem se beneficia. Os critérios técnicos usados nesta entrega são os do enunciado fornecido pelo grupo. [Tema público da FIAP](https://experience.fiap.com.br/global-solution-citizen-tech)

## Abrir o protótipo

A partir da pasta **TRAMPU**, execute o comando abaixo em um terminal com Node.js e mantenha a janela aberta.

```sh
node servir.cjs
```

Acesse [Trampu no navegador](http://127.0.0.1:8080). O servidor entrega os arquivos estáticos da pasta web pela interface local, sem instalação de pacotes. Como alternativa, com Python 3, execute `python -m http.server 8080 --bind 127.0.0.1 --directory web` na mesma pasta. Use sempre a mesma origem para compartilhar as simulações entre páginas.

### Demonstração em dois perfis

1. Entre em **Meu perfil**. Escolha **Joana Lima** em **Usar um perfil existente**.
2. Em **Oportunidades**, filtre por **Salto** e **Jardinagem**. Abra **Auxiliar de jardinagem**, confira o valor individual e clique em **Candidatar-me**. No painel de Joana, a candidatura aparece como **Pendente**.
3. Abra uma segunda aba no mesmo endereço. Em **Trocar perfil de demonstração**, escolha **Flora Jardins**. No painel, abra **Ver candidatos** e aprove Joana. A única posição fica ocupada e a publicação passa a **Preenchida**. Volte ao painel de Joana para conferir a resposta.
4. Para experimentar a conclusão hoje, use **Quintal Eventos**. A publicação **Montagem de feira** representa um serviço de ontem com Joana já aprovada. Clique em **Concluir oportunidade**, abra os candidatos e avalie Joana. Ela pode ver a nota e avaliar a experiência em **Histórico e avaliações**.
5. Para começar do zero com uma nova oportunidade, crie um perfil de contratante e use **Publicar oportunidade**. Informe uma data e início futuros, o horário final do mesmo dia, o valor por pessoa e o número de vagas. A nova publicação entra na busca imediatamente.

As datas iniciais são relativas à primeira abertura. Dados de exemplo, perfis criados, inscrições e avaliações ficam no `localStorage` dessa origem. Cada aba guarda o perfil demonstrativo em `sessionStorage`. Para uma nova demonstração com datas atualizadas, use uma janela privada nova. As avaliações de exemplo são fictícias.

## Arquitetura

| Parte | Entrada e dados | Responsabilidade |
|---|---|---|
| Web | Sete páginas HTML, CSS e JS puro. Arrays de objetos persistidos no navegador | Busca combinada, detalhes, cadastro, publicação, recomendações, candidatura, seleção, conclusão e avaliação bilateral |
| Java | Menu de terminal, três classes de domínio e listas em memória | Cadastro, listagem, busca, atualização e remoção de publicação, seleção e validações |
| Banco | Um script SQLite, cinco tabelas e uma visão | Integridade dos vínculos, unicidade, restrições, carga de demonstração e consultas com JOIN |
| Pitch | Roteiro cronometrado com o protótipo em uso | Explicar o problema, demonstrar a solução e apresentar indicadores propostos |

O campo **remuneração** representa o total combinado por pessoa pelo serviço. A web exibe reais, o Java usa BigDecimal e o banco armazena centavos inteiros. “Preenchida” indica que as posições foram ocupadas. “Concluída” indica que o contratante encerrou o serviço após o horário final. Candidaturas anteriores continuam acessíveis no histórico.

O planejamento contém personas, casos de uso, regras e limites do MVP. Os diagramas em SVG abrem diretamente no navegador e podem ser ampliados durante o pitch. [Planejamento](PLANEJAMENTO.md) · [Classes Java](diagramas/uml/classes.svg) · [DER](diagramas/der/relacionamentos.svg)

## Console Java

Requisito de execução testado: JDK 17. Em PowerShell, na pasta **TRAMPU**:

```powershell
$fontes = (Get-ChildItem java/src -Recurse -Filter '*.java').FullName
javac -encoding UTF-8 -d java/out $fontes
java -D"file.encoding=UTF-8" -cp java/out main.Menu
```

Em Linux ou macOS:

```sh
javac -encoding UTF-8 -d java/out java/src/model/*.java java/src/service/*.java java/src/main/*.java
java -Dfile.encoding=UTF-8 -cp java/out main.Menu
```

O menu inicia com **Casa do Largo** (contratante 1), **Joana Lima** (trabalhadora 2) e **Atendente de salão** (oportunidade 1). Use **4** para listar anúncios, **8** para candidatar Joana, **10** para decidir como contratante e **9** para conferir. A busca aceita trecho do título, cidade ou categoria. A atualização e a remoção exigem anúncio aberto do próprio contratante, ainda sem candidaturas. O encerramento do console descarta as listas.

## Banco SQLite

Use SQLite 3.37 ou superior com suporte a tabelas STRICT. Em uma pasta **TRAMPU** com um banco de destino novo, abra o console:

```sh
sqlite3 trampu-demo.db
```

Em seguida, execute dentro do SQLite:

```text
.bail on
.headers on
.mode column
.read banco/trampu.sql
```

O script ativa chaves estrangeiras, cria as tabelas em transação, carrega os exemplos e imprime três consultas. Ative `PRAGMA foreign_keys = ON` a cada nova conexão que faça alterações. Os gatilhos validam papel, datas, capacidade e participação. A identificação de quem executa uma decisão pertence à camada de aplicação. A base acadêmica é administrada localmente.

Para repetir a verificação do script sem instalar a CLI, o comando abaixo usa o SQLite incluído no **Node 24** e um banco temporário em memória. O mesmo arquivo exercita as regras de negócio da web.

```sh
node verificacao/regras.cjs
```

## CitizenTech e indicadores propostos

| Objetivo | Como o Trampu pode contribuir | Como verificar em um piloto |
|---|---|---|
| ODS 8 · Trabalho decente e crescimento econômico | Exibir o valor e as condições antes da candidatura ajuda a decidir se o turno compensa. | Contar participações aprovadas em serviços concluídos. Somar o valor previsto por participação e distinguir esse montante de pagamentos comprovados. |
| ODS 10 · Redução das desigualdades | Qualquer pessoa pode consultar vagas da cidade antes de criar perfil e sem indicação prévia. | Por cidade, contar trabalhadores cadastrados e trabalhadores distintos que concluíram ao menos um serviço. Comparar o alcance e ouvir quem não conseguiu se candidatar. |
| ODS 9 · Indústria, inovação e infraestrutura | Um catálogo digital local dá a pequenos contratantes uma forma de divulgar serviços e organizar a seleção. | Contar publicações por cidade e calcular a parcela que alcança todas as posições. Em um piloto, registrar o instante de publicação e da última aprovação para medir o tempo de preenchimento. |

Use o mesmo período de observação ao comparar cidades. Para a taxa de preenchimento, divida o número de anúncios da coorte que atingiram a capacidade pelo total de anúncios publicados na coorte. Os dados incluídos demonstram o cálculo e o fluxo. Os resultados sociais dependem de um piloto com participantes reais. [ONU Brasil · ODS 8](https://brasil.un.org/pt-br/sdgs/08) · [ODS 10](https://brasil.un.org/pt-br/sdgs/10) · [ODS 9](https://brasil.un.org/pt-br/sdgs/9)

## Privacidade, acesso e responsabilidade

- O protótipo pede dados fictícios. O telefone é opcional. Os cards e as listas de candidatos ocultam telefone e e-mail. A publicação pede um ponto de encontro e orienta a evitar endereço residencial.
- A troca livre de perfil serve à encenação acadêmica. Quem tem acesso ao navegador pode acessar o armazenamento. Um serviço real precisaria de autenticação, autorização no servidor, política de retenção e meios para exercer os direitos sobre os dados. A minimização da coleta segue o princípio da necessidade. [Orientação da ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_lgpd_final.pdf)
- O site oferece rótulos de campos, navegação por teclado, atalho para o conteúdo, foco visível, mensagens textuais e uma composição adaptável ao celular. A experiência de pessoas com baixa familiaridade digital é uma hipótese a validar com o público.
- Em um piloto, uma denúncia registraria o anúncio, o motivo e o relato em um canal privado. Uma equipe avaliaria o caso, suspenderia ofertas fraudulentas quando necessário e comunicaria a decisão. Esse fluxo é planejado. As avaliações da demonstração usam linguagem respeitosa e descrevem a experiência do serviço.
- A seleção deve se apoiar nos requisitos do serviço. Uma implantação precisa prever moderação de discriminação e análise das condições reais da prestação de trabalho. A plataforma não determina a natureza jurídica do vínculo.

## Conferência da entrega

| Item do enunciado | Verificação realizada |
|---|---|
| Java POO · 6 pontos possíveis | Compilação com JDK 17 e execução do menu. Exercitados entrada inválida, cadastro, listagem, publicação, busca, atualização, remoção, duplicidade, aprovação da última vaga e rejeição das pendências. |
| Banco de dados · 4 pontos possíveis | Script executado integralmente em SQLite em memória. Verificados integridade, chaves estrangeiras, estados da visão e bloqueios de inscrições e avaliações inválidas. |
| Protótipo web · 5 pontos possíveis | No Edge, busca com filtros de cidade, categoria, valor e data. Testados cadastro inválido e válido, publicação, candidatura, aprovação, conclusão de exemplo histórico e avaliação bilateral. A página inicial, resultados, cadastro, detalhes e painel do trabalhador foram verificados a 360 px de largura. |
| Pitch · 5 pontos possíveis | Roteiro com marcações de 0:00 a 3:00, fala e sequência de telas. Gravação, publicação e link público dependem do grupo. |

O teste do navegador usou perfis fictícios. Não foi realizado estudo com usuários. A distribuição de pontos acima reproduz o enunciado e não representa nota concedida.
