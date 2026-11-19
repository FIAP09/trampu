package br.com.trampu.model;

/**
 * ENVIADA: aguardando o empregador.
 * ACEITA: empregador aceitou (telefones liberados entre os dois).
 * RECUSADA: empregador descartou.
 * CANCELADA: o próprio trabalhador desistiu.
 */
public enum StatusCandidatura {
    ENVIADA("Aguardando resposta"),
    ACEITA("Aceita"),
    RECUSADA("Recusada"),
    CANCELADA("Cancelada por você");

    private final String descricao;

    StatusCandidatura(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
