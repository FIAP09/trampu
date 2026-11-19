package br.com.trampu.model;

import java.time.LocalDate;

public class Candidatura {

    private int id;
    private Trabalhador trabalhador;
    private Vaga vaga;
    private StatusCandidatura status;
    /** Recado do empregador ao aceitar ou recusar. */
    private String mensagem;
    private LocalDate dataCandidatura;
    private LocalDate dataResposta;

    public Candidatura(int id, Trabalhador trabalhador, Vaga vaga) {
        this.id = id;
        this.trabalhador = trabalhador;
        this.vaga = vaga;
        this.status = StatusCandidatura.ENVIADA;
        this.dataCandidatura = LocalDate.now();
    }

    public boolean isPendente() {
        return status == StatusCandidatura.ENVIADA;
    }

    public boolean isAceita() {
        return status == StatusCandidatura.ACEITA;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Trabalhador getTrabalhador() {
        return trabalhador;
    }

    public void setTrabalhador(Trabalhador trabalhador) {
        this.trabalhador = trabalhador;
    }

    public Vaga getVaga() {
        return vaga;
    }

    public void setVaga(Vaga vaga) {
        this.vaga = vaga;
    }

    public StatusCandidatura getStatus() {
        return status;
    }

    public void setStatus(StatusCandidatura status) {
        this.status = status;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public LocalDate getDataCandidatura() {
        return dataCandidatura;
    }

    public void setDataCandidatura(LocalDate dataCandidatura) {
        this.dataCandidatura = dataCandidatura;
    }

    public LocalDate getDataResposta() {
        return dataResposta;
    }

    public void setDataResposta(LocalDate dataResposta) {
        this.dataResposta = dataResposta;
    }
}
