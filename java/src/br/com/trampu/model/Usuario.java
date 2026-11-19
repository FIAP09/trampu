package br.com.trampu.model;

import java.time.LocalDate;

/**
 * Dados comuns às duas contas da Trampu: trabalhador e empregador.
 * A senha nunca é guardada em texto, apenas o hash PBKDF2 (ver SenhaUtil).
 */
public abstract class Usuario {

    private int id;
    private String nome;
    private String username;
    private String email;
    private String telefone;
    private String senhaHash;
    private String descricao;
    private Cidade cidade;
    private LocalDate dataCadastro;

    public Usuario(int id, String nome, String username, String email, String telefone,
                   String senhaHash, Cidade cidade) {
        this.id = id;
        this.nome = nome;
        this.username = username;
        this.email = email;
        this.telefone = telefone;
        this.senhaHash = senhaHash;
        this.cidade = cidade;
        this.dataCadastro = LocalDate.now();
    }

    /** "Trabalhador" ou "Empregador". */
    public abstract String getTipoConta();

    /** Nome mostrado nas listagens. */
    public String getNomeExibicao() {
        return nome;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Cidade getCidade() {
        return cidade;
    }

    public void setCidade(Cidade cidade) {
        this.cidade = cidade;
    }

    public LocalDate getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDate dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    @Override
    public String toString() {
        return getNomeExibicao() + " (@" + username + ")";
    }
}
