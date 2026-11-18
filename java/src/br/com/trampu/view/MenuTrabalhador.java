package br.com.trampu.view;

import br.com.trampu.model.Candidatura;
import br.com.trampu.model.Categoria;
import br.com.trampu.model.Cidade;
import br.com.trampu.model.Disponibilidade;
import br.com.trampu.model.TipoVaga;
import br.com.trampu.model.Trabalhador;
import br.com.trampu.model.Vaga;
import br.com.trampu.service.CandidaturaService;
import br.com.trampu.service.CatalogoService;
import br.com.trampu.service.RegraNegocioException;
import br.com.trampu.service.UsuarioService;
import br.com.trampu.service.VagaService;

import java.util.List;

public class MenuTrabalhador {

    private final Console console;
    private final CatalogoService catalogo;
    private final UsuarioService usuarioService;
    private final VagaService vagaService;
    private final CandidaturaService candidaturaService;

    public MenuTrabalhador(Console console, CatalogoService catalogo, UsuarioService usuarioService,
                           VagaService vagaService, CandidaturaService candidaturaService) {
        this.console = console;
        this.catalogo = catalogo;
        this.usuarioService = usuarioService;
        this.vagaService = vagaService;
        this.candidaturaService = candidaturaService;
    }

    public void abrir(Trabalhador t) {
        while (true) {
            console.titulo("TRABALHADOR · @" + t.getUsername());
            console.info("1) Vagas para você (nas suas cidades)");
            console.info("2) Buscar vagas com filtros");
            console.info("3) Ver vaga e me candidatar");
            console.info("4) Minhas candidaturas");
            console.info("5) Meu perfil");
            console.info("0) Sair da conta");
            int opcao = console.lerInteiro("Escolha", 0, 5);

            try {
                switch (opcao) {
                    case 1 -> vagasParaMim(t);
                    case 2 -> buscarVagas(t);
                    case 3 -> verECandidatar(t, null);
                    case 4 -> minhasCandidaturas(t);
                    case 5 -> meuPerfil(t);
                    case 0 -> {
                        console.info("Você saiu da conta.");
                        return;
                    }
                    default -> console.erro("Opção inválida.");
                }
            } catch (RegraNegocioException e) {
                console.erro(e.getMessage());
                console.pausar();
            }
        }
    }

    private void vagasParaMim(Trabalhador t) {
        console.titulo("VAGAS NAS SUAS CIDADES");
        List<Vaga> vagas = vagaService.compativeisCom(t);
        Exibicao.listarVagas(vagas);
        oferecerCandidatura(t);
    }

    private void buscarVagas(Trabalhador t) {
        console.titulo("BUSCAR VAGAS");
        console.secao("Filtros (Enter para ignorar)");
        Cidade cidade = console.escolherOpcional("Cidade", catalogo.listarCidades());
        Categoria categoria = console.escolherOpcional("Categoria", catalogo.listarCategorias());
        TipoVaga tipo = MenuPrincipal.escolherTipoOpcional(console);
        String texto = console.lerOpcional("Palavra-chave (ex.: garçom)");

        console.secao("Resultado");
        Exibicao.listarVagas(vagaService.filtrar(cidade, categoria, tipo, texto));
        oferecerCandidatura(t);
    }

    private void oferecerCandidatura(Trabalhador t) {
        Integer id = console.lerInteiroOpcional("\nNúmero da vaga para ver detalhes (Enter para voltar)", 1, 99999);
        if (id != null) {
            verECandidatar(t, id);
        }
    }

    private void verECandidatar(Trabalhador t, Integer idInformado) {
        int id = idInformado != null ? idInformado : console.lerInteiro("Número da vaga", 1, 99999);
        Vaga v = vagaService.buscarPorId(id);
        Exibicao.detalhes(v, vagaService.lugaresRestantes(v));

        if (!v.isAberta()) {
            console.info("\nEsta vaga já foi encerrada.");
            console.pausar();
            return;
        }
        if (!t.atuaEm(v.getCidade())) {
            console.info("\nAtenção: " + v.getCidade() + " não está nas suas cidades de trabalho.");
        }
        if (console.confirmar("\nQuer se candidatar a esta vaga?")) {
            candidaturaService.candidatar(t, v);
            console.sucesso("Candidatura enviada! O empregador vai responder pela Trampu.");
            console.info("Quando ele aceitar, o telefone dele aparece em 'Minhas candidaturas'.");
            console.pausar();
        }
    }

    private void minhasCandidaturas(Trabalhador t) {
        console.titulo("MINHAS CANDIDATURAS");
        List<Candidatura> lista = candidaturaService.listarDoTrabalhador(t);
        if (lista.isEmpty()) {
            console.info("Você ainda não se candidatou a nenhuma vaga.");
            console.pausar();
            return;
        }
        for (Candidatura c : lista) {
            Exibicao.candidaturaDoTrabalhador(c);
        }

        Integer id = console.lerInteiroOpcional("\nNúmero da candidatura para CANCELAR (Enter para voltar)", 1, 99999);
        if (id != null) {
            Candidatura c = candidaturaService.buscarDoTrabalhador(t, id);
            if (console.confirmar("Cancelar a candidatura para \"" + c.getVaga().getTitulo() + "\"?")) {
                candidaturaService.cancelar(t, c);
                console.sucesso("Candidatura cancelada.");
                console.pausar();
            }
        }
    }

    // ------------------------------------------------------------------
    // Perfil
    // ------------------------------------------------------------------

    private void meuPerfil(Trabalhador t) {
        while (true) {
            console.titulo("MEU PERFIL");
            Exibicao.perfil(t);
            console.info("");
            console.info("1) Editar telefone e descrição");
            console.info("2) Editar habilidades e disponibilidade");
            console.info("3) Adicionar cidade de trabalho");
            console.info("4) Remover cidade de trabalho");
            console.info("5) Alterar senha");
            console.info("0) Voltar");
            int opcao = console.lerInteiro("Escolha", 0, 5);

            try {
                switch (opcao) {
                    case 1 -> {
                        String tel = console.lerOuManter("Telefone", t.getTelefone());
                        String desc = console.lerOuManter("Descrição", t.getDescricao());
                        usuarioService.atualizarPerfil(t, tel, desc);
                        console.sucesso("Perfil atualizado.");
                    }
                    case 2 -> {
                        String hab = console.lerOuManter("Habilidades", t.getHabilidades());
                        Disponibilidade[] opcoes = Disponibilidade.values();
                        for (int i = 0; i < opcoes.length; i++) {
                            console.info("  " + (i + 1) + ") " + opcoes[i].getDescricao());
                        }
                        Integer d = console.lerInteiroOpcional("Disponibilidade [" + t.getDisponibilidade().getDescricao()
                                + "] (Enter mantém)", 1, opcoes.length);
                        usuarioService.atualizarDadosTrabalhador(t, hab, d == null ? null : opcoes[d - 1]);
                        console.sucesso("Dados atualizados.");
                    }
                    case 3 -> {
                        Cidade c = console.escolher("Cidade para adicionar", catalogo.listarCidades());
                        usuarioService.adicionarCidadeAtuacao(t, c);
                        console.sucesso(c + " adicionada.");
                    }
                    case 4 -> {
                        Cidade c = console.escolher("Cidade para remover", t.getCidadesAtuacao());
                        usuarioService.removerCidadeAtuacao(t, c);
                        console.sucesso(c + " removida.");
                    }
                    case 5 -> {
                        String atual = console.lerSenha("Senha atual");
                        String nova = console.lerSenha("Nova senha (8+ caracteres, letras e números)");
                        usuarioService.alterarSenha(t, atual, nova);
                        console.sucesso("Senha alterada.");
                    }
                    case 0 -> {
                        return;
                    }
                    default -> console.erro("Opção inválida.");
                }
            } catch (RegraNegocioException e) {
                console.erro(e.getMessage());
            }
        }
    }
}
