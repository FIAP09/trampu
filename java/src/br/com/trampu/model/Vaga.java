package br.com.trampu.model;

import java.time.LocalDate;

public class Vaga {

    private int id;
    private String titulo;
    private String descricao;
    private TipoVaga tipo;
    private double valor;
    private PeriodoPagamento periodoPagamento;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String horario;
    private String bairro;
    private int quantidade;
    private StatusVaga status;
    private Empregador empregador;
    private Cidade cidade;
    private Categoria categoria;
    private LocalDate dataPublicacao;

    public Vaga(int id, String titulo, String descricao, TipoVaga tipo, double valor,
                PeriodoPagamento periodoPagamento, int quantidade,
                Empregador empregador, Cidade cidade, Categoria categoria) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.tipo = tipo;
        this.valor = valor;
        this.periodoPagamento = periodoPagamento;
        this.quantidade = quantidade;
        this.empregador = empregador;
        this.cidade = cidade;
        this.categoria = categoria;
        this.status = StatusVaga.ABERTA;
        this.dataPublicacao = LocalDate.now();
    }

    public boolean isAberta() {
        return status == StatusVaga.ABERTA;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public TipoVaga getTipo() {
        return tipo;
    }

    public void setTipo(TipoVaga tipo) {
        this.tipo = tipo;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public PeriodoPagamento getPeriodoPagamento() {
        return periodoPagamento;
    }

    public void setPeriodoPagamento(PeriodoPagamento periodoPagamento) {
        this.periodoPagamento = periodoPagamento;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public int getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public StatusVaga getStatus() {
        return status;
    }

    public void setStatus(StatusVaga status) {
        this.status = status;
    }

    public Empregador getEmpregador() {
        return empregador;
    }

    public void setEmpregador(Empregador empregador) {
        this.empregador = empregador;
    }

    public Cidade getCidade() {
        return cidade;
    }

    public void setCidade(Cidade cidade) {
        this.cidade = cidade;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public LocalDate getDataPublicacao() {
        return dataPublicacao;
    }

    public void setDataPublicacao(LocalDate dataPublicacao) {
        this.dataPublicacao = dataPublicacao;
    }
}
