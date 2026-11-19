package br.com.trampu.model;

public enum Disponibilidade {
    INTEGRAL("Integral"),
    MEIO_PERIODO("Meio período"),
    FINS_DE_SEMANA("Fins de semana"),
    BICOS("Só bicos");

    private final String descricao;

    Disponibilidade(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
