package br.com.trampu.model;

import java.util.ArrayList;
import java.util.List;

public class Trabalhador extends Usuario {

    private String cpf;
    private String habilidades;
    private Disponibilidade disponibilidade;
    /** Cidades em que aceita trabalhar (no banco: tabela TRABALHADOR_CIDADE). */
    private List<Cidade> cidadesAtuacao;

    public Trabalhador(int id, String nome, String username, String cpf, String email, String telefone,
                       String senhaHash, Cidade cidade, Disponibilidade disponibilidade) {
        super(id, nome, username, email, telefone, senhaHash, cidade);
        this.cpf = cpf;
        this.disponibilidade = disponibilidade;
        this.cidadesAtuacao = new ArrayList<>();
        // a cidade onde mora já entra como cidade de atuação
        if (cidade != null) {
            this.cidadesAtuacao.add(cidade);
        }
    }

    @Override
    public String getTipoConta() {
        return "Trabalhador";
    }

    public boolean atuaEm(Cidade cidade) {
        for (Cidade c : cidadesAtuacao) {
            if (c.getId() == cidade.getId()) {
                return true;
            }
        }
        return false;
    }

    public void adicionarCidadeAtuacao(Cidade cidade) {
        if (cidade != null && !atuaEm(cidade)) {
            cidadesAtuacao.add(cidade);
        }
    }

    public void removerCidadeAtuacao(Cidade cidade) {
        for (int i = 0; i < cidadesAtuacao.size(); i++) {
            if (cidadesAtuacao.get(i).getId() == cidade.getId()) {
                cidadesAtuacao.remove(i);
                return;
            }
        }
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(String habilidades) {
        this.habilidades = habilidades;
    }

    public Disponibilidade getDisponibilidade() {
        return disponibilidade;
    }

    public void setDisponibilidade(Disponibilidade disponibilidade) {
        this.disponibilidade = disponibilidade;
    }

    public List<Cidade> getCidadesAtuacao() {
        return cidadesAtuacao;
    }

    public void setCidadesAtuacao(List<Cidade> cidadesAtuacao) {
        this.cidadesAtuacao = cidadesAtuacao;
    }
}
