package model;

import java.time.LocalDate;

public class Candidatura {
    private final int id;
    private final Usuario trabalhador;
    private final Oportunidade oportunidade;
    private final LocalDate dataCandidatura;
    private String status;

    public Candidatura(int id, Usuario trabalhador, Oportunidade oportunidade, LocalDate dataCandidatura) {
        this.id = id;
        this.trabalhador = trabalhador;
        this.oportunidade = oportunidade;
        this.dataCandidatura = dataCandidatura;
        this.status = "Pendente";
    }

    public int getId() { return id; }
    public Usuario getTrabalhador() { return trabalhador; }
    public Oportunidade getOportunidade() { return oportunidade; }
    public LocalDate getDataCandidatura() { return dataCandidatura; }
    public String getStatus() { return status; }
    public void decidir(boolean aprovada) { status = aprovada ? "Aprovada" : "Rejeitada"; }

    @Override
    public String toString() {
        return id + " | " + trabalhador.getNome() + " | " + oportunidade.getTitulo()
            + " | " + dataCandidatura + " | " + status;
    }
}
