package br.com.trampu.view;

import br.com.trampu.model.Categoria;
import br.com.trampu.model.Cidade;
import br.com.trampu.model.Disponibilidade;
import br.com.trampu.model.Empregador;
import br.com.trampu.model.TipoVaga;
import br.com.trampu.model.Trabalhador;
import br.com.trampu.model.Usuario;
import br.com.trampu.model.Vaga;
import br.com.trampu.service.CandidaturaService;
import br.com.trampu.service.CatalogoService;
import br.com.trampu.service.RegraNegocioException;
import br.com.trampu.service.UsuarioService;
import br.com.trampu.service.Validador;
import br.com.trampu.service.VagaService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** Tela inicial: entrar, criar conta (trabalhador ou empregador) e ver vagas sem login. */
public class MenuPrincipal {

    private final Console console;
    private final CatalogoService catalogo;
    private final UsuarioService usuarioService;
    private final VagaService vagaService;
    private final MenuTrabalhador menuTrabalhador;
    private final MenuEmpregador menuEmpregador;

    public MenuPrincipal(Console console, CatalogoService catalogo, UsuarioService usuarioService,
                         VagaService vagaService, CandidaturaService candidaturaService) {
        this.console = console;
        this.catalogo = catalogo;
        this.usuarioService = usuarioService;
        this.vagaService = vagaService;
        this.menuTrabalhador = new MenuTrabalhador(console, catalogo, usuarioService, vagaService, candidaturaService);
        this.menuEmpregador = new MenuEmpregador(console, catalogo, usuarioService, vagaService, candidaturaService);
    }

    public void iniciar() {
        console.info("");
        console.info("  TRAMPU · trabalho perto de você");
        console.info("  Vagas locais para cidades pequenas da Serra da Mantiqueira e do Vale do Paraíba");

        while (true) {
            console.titulo("MENU PRINCIPAL");
            console.info("1) Entrar");
            console.info("2) Criar conta de TRABALHADOR (quero trabalhar)");
            console.info("3) Criar conta de EMPREGADOR (quero contratar)");
            console.info("4) Ver vagas abertas (sem login)");
            console.info("0) Sair");
            int opcao = console.lerInteiro("Escolha", 0, 4);

            try {
                switch (opcao) {
                    case 1 -> entrar();
                    case 2 -> criarContaTrabalhador();
                    case 3 -> criarContaEmpregador();
                    case 4 -> verVagasSemLogin();
                    case 0 -> {
                        console.info("Até logo! Bom trampo.");
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

    private void entrar() {
        console.titulo("ENTRAR");
        console.info("Dica: todos os usuários de exemplo usam a senha Trampu@123");
        console.info("Ex.: anapaula (trabalhadora) ou pousadaserrazul (empregador)\n");
        String login = console.lerTexto("Username ou e-mail");
        String senha = console.lerSenha("Senha");
        Usuario usuario = usuarioService.entrar(login, senha);
        console.sucesso("Bem-vindo(a), " + usuario.getNome() + "!");

        if (usuario instanceof Trabalhador) {
            menuTrabalhador.abrir((Trabalhador) usuario);
        } else {
            menuEmpregador.abrir((Empregador) usuario);
        }
    }

    // ------------------------------------------------------------------
    // Cadastro
    // ------------------------------------------------------------------

    private void criarContaTrabalhador() {
        console.titulo("NOVA CONTA DE TRABALHADOR");
        String nome = console.lerValidado("Nome completo", v -> Validador.obrigatorio(v, "Nome", 100));
        String username = lerUsernameLivre();
        String cpf = console.lerValidado("CPF", Validador::cpf);
        String email = lerEmailLivre();
        String telefone = console.lerValidado("Telefone com DDD (WhatsApp)", Validador::telefone);
        String senha = lerNovaSenha();

        console.secao("Onde você mora?");
        Cidade cidade = console.escolher("Cidade", catalogo.listarCidades());

        console.secao("Em quais outras cidades você aceita trabalhar?");
        console.info("(" + cidade + " já está incluída)");
        List<Cidade> atuacao = new ArrayList<>();
        atuacao.add(cidade);
        lerCidadesExtras(atuacao);

        console.secao("Sua disponibilidade");
        Disponibilidade disponibilidade = escolherDisponibilidade();

        console.secao("Seu perfil");
        String habilidades = console.lerOpcional("O que você sabe fazer? (ex.: pedreiro, pintura)");
        String descricao = console.lerOpcional("Conte um pouco sobre você");

        console.info("\nProtegendo sua senha...");
        Trabalhador t = usuarioService.cadastrarTrabalhador(nome, username, cpf, email, telefone, senha, cidade,
                disponibilidade, habilidades, descricao, atuacao);
        console.sucesso("Conta criada! Seu perfil é @" + t.getUsername() + ". Agora é só entrar.");
        console.pausar();
    }

    private void criarContaEmpregador() {
        console.titulo("NOVA CONTA DE EMPREGADOR");
        String nome = console.lerValidado("Seu nome completo", v -> Validador.obrigatorio(v, "Nome", 100));
        String username = lerUsernameLivre();
        String documento = console.lerValidado("CPF ou CNPJ", Validador::documento);
        String email = lerEmailLivre();
        String telefone = console.lerValidado("Telefone com DDD (WhatsApp)", Validador::telefone);
        String senha = lerNovaSenha();

        console.secao("Sua cidade");
        Cidade cidade = console.escolher("Cidade", catalogo.listarCidades());

        console.secao("Seu perfil");
        String negocio = console.lerOpcional("Nome do negócio (se contrata como pessoa física, pule)");
        String descricao = console.lerOpcional("Conte um pouco sobre você ou seu negócio");

        console.info("\nProtegendo sua senha...");
        Empregador e = usuarioService.cadastrarEmpregador(nome, username, documento, email, telefone, senha,
                cidade, negocio, descricao);
        console.sucesso("Conta criada! Seu perfil é @" + e.getUsername() + ". Agora é só entrar.");
        console.pausar();
    }

    private String lerUsernameLivre() {
        return console.lerValidado("Username (ex.: joao.silva)", v -> {
            String u = Validador.username(v);
            usuarioService.verificarUsernameLivre(u);
            return u;
        });
    }

    private String lerEmailLivre() {
        return console.lerValidado("E-mail", v -> {
            String e = Validador.email(v);
            usuarioService.verificarEmailLivre(e);
            return e;
        });
    }

    private String lerNovaSenha() {
        console.info("A senha precisa ter 8+ caracteres, com letras e números.");
        while (true) {
            String senha = console.lerSenha("Senha");
            try {
                Validador.senhaForte(senha);
            } catch (RegraNegocioException e) {
                console.erro(e.getMessage());
                continue;
            }
            if (senha.equals(console.lerSenha("Confirme a senha"))) {
                return senha;
            }
            console.erro("As senhas não conferem. Tente de novo.");
        }
    }

    private void lerCidadesExtras(List<Cidade> atuacao) {
        List<Cidade> cidades = catalogo.listarCidades();
        while (true) {
            Cidade extra = null;
            for (int i = 0; i < cidades.size(); i++) {
                boolean marcada = atuacao.contains(cidades.get(i));
                console.info("  " + (i + 1) + ") [" + (marcada ? "x" : " ") + "] " + cidades.get(i));
            }
            Integer indice = console.lerInteiroOpcional("Número para adicionar (Enter para terminar)", 1, cidades.size());
            if (indice == null) {
                return;
            }
            extra = cidades.get(indice - 1);
            if (atuacao.contains(extra)) {
                console.erro(extra + " já está na lista.");
            } else {
                atuacao.add(extra);
                console.sucesso(extra + " adicionada.");
            }
        }
    }

    private Disponibilidade escolherDisponibilidade() {
        List<Disponibilidade> opcoes = Arrays.asList(Disponibilidade.values());
        for (int i = 0; i < opcoes.size(); i++) {
            console.info("  " + (i + 1) + ") " + opcoes.get(i).getDescricao());
        }
        return opcoes.get(console.lerInteiro("Disponibilidade", 1, opcoes.size()) - 1);
    }

    // ------------------------------------------------------------------
    // Visitante
    // ------------------------------------------------------------------

    private void verVagasSemLogin() {
        console.titulo("VAGAS ABERTAS");
        console.secao("Filtrar (Enter para ver todas)");
        Cidade cidade = console.escolherOpcional("Cidade", catalogo.listarCidades());
        Categoria categoria = console.escolherOpcional("Categoria", catalogo.listarCategorias());
        TipoVaga tipo = escolherTipoOpcional(console);

        console.secao("Resultado");
        List<Vaga> vagas = vagaService.filtrar(cidade, categoria, tipo, null);
        Exibicao.listarVagas(vagas);

        Integer id = console.lerInteiroOpcional("\nNúmero da vaga para ver detalhes (Enter para voltar)", 1, 99999);
        if (id != null) {
            Vaga v = vagaService.buscarPorId(id);
            Exibicao.detalhes(v, vagaService.lugaresRestantes(v));
            console.info("\nPara se candidatar, crie uma conta de trabalhador ou entre.");
            console.pausar();
        }
    }

    /** Usado também pelo menu do trabalhador. */
    static TipoVaga escolherTipoOpcional(Console console) {
        TipoVaga[] tipos = TipoVaga.values();
        for (int i = 0; i < tipos.length; i++) {
            console.info("  " + (i + 1) + ") " + tipos[i].getDescricao());
        }
        Integer indice = console.lerInteiroOpcional("Tipo (Enter = todos)", 1, tipos.length);
        return indice == null ? null : tipos[indice - 1];
    }
}
