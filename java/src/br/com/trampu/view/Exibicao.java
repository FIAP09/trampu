package br.com.trampu.view;

import br.com.trampu.model.Candidatura;
import br.com.trampu.model.Cidade;
import br.com.trampu.model.Empregador;
import br.com.trampu.model.Trabalhador;
import br.com.trampu.model.Usuario;
import br.com.trampu.model.Vaga;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;

/** Formata entidades para o console. */
public final class Exibicao {

    private static final Locale PT_BR = Locale.forLanguageTag("pt-BR");
    private static final DateTimeFormatter DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter DATA_COM_DIA = DateTimeFormatter.ofPattern("EEEE, dd/MM/yyyy", PT_BR);

    private Exibicao() {
    }

    public static String moeda(double valor) {
        return String.format(PT_BR, "R$ %,.2f", valor);
    }

    public static String data(LocalDate data) {
        return data == null ? "-" : data.format(DATA);
    }

    /** (12) 99111-0001 */
    public static String telefone(String digitos) {
        if (digitos == null || digitos.length() < 10) {
            return digitos;
        }
        String ddd = digitos.substring(0, 2);
        String numero = digitos.substring(2);
        int corte = numero.length() - 4;
        return "(" + ddd + ") " + numero.substring(0, corte) + "-" + numero.substring(corte);
    }

    /** Fixo: "início a combinar". Bico de 1 dia: "sábado, 28/11/2026". Período: "01/12 a 10/01 (41 dias)". */
    public static String quando(Vaga v) {
        if (!v.getTipo().exigeDatas()) {
            return "Início a combinar";
        }
        if (v.getDataInicio().equals(v.getDataFim())) {
            return v.getDataInicio().format(DATA_COM_DIA);
        }
        long dias = ChronoUnit.DAYS.between(v.getDataInicio(), v.getDataFim()) + 1;
        return data(v.getDataInicio()) + " a " + data(v.getDataFim()) + " (" + dias + " dias)";
    }

    public static String pagamento(Vaga v) {
        return moeda(v.getValor()) + " " + v.getPeriodoPagamento().getDescricao();
    }

    /** Uma linha por vaga, para listagens. */
    public static String resumo(Vaga v) {
        String status = v.isAberta() ? "" : " [FECHADA]";
        return String.format("#%-3d %s%s%n      %s · %s · %s · %s",
                v.getId(), v.getTitulo(), status,
                v.getTipo().getDescricao(), pagamento(v), v.getCidade(), quando(v));
    }

    public static void listarVagas(List<Vaga> vagas) {
        if (vagas.isEmpty()) {
            System.out.println("Nenhuma vaga encontrada.");
            return;
        }
        for (Vaga v : vagas) {
            System.out.println(resumo(v));
        }
        System.out.println("\n" + vagas.size() + " vaga(s).");
    }

    public static void detalhes(Vaga v, int lugaresRestantes) {
        System.out.println();
        System.out.println("#" + v.getId() + " " + v.getTitulo().toUpperCase() + (v.isAberta() ? "" : "  [FECHADA]"));
        System.out.println("  " + v.getDescricao());
        System.out.println();
        System.out.println("  Tipo ........: " + v.getTipo().getDescricao());
        System.out.println("  Pagamento ...: " + pagamento(v));
        System.out.println("  Quando ......: " + quando(v));
        if (v.getHorario() != null) {
            System.out.println("  Horário .....: " + v.getHorario());
        }
        System.out.println("  Onde ........: " + (v.getBairro() == null ? "" : v.getBairro() + ", ") + v.getCidade());
        System.out.println("  Categoria ...: " + v.getCategoria());
        System.out.println("  Vagas .......: " + lugaresRestantes + " de " + v.getQuantidade() + " disponível(is)");
        System.out.println("  Publicada por: " + v.getEmpregador().getNomeExibicao()
                + " · @" + v.getEmpregador().getUsername());
        System.out.println("  Publicada em : " + data(v.getDataPublicacao()));
    }

    /** Visão do trabalhador: o telefone do empregador só aparece se foi aceito. */
    public static void candidaturaDoTrabalhador(Candidatura c) {
        Vaga v = c.getVaga();
        System.out.println(String.format("#%-3d %s — %s", c.getId(), v.getTitulo(), c.getStatus().getDescricao()));
        System.out.println("      " + v.getEmpregador().getNomeExibicao() + " · " + v.getCidade()
                + " · " + quando(v) + " · enviada em " + data(c.getDataCandidatura()));
        if (c.getMensagem() != null) {
            System.out.println("      Mensagem: \"" + c.getMensagem() + "\"");
        }
        if (c.isAceita()) {
            System.out.println("      Contato: " + telefone(v.getEmpregador().getTelefone()) + " (WhatsApp)");
        }
    }

    /** Visão do empregador: o telefone do trabalhador só aparece se foi aceito. */
    public static void candidaturaDoEmpregador(Candidatura c) {
        Trabalhador t = c.getTrabalhador();
        System.out.println(String.format("#%-3d %s (@%s) — %s", c.getId(), t.getNome(), t.getUsername(),
                c.getStatus().getDescricao()));
        System.out.println("      Vaga: " + c.getVaga().getTitulo() + " · mora em " + t.getCidade()
                + " · " + t.getDisponibilidade().getDescricao());
        if (t.getHabilidades() != null) {
            System.out.println("      Habilidades: " + t.getHabilidades());
        }
        if (c.isAceita()) {
            System.out.println("      Contato: " + telefone(t.getTelefone()) + " (WhatsApp)");
        }
    }

    /** Perfil do próprio usuário: mostra tudo, inclusive contato. */
    public static void perfil(Usuario u) {
        perfil(u, true);
    }

    /**
     * Perfil visto por outra pessoa: sem e-mail e telefone.
     * O contato só é liberado depois que a candidatura é aceita.
     */
    public static void perfilPublico(Usuario u) {
        perfil(u, false);
    }

    private static void perfil(Usuario u, boolean mostrarContato) {
        System.out.println();
        System.out.println(u.getNomeExibicao() + "  ·  @" + u.getUsername() + "  ·  " + u.getTipoConta());
        if (u.getDescricao() != null) {
            System.out.println("\"" + u.getDescricao() + "\"");
        }
        System.out.println();
        System.out.println("  Mora em .....: " + u.getCidade());
        if (mostrarContato) {
            System.out.println("  E-mail ......: " + u.getEmail());
            System.out.println("  Telefone ....: " + telefone(u.getTelefone()));
        } else {
            System.out.println("  Contato .....: liberado depois do aceite");
        }
        System.out.println("  Na Trampu desde " + data(u.getDataCadastro()));

        if (u instanceof Trabalhador) {
            Trabalhador t = (Trabalhador) u;
            System.out.println("  Habilidades .: " + (t.getHabilidades() == null ? "-" : t.getHabilidades()));
            System.out.println("  Disponível ..: " + t.getDisponibilidade().getDescricao());
            System.out.print("  Trabalha em .: ");
            List<Cidade> cidades = t.getCidadesAtuacao();
            for (int i = 0; i < cidades.size(); i++) {
                System.out.print(cidades.get(i) + (i < cidades.size() - 1 ? ", " : "\n"));
            }
        } else if (u instanceof Empregador) {
            Empregador e = (Empregador) u;
            System.out.println("  Negócio .....: " + (e.getNomeNegocio() == null ? "(pessoa física)" : e.getNomeNegocio()));
        }
    }
}
