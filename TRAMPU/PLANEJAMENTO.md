# Arquitetura e domínio do MVP

Em uma cidade pequena, um salão de festas pode precisar de reforço para sábado enquanto uma pessoa disponível no bairro sequer fica sabendo do serviço. O Trampu torna a oferta visível por cidade, data, categoria e valor. As personas a seguir são hipóteses de projeto.

| Persona | Situação e objetivo | Caso de uso principal |
|---|---|---|
| Joana, trabalhadora de eventos em Itu | Tem experiência, mas depende de indicações para conhecer vagas | Encontrar uma diária compatível, conferir as condições e acompanhar a seleção |
| Caio, organizador de eventos | Precisa montar uma equipe em poucos dias | Publicar o serviço, comparar habilidades, selecionar até o limite e avaliar quem participou |
| Rosa, contratante individual | Precisa de ajuda pontual em seu jardim | Descrever a tarefa em linguagem simples e divulgar apenas um ponto de encontro público |

## Limites e organização

O navegador, o console e a base SQL são três demonstrações independentes. A web concentra o fluxo completo com cadastro, descoberta, seleção, histórico e avaliação bilateral. O console exercita POO e CRUD sobre o núcleo de contratação. SQLite representa os relacionamentos e permite consultar o funil. Não há troca de dados entre as partes.

## Modelo compartilhado

- **Usuário** tem um único papel, trabalhador ou contratante. Cidade é pública no anúncio. Contato fica fora dos cards e da lista pública.
- **Categoria** classifica cada anúncio. Na web é uma opção de catálogo, no Java é texto selecionado do catálogo e no banco possui chave própria.
- **Oportunidade** tem um contratante, categoria, local do serviço, condições, valor por pessoa e número de vagas.
- **Candidatura** associa uma pessoa a um serviço uma única vez. Guarda a data e a decisão.
- **Avaliação** referencia uma candidatura aprovada em serviço concluído. Na web e no banco, cada uma das duas partes pode registrar sua própria nota de 1 a 5.
- O perfil web acrescenta região, habilidades e categorias de interesse para a recomendação. O console mantém apenas os campos necessários ao exercício de POO.

## Regras do ciclo

1. A publicação exige contratante, remuneração e capacidade positivas, data a partir de hoje e horário final posterior ao inicial no mesmo dia.
2. Somente trabalhador pode se candidatar a uma oportunidade aberta, antes de começar o serviço. Uma candidatura por pessoa e oportunidade.
3. Somente o dono da oportunidade decide sobre candidaturas pendentes. Aprovar a última vaga muda o estado de aberta para preenchida e rejeita as pendências restantes.
4. Depois do horário final, o contratante pode concluir o anúncio, mesmo com posições em aberto. Pendências viram rejeições. Apenas aprovações entram no histórico de trabalhos.
5. A pessoa selecionada vê a decisão no painel. A avaliação depende da conclusão e da participação.
6. No console, uma publicação sem candidatura pode ser corrigida ou removida. Decisões e vínculos já registrados preservam o histórico.

## Demonstração e evolução

A troca explícita de perfil permite encenar os dois lados no mesmo navegador. Dados e decisões são fictícios. Uma implantação real precisaria de autenticação, autorização no servidor, armazenamento protegido e atendimento de denúncias. A avaliação acadêmica se baseia nas funcionalidades demonstráveis e nas verificações técnicas registradas no README.
