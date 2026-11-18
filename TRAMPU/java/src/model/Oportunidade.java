package model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public class Oportunidade {
    private final int id;
    private final Usuario contratante;
    private String titulo;
    private final String descricao;
    private final String categoria;
    private final String cidade;
    private final String local;
    private final LocalDate dataServico;
    private final LocalTime inicio;
    private final LocalTime fim;
    private BigDecimal remuneracao;
    private final int quantidadeVagas;
    private String status;

    public Oportunidade(int id, Usuario contratante, String titulo, String descricao, String categoria, String cidade, String local, LocalDate dataServico, LocalTime inicio, LocalTime fim, BigDecimal remuneracao, int quantidadeVagas) {
        this.id = id;
        this.contratante = contratante;
        this.titulo = titulo;
        this.descricao = descricao;
        this.categoria = categoria;
        this.cidade = cidade;
        this.local = local;
        this.dataServico = dataServico;
        this.inicio = inicio;
        this.fim = fim;
        this.remuneracao = remuneracao;
        this.quantidadeVagas = quantidadeVagas;
        this.status = "Aberta";
    }

    public int getId() { return id; }
    public Usuario getContratante() { return contratante; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public String getCategoria() { return categoria; }
    public String getCidade() { return cidade; }
    public String getLocal() { return local; }
    public LocalDate getDataServico() { return dataServico; }
    public LocalTime getInicio() { return inicio; }
    public LocalTime getFim() { return fim; }
    public BigDecimal getRemuneracao() { return remuneracao; }
    public void setRemuneracao(BigDecimal remuneracao) { this.remuneracao = remuneracao; }
    public int getQuantidadeVagas() { return quantidadeVagas; }
    public String getStatus() { return status; }
    public void preencher() { status = "Preenchida"; }
    public void concluir() { status = "Concluída"; }

    @Override
    public String toString() {
        return id + " | " + titulo + " | " + contratante.getNome() + " | " + categoria + " | " + cidade
            + " | " + dataServico + " " + inicio + "–" + fim + " | R$ " + remuneracao
            + " por pessoa | " + quantidadeVagas + " vaga(s) | " + status;
    }
}
