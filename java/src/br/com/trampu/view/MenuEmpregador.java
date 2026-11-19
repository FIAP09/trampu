package br.com.trampu.view;

import br.com.trampu.model.Candidatura;
import br.com.trampu.model.Categoria;
import br.com.trampu.model.Cidade;
import br.com.trampu.model.Empregador;
import br.com.trampu.model.PeriodoPagamento;
import br.com.trampu.model.TipoVaga;
import br.com.trampu.model.Trabalhador;
import br.com.trampu.model.Vaga;
import br.com.trampu.service.CandidaturaService;
import br.com.trampu.service.CatalogoService;
import br.com.trampu.service.RegraNegocioException;
import br.com.trampu.service.UsuarioService;
import br.com.trampu.service.VagaService;

import java.time.LocalDate;
import java.util.List;

public class MenuEmpregador {

    private final Console console;
    private final CatalogoService catalogo;
    private final UsuarioService usuarioService;
    private final VagaService vagaService;
    private final CandidaturaService candidaturaService;

    public MenuEmpregador(Console console, CatalogoService catalogo, UsuarioService usuarioService,
                          VagaService vagaService, CandidaturaService candidaturaService) {
        this.console = console;
        this.catalogo = catalogo;
        this.usuarioService = usuarioService;
        this.vagaService = vagaService;
        this.candidaturaService = candidaturaService;
    }

    public void abrir(Empregador e) {
        while (true) {
            int pendentes = candidaturaService.listarPendentesDoEmpregador(e).size();
            console.titulo("EMPREGADOR · @" + e.getUsername());
            console.info("1) Publicar vaga");
            console.info("2) Minhas vagas");
            console.info("3) Ver vaga e candidatos");
            console.info("4) Editar vaga");
            console.info("5) Fechar vaga");
            console.info("6) Remover vaga");
            console.info("7) Responder candidaturas" + (pendentes > 0 ? "  (" + pendentes + " aguardando)" : ""));
            console.info("8) Encontrar trabalhadores por cidade");
            console.info("9) Meu perfil");
            console.info("0) Sair da conta");
            int opcao = console.lerInteiro("Escolha", 0, 9);

            try {
                switch (opcao) {
                    case 1 -> publicar(e);
                    case 2 -> minhasVagas(e);
                    case 3 -> verVaga(e);
                    case 4 -> editar(e);
                    case 5 -> fechar(e);
                    case 6 -> remover(e);
                    case 7 -> responderCandidaturas(e);
                    case 8 -> encontrarTrabalhadores();
                    case 9 -> meuPerfil(e);
                    case 0 -> {
                        console.info("Você saiu da conta.");
                        return;
                    }
                    default -> console.erro("Opção inválida.");
                }
            } catch (RegraNegocioException ex) {
                console.erro(ex.getMessage());
                console.pausar();
            }
        }
    }

    // ------------------------------------------------------------------
    // CRUD de vagas
    // ------------------------------------------------------------------

    private void publicar(Empregador e) {
        console.titulo("PUBLICAR VAGA");
        String titulo = console.lerTexto("Título (ex.: Garçom para casamento)");
        String descricao = console.lerTexto("Descrição do trabalho");

        console.secao("Tipo de vaga");
        console.info("  1) Fixo ........ emprego contínuo, sem data para acabar");
        console.info("  2) Temporário .. período definido (ex.: temporada de inverno)");
        console.info("  3) Bico ........ um ou poucos dias (ex.: diarista no sábado)");
        TipoVaga tipo = TipoVaga.values()[console.lerInteiro("Tipo", 1, 3) - 1];

        LocalDate inicio = null;
        LocalDate fim = null;
        if (tipo.exigeDatas()) {
            console.secao("Quando?");
            while (true) {
                inicio = console.lerData("Data de início");
                if (!inicio.isBefore(LocalDate.now())) {
                    break;
                }
                console.erro("A data de início não pode estar no passado.");
            }
            while (true) {
                fim = console.lerData(tipo == TipoVaga.BICO ? "Último dia (igual ao início se for 1 dia)" : "Data de fim");
                if (!fim.isBefore(inicio)) {
                    break;
                }
                console.erro("O fim não pode ser antes do início (" + Exibicao.data(inicio) + ").");
            }
        }

        console.secao("Pagamento");
        double valor = console.lerValor("Valor");
        PeriodoPagamento periodo = escolherPeriodo(null);

        console.secao("Detalhes");
        int quantidade = console.lerInteiro("Quantas pessoas você precisa", 1, 500);
        String horario = console.lerOpcional("Horário (ex.: seg a sex, 7h às 16h)");
        Cidade cidade = console.escolher("Cidade do trabalho", catalogo.listarCidades());
        String bairro = console.lerOpcional("Bairro ou local (ex.: Centro, Zona rural)");
        Categoria categoria = escolherCategoria();

        Vaga v = vagaService.publicar(e, titulo, descricao, tipo, valor, periodo, inicio, fim, horario, bairro,
                quantidade, cidade, categoria);
        console.sucesso("Vaga #" + v.getId() + " publicada!");
        Exibicao.detalhes(v, vagaService.lugaresRestantes(v));
        console.pausar();
    }

    private void minhasVagas(Empregador e) {
        console.titulo("MINHAS VAGAS");
        List<Vaga> vagas = vagaService.listarPorEmpregador(e);
        if (vagas.isEmpty()) {
            console.info("Você ainda não publicou vagas.");
        }
        for (Vaga v : vagas) {
            int pendentes = 0;
            for (Candidatura c : candidaturaService.listarDaVaga(v)) {
                if (c.isPendente()) {
                    pendentes++;
                }
            }
            console.info(Exibicao.resumo(v));
            console.info("      " + vagaService.contarAceitos(v) + "/" + v.getQuantidade() + " preenchida(s) · "
                    + pendentes + " candidatura(s) aguardando");
        }
        console.pausar();
    }

    private void verVaga(Empregador e) {
        int id = console.lerInteiro("Número da vaga", 1, 99999);
        Vaga v = vagaService.buscarDoEmpregador(e, id);
        Exibicao.detalhes(v, vagaService.lugaresRestantes(v));

        console.secao("Candidatos");
        List<Candidatura> lista = candidaturaService.listarDaVaga(v);
        if (lista.isEmpty()) {
            console.info("Ninguém se candidatou ainda.");
        }
        for (Candidatura c : lista) {
            Exibicao.candidaturaDoEmpregador(c);
        }
        console.pausar();
    }

    private void editar(Empregador e) {
        int id = console.lerInteiro("Número da vaga para editar", 1, 99999);
        Vaga v = vagaService.buscarDoEmpregador(e, id);
        console.titulo("EDITAR VAGA #" + v.getId());
        console.info("Aperte Enter para manter o valor atual.\n");

        String titulo = console.lerOuManter("Título", v.getTitulo());
        String descricao = console.lerOuManter("Descrição", v.getDescricao());
        double valor = console.lerValorOuManter("Valor", v.getValor());
        PeriodoPagamento periodo = escolherPeriodo(v.getPeriodoPagamento());
        LocalDate inicio = null;
        LocalDate fim = null;
        if (v.getTipo().exigeDatas()) {
            inicio = console.lerDataOuManter("Data de início", v.getDataInicio());
            fim = console.lerDataOuManter("Data de fim", v.getDataFim());
        }
        String horario = console.lerOuManter("Horário", v.getHorario());
        String bairro = console.lerOuManter("Bairro", v.getBairro());
        Integer qtd = console.lerInteiroOpcional("Quantidade [" + v.getQuantidade() + "]", 1, 500);
        int quantidade = qtd == null ? v.getQuantidade() : qtd;

        vagaService.atualizar(e, v, titulo, descricao, valor, periodo, inicio, fim, horario, bairro, quantidade);
        console.sucesso("Vaga atualizada.");
        Exibicao.detalhes(v, vagaService.lugaresRestantes(v));
        console.pausar();
    }

    private void fechar(Empregador e) {
        int id = console.lerInteiro("Número da vaga para fechar", 1, 99999);
        Vaga v = vagaService.buscarDoEmpregador(e, id);
        console.info("Ao fechar, quem ainda aguarda resposta será avisado que a vaga encerrou.");
        if (console.confirmar("Fechar a vaga \"" + v.getTitulo() + "\"?")) {
            int recusadas = vagaService.fechar(e, v);
            console.sucesso("Vaga fechada. " + recusadas + " candidatura(s) pendente(s) foram encerradas.");
            console.pausar();
        }
    }

    private void remover(Empregador e) {
        int id = console.lerInteiro("Número da vaga para remover", 1, 99999);
        Vaga v = vagaService.buscarDoEmpregador(e, id);
        console.info("Remover apaga a vaga e as candidaturas dela. Esta ação não pode ser desfeita.");
        if (console.confirmar("Remover a vaga \"" + v.getTitulo() + "\"?")) {
            vagaService.remover(e, v);
            console.sucesso("Vaga removida.");
            console.pausar();
        }
    }

    // ------------------------------------------------------------------
    // Candidaturas: aceite e descarte
    // ------------------------------------------------------------------

    private void responderCandidaturas(Empregador e) {
        while (true) {
            console.titulo("CANDIDATURAS AGUARDANDO RESPOSTA");
            List<Candidatura> pendentes = candidaturaService.listarPendentesDoEmpregador(e);
            if (pendentes.isEmpty()) {
                console.info("Nenhuma candidatura aguardando. Tudo em dia!");
                console.pausar();
                return;
            }
            for (Candidatura c : pendentes) {
                Exibicao.candidaturaDoEmpregador(c);
            }

            Integer id = console.lerInteiroOpcional("\nNúmero da candidatura (Enter para voltar)", 1, 99999);
            if (id == null) {
                return;
            }
            try {
                Candidatura c = candidaturaService.buscarDoEmpregador(e, id);
                Exibicao.perfilPublico(c.getTrabalhador());
                console.info("\n1) Aceitar   2) Recusar   0) Voltar");
                int acao = console.lerInteiro("Escolha", 0, 2);
                if (acao == 1) {
                    String msg = console.lerOpcional("Mensagem para o trabalhador (ex.: chegar às 7h)");
                    boolean lotou = candidaturaService.aceitar(e, c, msg);
                    console.sucesso(c.getTrabalhador().getNome() + " foi aceito(a)! Contato: "
                            + Exibicao.telefone(c.getTrabalhador().getTelefone()) + " (WhatsApp)");
                    if (lotou) {
                        console.info("Todos os lugares foram preenchidos: a vaga foi fechada automaticamente.");
                    }
                } else if (acao == 2) {
                    String msg = console.lerOpcional("Mensagem para o trabalhador");
                    candidaturaService.recusar(e, c, msg);
                    console.sucesso("Candidatura recusada.");
                }
            } catch (RegraNegocioException ex) {
                console.erro(ex.getMessage());
            }
        }
    }

    // ------------------------------------------------------------------
    // Outros
    // ------------------------------------------------------------------

    private void encontrarTrabalhadores() {
        console.titulo("TRABALHADORES POR CIDADE");
        Cidade cidade = console.escolher("Cidade", catalogo.listarCidades());
        List<Trabalhador> lista = usuarioService.trabalhadoresQueAtuamEm(cidade);
        console.secao(lista.size() + " trabalhador(es) aceitam trabalhar em " + cidade);
        for (Trabalhador t : lista) {
            console.info("@" + t.getUsername() + " · " + t.getNome() + " · mora em " + t.getCidade()
                    + " · " + t.getDisponibilidade().getDescricao());
            if (t.getHabilidades() != null) {
                console.info("      " + t.getHabilidades());
            }
        }
        console.pausar();
    }

    private void meuPerfil(Empregador e) {
        console.titulo("MEU PERFIL");
        Exibicao.perfil(e);
        console.info("\n1) Editar telefone e descrição   2) Alterar senha   0) Voltar");
        int opcao = console.lerInteiro("Escolha", 0, 2);
        if (opcao == 1) {
            String tel = console.lerOuManter("Telefone", e.getTelefone());
            String desc = console.lerOuManter("Descrição", e.getDescricao());
            usuarioService.atualizarPerfil(e, tel, desc);
            console.sucesso("Perfil atualizado.");
        } else if (opcao == 2) {
            String atual = console.lerSenha("Senha atual");
            String nova = console.lerSenha("Nova senha (8+ caracteres, letras e números)");
            usuarioService.alterarSenha(e, atual, nova);
            console.sucesso("Senha alterada.");
        }
    }

    private PeriodoPagamento escolherPeriodo(PeriodoPagamento atual) {
        PeriodoPagamento[] opcoes = PeriodoPagamento.values();
        for (int i = 0; i < opcoes.length; i++) {
            console.info("  " + (i + 1) + ") " + opcoes[i].getDescricao());
        }
        if (atual == null) {
            return opcoes[console.lerInteiro("O valor é", 1, opcoes.length) - 1];
        }
        Integer escolha = console.lerInteiroOpcional("O valor é [" + atual.getDescricao() + "] (Enter mantém)",
                1, opcoes.length);
        return escolha == null ? atual : opcoes[escolha - 1];
    }

    private Categoria escolherCategoria() {
        List<Categoria> categorias = catalogo.listarCategorias();
        console.secao("Categoria");
        for (int i = 0; i < categorias.size(); i++) {
            Categoria c = categorias.get(i);
            console.info(String.format("  %2d) %-28s %s", i + 1, c.getNome(), c.getDescricao()));
        }
        return categorias.get(console.lerInteiro("Categoria", 1, categorias.size()) - 1);
    }
}
