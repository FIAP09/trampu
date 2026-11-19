package br.com.trampu.service;

import br.com.trampu.dados.BaseDeDados;
import br.com.trampu.model.Candidatura;
import br.com.trampu.model.Categoria;
import br.com.trampu.model.Cidade;
import br.com.trampu.model.Empregador;
import br.com.trampu.model.PeriodoPagamento;
import br.com.trampu.model.StatusCandidatura;
import br.com.trampu.model.StatusVaga;
import br.com.trampu.model.TipoVaga;
import br.com.trampu.model.Trabalhador;
import br.com.trampu.model.Vaga;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** CRUD de vagas e regras de publicação. */
public class VagaService {

    private final BaseDeDados base;

    public VagaService(BaseDeDados base) {
        this.base = base;
    }

    // ------------------------------------------------------------------
    // Create
    // ------------------------------------------------------------------

    public Vaga publicar(Empregador empregador, String titulo, String descricao, TipoVaga tipo, double valor,
                         PeriodoPagamento periodo, LocalDate inicio, LocalDate fim, String horario, String bairro,
                         int quantidade, Cidade cidade, Categoria categoria) {
        if (empregador == null) {
            throw new RegraNegocioException("Só empregadores podem publicar vagas.");
        }
        if (cidade == null || categoria == null) {
            throw new RegraNegocioException("Informe a cidade e a categoria da vaga.");
        }
        if (tipo != null && tipo.exigeDatas() && inicio != null && inicio.isBefore(LocalDate.now())) {
            throw new RegraNegocioException("A data de início não pode estar no passado.");
        }
        validarDados(titulo, descricao, tipo, valor, periodo, inicio, fim, quantidade);

        Vaga v = new Vaga(base.proximoIdVaga(), titulo.trim(), descricao.trim(), tipo, valor, periodo,
                quantidade, empregador, cidade, categoria);
        aplicarDatas(v, tipo, inicio, fim);
        v.setHorario(Validador.opcional(horario, "Horário", 100));
        v.setBairro(Validador.opcional(bairro, "Bairro", 80));
        base.getVagas().add(v);
        return v;
    }

    // ------------------------------------------------------------------
    // Read
    // ------------------------------------------------------------------

    public Vaga buscarPorId(int id) {
        for (Vaga v : base.getVagas()) {
            if (v.getId() == id) {
                return v;
            }
        }
        throw new RegraNegocioException("Vaga #" + id + " não encontrada.");
    }

    /** Busca garantindo que a vaga pertence ao empregador logado. */
    public Vaga buscarDoEmpregador(Empregador empregador, int id) {
        Vaga v = buscarPorId(id);
        if (v.getEmpregador().getId() != empregador.getId()) {
            throw new RegraNegocioException("A vaga #" + id + " não é sua.");
        }
        return v;
    }

    public List<Vaga> listarAbertas() {
        return filtrar(null, null, null, null);
    }

    public List<Vaga> listarPorEmpregador(Empregador empregador) {
        List<Vaga> resultado = new ArrayList<>();
        for (Vaga v : base.getVagas()) {
            if (v.getEmpregador().getId() == empregador.getId()) {
                resultado.add(v);
            }
        }
        return resultado;
    }

    /** Filtra vagas abertas. Qualquer filtro null é ignorado. */
    public List<Vaga> filtrar(Cidade cidade, Categoria categoria, TipoVaga tipo, String texto) {
        String busca = (texto == null || texto.isBlank()) ? null : texto.trim().toLowerCase();
        List<Vaga> resultado = new ArrayList<>();
        for (Vaga v : base.getVagas()) {
            if (!v.isAberta()) {
                continue;
            }
            if (cidade != null && v.getCidade().getId() != cidade.getId()) {
                continue;
            }
            if (categoria != null && v.getCategoria().getId() != categoria.getId()) {
                continue;
            }
            if (tipo != null && v.getTipo() != tipo) {
                continue;
            }
            if (busca != null
                    && !v.getTitulo().toLowerCase().contains(busca)
                    && !v.getDescricao().toLowerCase().contains(busca)) {
                continue;
            }
            resultado.add(v);
        }
        return resultado;
    }

    /** Vagas abertas nas cidades em que o trabalhador aceita trabalhar. */
    public List<Vaga> compativeisCom(Trabalhador trabalhador) {
        List<Vaga> resultado = new ArrayList<>();
        for (Vaga v : listarAbertas()) {
            if (trabalhador.atuaEm(v.getCidade())) {
                resultado.add(v);
            }
        }
        return resultado;
    }

    public int contarAceitos(Vaga vaga) {
        int total = 0;
        for (Candidatura c : base.getCandidaturas()) {
            if (c.getVaga().getId() == vaga.getId() && c.isAceita()) {
                total++;
            }
        }
        return total;
    }

    public int lugaresRestantes(Vaga vaga) {
        return vaga.getQuantidade() - contarAceitos(vaga);
    }

    // ------------------------------------------------------------------
    // Update
    // ------------------------------------------------------------------

    public void atualizar(Empregador empregador, Vaga vaga, String titulo, String descricao, double valor,
                          PeriodoPagamento periodo, LocalDate inicio, LocalDate fim, String horario,
                          String bairro, int quantidade) {
        verificarDono(empregador, vaga);
        if (!vaga.isAberta()) {
            throw new RegraNegocioException("Vagas fechadas não podem ser editadas.");
        }
        validarDados(titulo, descricao, vaga.getTipo(), valor, periodo, inicio, fim, quantidade);
        int aceitos = contarAceitos(vaga);
        if (quantidade < aceitos) {
            throw new RegraNegocioException("Você já aceitou " + aceitos + " pessoa(s). A quantidade não pode ser menor.");
        }

        vaga.setTitulo(titulo.trim());
        vaga.setDescricao(descricao.trim());
        vaga.setValor(valor);
        vaga.setPeriodoPagamento(periodo);
        aplicarDatas(vaga, vaga.getTipo(), inicio, fim);
        vaga.setHorario(Validador.opcional(horario, "Horário", 100));
        vaga.setBairro(Validador.opcional(bairro, "Bairro", 80));
        vaga.setQuantidade(quantidade);
    }

    /**
     * Encerra a vaga. Candidaturas que ainda aguardavam resposta
     * são recusadas automaticamente, para ninguém ficar esperando.
     * Devolve quantas candidaturas foram recusadas.
     */
    public int fechar(Empregador empregador, Vaga vaga) {
        verificarDono(empregador, vaga);
        if (!vaga.isAberta()) {
            throw new RegraNegocioException("Esta vaga já está fechada.");
        }
        vaga.setStatus(StatusVaga.FECHADA);
        int recusadas = 0;
        for (Candidatura c : base.getCandidaturas()) {
            if (c.getVaga().getId() == vaga.getId() && c.isPendente()) {
                c.setStatus(StatusCandidatura.RECUSADA);
                c.setMensagem("A vaga foi encerrada pelo empregador.");
                c.setDataResposta(LocalDate.now());
                recusadas++;
            }
        }
        return recusadas;
    }

    // ------------------------------------------------------------------
    // Delete (desafio extra)
    // ------------------------------------------------------------------

    /**
     * Remove a vaga e suas candidaturas.
     * Se alguém já foi aceito, a vaga não pode sumir: o trabalhador
     * perderia o histórico. Nesse caso o certo é fechar a vaga.
     */
    public void remover(Empregador empregador, Vaga vaga) {
        verificarDono(empregador, vaga);
        if (contarAceitos(vaga) > 0) {
            throw new RegraNegocioException("Esta vaga já tem pessoas aceitas. Feche a vaga em vez de removê-la.");
        }
        List<Candidatura> candidaturas = base.getCandidaturas();
        for (int i = candidaturas.size() - 1; i >= 0; i--) {
            if (candidaturas.get(i).getVaga().getId() == vaga.getId()) {
                candidaturas.remove(i);
            }
        }
        base.getVagas().remove(vaga);
    }

    // ------------------------------------------------------------------
    // Regras compartilhadas
    // ------------------------------------------------------------------

    private void validarDados(String titulo, String descricao, TipoVaga tipo, double valor,
                              PeriodoPagamento periodo, LocalDate inicio, LocalDate fim, int quantidade) {
        Validador.obrigatorio(titulo, "Título", 100);
        Validador.obrigatorio(descricao, "Descrição", 500);
        if (tipo == null) {
            throw new RegraNegocioException("Informe o tipo da vaga (fixo, temporário ou bico).");
        }
        if (valor <= 0) {
            throw new RegraNegocioException("O valor da vaga é obrigatório e precisa ser maior que zero.");
        }
        if (periodo == null) {
            throw new RegraNegocioException("Informe se o valor é por hora, dia, semana, mês ou total.");
        }
        if (quantidade < 1) {
            throw new RegraNegocioException("A quantidade de vagas precisa ser pelo menos 1.");
        }
        if (tipo.exigeDatas()) {
            if (inicio == null || fim == null) {
                throw new RegraNegocioException("Vagas " + tipo.getDescricao().toLowerCase()
                        + " precisam de data de início e de fim.");
            }
            if (fim.isBefore(inicio)) {
                throw new RegraNegocioException("A data de fim não pode ser antes da data de início.");
            }
        }
    }

    /** FIXO não guarda datas (mesma regra do CHECK no banco). */
    private void aplicarDatas(Vaga vaga, TipoVaga tipo, LocalDate inicio, LocalDate fim) {
        if (tipo.exigeDatas()) {
            vaga.setDataInicio(inicio);
            vaga.setDataFim(fim);
        } else {
            vaga.setDataInicio(null);
            vaga.setDataFim(null);
        }
    }

    private void verificarDono(Empregador empregador, Vaga vaga) {
        if (vaga.getEmpregador().getId() != empregador.getId()) {
            throw new RegraNegocioException("Você só pode alterar as suas próprias vagas.");
        }
    }
}
