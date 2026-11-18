package br.com.trampu.service;

import br.com.trampu.dados.BaseDeDados;
import br.com.trampu.model.Candidatura;
import br.com.trampu.model.Empregador;
import br.com.trampu.model.StatusCandidatura;
import br.com.trampu.model.StatusVaga;
import br.com.trampu.model.Trabalhador;
import br.com.trampu.model.Vaga;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** Candidatar, aceitar, recusar e cancelar. */
public class CandidaturaService {

    private final BaseDeDados base;
    private final VagaService vagaService;

    public CandidaturaService(BaseDeDados base, VagaService vagaService) {
        this.base = base;
        this.vagaService = vagaService;
    }

    // ------------------------------------------------------------------
    // Trabalhador
    // ------------------------------------------------------------------

    public Candidatura candidatar(Trabalhador trabalhador, Vaga vaga) {
        if (!vaga.isAberta()) {
            throw new RegraNegocioException("Esta vaga já foi encerrada.");
        }
        if (vagaService.lugaresRestantes(vaga) <= 0) {
            throw new RegraNegocioException("Todas as vagas já foram preenchidas.");
        }
        for (Candidatura c : base.getCandidaturas()) {
            if (c.getVaga().getId() == vaga.getId() && c.getTrabalhador().getId() == trabalhador.getId()) {
                throw new RegraNegocioException("Você já se candidatou a esta vaga ("
                        + c.getStatus().getDescricao().toLowerCase() + ").");
            }
        }
        Candidatura c = new Candidatura(base.proximoIdCandidatura(), trabalhador, vaga);
        base.getCandidaturas().add(c);
        return c;
    }

    public void cancelar(Trabalhador trabalhador, Candidatura candidatura) {
        if (candidatura.getTrabalhador().getId() != trabalhador.getId()) {
            throw new RegraNegocioException("Esta candidatura não é sua.");
        }
        if (!candidatura.isPendente()) {
            throw new RegraNegocioException("Só é possível cancelar candidaturas que ainda aguardam resposta.");
        }
        candidatura.setStatus(StatusCandidatura.CANCELADA);
        candidatura.setDataResposta(LocalDate.now());
    }

    public List<Candidatura> listarDoTrabalhador(Trabalhador trabalhador) {
        List<Candidatura> resultado = new ArrayList<>();
        for (Candidatura c : base.getCandidaturas()) {
            if (c.getTrabalhador().getId() == trabalhador.getId()) {
                resultado.add(c);
            }
        }
        return resultado;
    }

    public Candidatura buscarDoTrabalhador(Trabalhador trabalhador, int id) {
        for (Candidatura c : listarDoTrabalhador(trabalhador)) {
            if (c.getId() == id) {
                return c;
            }
        }
        throw new RegraNegocioException("Candidatura #" + id + " não encontrada entre as suas.");
    }

    // ------------------------------------------------------------------
    // Empregador
    // ------------------------------------------------------------------

    /**
     * Aceita a candidatura. Quando todos os lugares são preenchidos,
     * a vaga é fechada e os pendentes são recusados automaticamente.
     * Devolve true se a vaga foi fechada por ter lotado.
     */
    public boolean aceitar(Empregador empregador, Candidatura candidatura, String mensagem) {
        Vaga vaga = candidatura.getVaga();
        validarResposta(empregador, candidatura);
        if (vagaService.lugaresRestantes(vaga) <= 0) {
            throw new RegraNegocioException("Todos os " + vaga.getQuantidade() + " lugares já foram preenchidos.");
        }
        candidatura.setStatus(StatusCandidatura.ACEITA);
        candidatura.setMensagem(Validador.opcional(mensagem, "Mensagem", 255));
        candidatura.setDataResposta(LocalDate.now());

        if (vagaService.lugaresRestantes(vaga) == 0) {
            vagaService.fechar(empregador, vaga);
            return true;
        }
        return false;
    }

    public void recusar(Empregador empregador, Candidatura candidatura, String mensagem) {
        validarResposta(empregador, candidatura);
        candidatura.setStatus(StatusCandidatura.RECUSADA);
        candidatura.setMensagem(Validador.opcional(mensagem, "Mensagem", 255));
        candidatura.setDataResposta(LocalDate.now());
    }

    public List<Candidatura> listarDaVaga(Vaga vaga) {
        List<Candidatura> resultado = new ArrayList<>();
        for (Candidatura c : base.getCandidaturas()) {
            if (c.getVaga().getId() == vaga.getId()) {
                resultado.add(c);
            }
        }
        return resultado;
    }

    public List<Candidatura> listarPendentesDoEmpregador(Empregador empregador) {
        List<Candidatura> resultado = new ArrayList<>();
        for (Candidatura c : base.getCandidaturas()) {
            if (c.getVaga().getEmpregador().getId() == empregador.getId() && c.isPendente()) {
                resultado.add(c);
            }
        }
        return resultado;
    }

    public Candidatura buscarDoEmpregador(Empregador empregador, int id) {
        for (Candidatura c : base.getCandidaturas()) {
            if (c.getId() == id) {
                if (c.getVaga().getEmpregador().getId() != empregador.getId()) {
                    break;
                }
                return c;
            }
        }
        throw new RegraNegocioException("Candidatura #" + id + " não encontrada nas suas vagas.");
    }

    /**
     * Privacidade: o telefone de um só aparece para o outro
     * depois que a candidatura é aceita.
     */
    public boolean contatoLiberado(Candidatura candidatura) {
        return candidatura.isAceita();
    }

    private void validarResposta(Empregador empregador, Candidatura candidatura) {
        if (candidatura.getVaga().getEmpregador().getId() != empregador.getId()) {
            throw new RegraNegocioException("Esta candidatura não é de uma vaga sua.");
        }
        if (candidatura.getVaga().getStatus() == StatusVaga.FECHADA) {
            throw new RegraNegocioException("A vaga está fechada.");
        }
        if (!candidatura.isPendente()) {
            throw new RegraNegocioException("Esta candidatura já foi respondida ("
                    + candidatura.getStatus().getDescricao().toLowerCase() + ").");
        }
    }
}
