package br.com.trampu.model;

/**
 * FIXO: emprego contínuo, sem datas.
 * TEMPORARIO: período definido (ex.: temporada de inverno), exige início e fim.
 * BICO: serviço de um ou poucos dias, exige início e fim.
 */
public enum TipoVaga {
    FIXO("Fixo"),
    TEMPORARIO("Temporário"),
    BICO("Bico");

    private final String descricao;

    TipoVaga(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public boolean exigeDatas() {
        return this != FIXO;
    }
}
