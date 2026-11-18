package br.com.trampu.service;

import br.com.trampu.dados.BaseDeDados;
import br.com.trampu.model.Cidade;
import br.com.trampu.model.Disponibilidade;
import br.com.trampu.model.Empregador;
import br.com.trampu.model.Trabalhador;
import br.com.trampu.model.Usuario;

import java.util.ArrayList;
import java.util.List;

/** Cadastro, login e perfil das duas contas (trabalhador e empregador). */
public class UsuarioService {

    private final BaseDeDados base;

    public UsuarioService(BaseDeDados base) {
        this.base = base;
    }

    // ------------------------------------------------------------------
    // Cadastro
    // ------------------------------------------------------------------

    public Trabalhador cadastrarTrabalhador(String nome, String username, String cpf, String email, String telefone,
                                           String senha, Cidade cidade, Disponibilidade disponibilidade,
                                           String habilidades, String descricao,
                                           List<Cidade> cidadesAtuacao) {
        String nomeOk = Validador.obrigatorio(nome, "Nome", 100);
        String usernameOk = Validador.username(username);
        String cpfOk = Validador.cpf(cpf);
        String emailOk = Validador.email(email);
        String telefoneOk = Validador.telefone(telefone);
        Validador.senhaForte(senha);
        if (cidade == null) {
            throw new RegraNegocioException("Informe a cidade onde você mora.");
        }
        if (disponibilidade == null) {
            throw new RegraNegocioException("Informe sua disponibilidade.");
        }
        verificarUsernameLivre(usernameOk);
        verificarEmailLivre(emailOk);
        for (Trabalhador t : base.getTrabalhadores()) {
            if (t.getCpf().equals(cpfOk)) {
                throw new RegraNegocioException("Já existe uma conta de trabalhador com este CPF.");
            }
        }

        Trabalhador t = new Trabalhador(base.proximoIdTrabalhador(), nomeOk, usernameOk, cpfOk, emailOk,
                telefoneOk, SenhaUtil.gerarHash(senha), cidade, disponibilidade);
        t.setHabilidades(Validador.opcional(habilidades, "Habilidades", 255));
        t.setDescricao(Validador.opcional(descricao, "Descrição", 500));
        if (cidadesAtuacao != null) {
            for (Cidade c : cidadesAtuacao) {
                t.adicionarCidadeAtuacao(c);
            }
        }
        base.getTrabalhadores().add(t);
        return t;
    }

    public Empregador cadastrarEmpregador(String nome, String username, String documento, String email,
                                         String telefone, String senha, Cidade cidade, String nomeNegocio,
                                         String descricao) {
        String nomeOk = Validador.obrigatorio(nome, "Nome", 100);
        String usernameOk = Validador.username(username);
        String documentoOk = Validador.documento(documento);
        String emailOk = Validador.email(email);
        String telefoneOk = Validador.telefone(telefone);
        Validador.senhaForte(senha);
        if (cidade == null) {
            throw new RegraNegocioException("Informe a sua cidade.");
        }
        verificarUsernameLivre(usernameOk);
        verificarEmailLivre(emailOk);
        for (Empregador e : base.getEmpregadores()) {
            if (e.getDocumento().equals(documentoOk)) {
                throw new RegraNegocioException("Já existe uma conta de empregador com este CPF/CNPJ.");
            }
        }

        Empregador e = new Empregador(base.proximoIdEmpregador(), nomeOk, usernameOk, documentoOk, emailOk,
                telefoneOk, SenhaUtil.gerarHash(senha), cidade);
        e.setNomeNegocio(Validador.opcional(nomeNegocio, "Nome do negócio", 100));
        e.setDescricao(Validador.opcional(descricao, "Descrição", 500));
        base.getEmpregadores().add(e);
        return e;
    }

    // ------------------------------------------------------------------
    // Login
    // ------------------------------------------------------------------

    /** Entra com username (com ou sem @) ou e-mail. */
    public Usuario entrar(String login, String senha) {
        if (login == null || login.isBlank() || senha == null || senha.isEmpty()) {
            throw new RegraNegocioException("Informe o usuário e a senha.");
        }
        String chave = login.trim().toLowerCase();
        if (chave.startsWith("@")) {
            chave = chave.substring(1);
        }
        for (Usuario u : todosUsuarios()) {
            if (u.getUsername().equals(chave) || u.getEmail().equals(chave)) {
                if (SenhaUtil.verificar(senha, u.getSenhaHash())) {
                    return u;
                }
                break;
            }
        }
        // mesma mensagem nos dois casos, para não revelar quais usuários existem
        throw new RegraNegocioException("Usuário ou senha incorretos.");
    }

    public void alterarSenha(Usuario usuario, String senhaAtual, String novaSenha) {
        if (!SenhaUtil.verificar(senhaAtual, usuario.getSenhaHash())) {
            throw new RegraNegocioException("Senha atual incorreta.");
        }
        Validador.senhaForte(novaSenha);
        usuario.setSenhaHash(SenhaUtil.gerarHash(novaSenha));
    }

    // ------------------------------------------------------------------
    // Perfil
    // ------------------------------------------------------------------

    public void atualizarPerfil(Usuario usuario, String telefone, String descricao) {
        if (telefone != null && !telefone.isBlank()) {
            usuario.setTelefone(Validador.telefone(telefone));
        }
        if (descricao != null && !descricao.isBlank()) {
            usuario.setDescricao(Validador.opcional(descricao, "Descrição", 500));
        }
    }

    public void atualizarDadosTrabalhador(Trabalhador t, String habilidades, Disponibilidade disponibilidade) {
        if (habilidades != null && !habilidades.isBlank()) {
            t.setHabilidades(Validador.opcional(habilidades, "Habilidades", 255));
        }
        if (disponibilidade != null) {
            t.setDisponibilidade(disponibilidade);
        }
    }

    public void adicionarCidadeAtuacao(Trabalhador t, Cidade cidade) {
        if (t.atuaEm(cidade)) {
            throw new RegraNegocioException("Você já trabalha em " + cidade + ".");
        }
        t.adicionarCidadeAtuacao(cidade);
    }

    public void removerCidadeAtuacao(Trabalhador t, Cidade cidade) {
        if (!t.atuaEm(cidade)) {
            throw new RegraNegocioException(cidade + " não está na sua lista.");
        }
        if (t.getCidadesAtuacao().size() == 1) {
            throw new RegraNegocioException("Você precisa ter pelo menos uma cidade de atuação.");
        }
        t.removerCidadeAtuacao(cidade);
    }

    // ------------------------------------------------------------------
    // Consultas
    // ------------------------------------------------------------------

    public List<Usuario> todosUsuarios() {
        List<Usuario> todos = new ArrayList<>();
        todos.addAll(base.getTrabalhadores());
        todos.addAll(base.getEmpregadores());
        return todos;
    }

    public List<Trabalhador> trabalhadoresQueAtuamEm(Cidade cidade) {
        List<Trabalhador> resultado = new ArrayList<>();
        for (Trabalhador t : base.getTrabalhadores()) {
            if (t.atuaEm(cidade)) {
                resultado.add(t);
            }
        }
        return resultado;
    }

    // ------------------------------------------------------------------
    // Regras de unicidade (username e e-mail únicos entre as DUAS contas)
    // ------------------------------------------------------------------

    public void verificarUsernameLivre(String username) {
        for (Usuario u : todosUsuarios()) {
            if (u.getUsername().equals(username)) {
                throw new RegraNegocioException("O username @" + username + " já está em uso.");
            }
        }
    }

    public void verificarEmailLivre(String email) {
        for (Usuario u : todosUsuarios()) {
            if (u.getEmail().equals(email)) {
                throw new RegraNegocioException("Já existe uma conta com este e-mail.");
            }
        }
    }
}
