package br.com.trampu.model;

public enum PeriodoPagamento {
    HORA("por hora"),
    DIA("por dia"),
    SEMANA("por semana"),
    MES("por mês"),
    TOTAL("no total");

    private final String descricao;

    PeriodoPagamento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
