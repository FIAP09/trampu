package br.com.trampu.view;

import br.com.trampu.service.RegraNegocioException;

import java.nio.charset.Charset;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.List;
import java.util.Scanner;
import java.util.function.UnaryOperator;

/**
 * Leitura do teclado com validação.
 * Nenhum método deixa o programa quebrar com entrada inválida:
 * ele mostra o erro e pergunta de novo.
 */
public class Console {

    private static final DateTimeFormatter FORMATO_DATA =
            DateTimeFormatter.ofPattern("dd/MM/uuuu").withResolverStyle(ResolverStyle.STRICT);

    private final Scanner scanner;

    public Console() {
        // usa a mesma codificação do terminal, para acentos (José, São Bento) funcionarem
        String encoding = System.getProperty("stdout.encoding", Charset.defaultCharset().name());
        this.scanner = new Scanner(System.in, Charset.forName(encoding));
    }

    // ------------------------------------------------------------------
    // Saída
    // ------------------------------------------------------------------

    public void titulo(String texto) {
        System.out.println();
        System.out.println("==================================================");
        System.out.println("  " + texto);
        System.out.println("==================================================");
    }

    public void secao(String texto) {
        System.out.println();
        System.out.println("--- " + texto + " ---");
    }

    public void info(String texto) {
        System.out.println(texto);
    }

    public void sucesso(String texto) {
        System.out.println("[OK] " + texto);
    }

    public void erro(String texto) {
        System.out.println("[!] " + texto);
    }

    public void pausar() {
        System.out.print("\nPressione Enter para continuar...");
        lerLinha();
    }

    // ------------------------------------------------------------------
    // Entrada básica
    // ------------------------------------------------------------------

    private String lerLinha() {
        if (!scanner.hasNextLine()) {
            System.out.println("\nEntrada encerrada. Até logo!");
            System.exit(0);
        }
        return scanner.nextLine().trim();
    }

    /** Texto obrigatório. */
    public String lerTexto(String rotulo) {
        while (true) {
            System.out.print(rotulo + ": ");
            String valor = lerLinha();
            if (!valor.isEmpty()) {
                return valor;
            }
            erro("Este campo é obrigatório.");
        }
    }

    /** Texto opcional: devolve null se a pessoa só apertar Enter. */
    public String lerOpcional(String rotulo) {
        System.out.print(rotulo + " (opcional, Enter para pular): ");
        String valor = lerLinha();
        return valor.isEmpty() ? null : valor;
    }

    /** Para edição: Enter mantém o valor atual. */
    public String lerOuManter(String rotulo, String atual) {
        System.out.print(rotulo + " [" + (atual == null ? "vazio" : atual) + "]: ");
        String valor = lerLinha();
        return valor.isEmpty() ? atual : valor;
    }

    /**
     * Lê um texto e passa pelo validador até ser aceito.
     * O validador devolve o valor normalizado ou lança RegraNegocioException.
     */
    public String lerValidado(String rotulo, UnaryOperator<String> validador) {
        while (true) {
            String valor = lerTexto(rotulo);
            try {
                return validador.apply(valor);
            } catch (RegraNegocioException e) {
                erro(e.getMessage());
            }
        }
    }

    public String lerSenha(String rotulo) {
        java.io.Console terminal = System.console();
        while (true) {
            String senha;
            if (terminal != null) {
                char[] lida = terminal.readPassword(rotulo + ": ");
                senha = lida == null ? "" : new String(lida);
            } else {
                System.out.print(rotulo + ": ");
                senha = lerLinha();
            }
            if (!senha.isEmpty()) {
                return senha;
            }
            erro("A senha é obrigatória.");
        }
    }

    public int lerInteiro(String rotulo, int minimo, int maximo) {
        while (true) {
            System.out.print(rotulo + ": ");
            String valor = lerLinha();
            try {
                int numero = Integer.parseInt(valor);
                if (numero >= minimo && numero <= maximo) {
                    return numero;
                }
                erro("Digite um número entre " + minimo + " e " + maximo + ".");
            } catch (NumberFormatException e) {
                erro("Digite apenas números.");
            }
        }
    }

    /** Número opcional: devolve null se a pessoa só apertar Enter. */
    public Integer lerInteiroOpcional(String rotulo, int minimo, int maximo) {
        while (true) {
            System.out.print(rotulo + ": ");
            String valor = lerLinha();
            if (valor.isEmpty()) {
                return null;
            }
            try {
                int numero = Integer.parseInt(valor);
                if (numero >= minimo && numero <= maximo) {
                    return numero;
                }
                erro("Digite um número entre " + minimo + " e " + maximo + ", ou Enter para pular.");
            } catch (NumberFormatException e) {
                erro("Digite apenas números, ou Enter para pular.");
            }
        }
    }

    /** Aceita "1900", "1900,50", "1.900,50" ou "1900.50". */
    public double lerValor(String rotulo) {
        while (true) {
            System.out.print(rotulo + ": R$ ");
            String valor = lerLinha();
            Double numero = converterValor(valor);
            if (numero != null && numero > 0) {
                return numero;
            }
            erro("Digite um valor maior que zero. Exemplo: 120 ou 1.900,50");
        }
    }

    public double lerValorOuManter(String rotulo, double atual) {
        while (true) {
            System.out.print(rotulo + " [" + Exibicao.moeda(atual) + "]: R$ ");
            String valor = lerLinha();
            if (valor.isEmpty()) {
                return atual;
            }
            Double numero = converterValor(valor);
            if (numero != null && numero > 0) {
                return numero;
            }
            erro("Digite um valor maior que zero. Exemplo: 120 ou 1.900,50");
        }
    }

    private Double converterValor(String texto) {
        String limpo = texto.replace("R$", "").replace(" ", "");
        if (limpo.contains(",")) {
            limpo = limpo.replace(".", "").replace(",", ".");
        }
        try {
            return Double.parseDouble(limpo);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public LocalDate lerData(String rotulo) {
        while (true) {
            System.out.print(rotulo + " (dd/mm/aaaa): ");
            String valor = lerLinha();
            try {
                return LocalDate.parse(valor, FORMATO_DATA);
            } catch (DateTimeParseException e) {
                erro("Data inválida. Use o formato dd/mm/aaaa, por exemplo 28/11/2026.");
            }
        }
    }

    public LocalDate lerDataOuManter(String rotulo, LocalDate atual) {
        while (true) {
            System.out.print(rotulo + " [" + (atual == null ? "vazio" : Exibicao.data(atual)) + "]: ");
            String valor = lerLinha();
            if (valor.isEmpty() && atual != null) {
                return atual;
            }
            try {
                return LocalDate.parse(valor, FORMATO_DATA);
            } catch (DateTimeParseException e) {
                erro("Data inválida. Use o formato dd/mm/aaaa, por exemplo 28/11/2026.");
            }
        }
    }

    public boolean confirmar(String pergunta) {
        while (true) {
            System.out.print(pergunta + " (s/n): ");
            String valor = lerLinha().toLowerCase();
            if (valor.equals("s") || valor.equals("sim")) {
                return true;
            }
            if (valor.equals("n") || valor.equals("nao") || valor.equals("não")) {
                return false;
            }
            erro("Responda com s ou n.");
        }
    }

    // ------------------------------------------------------------------
    // Escolha em lista
    // ------------------------------------------------------------------

    /** Mostra a lista numerada e devolve o item escolhido. */
    public <T> T escolher(String rotulo, List<T> opcoes) {
        mostrarOpcoes(opcoes);
        int indice = lerInteiro(rotulo, 1, opcoes.size());
        return opcoes.get(indice - 1);
    }

    /** Igual a escolher, mas Enter devolve null (ex.: "todas as cidades"). */
    public <T> T escolherOpcional(String rotulo, List<T> opcoes) {
        mostrarOpcoes(opcoes);
        Integer indice = lerInteiroOpcional(rotulo + " (Enter = todas)", 1, opcoes.size());
        return indice == null ? null : opcoes.get(indice - 1);
    }

    private <T> void mostrarOpcoes(List<T> opcoes) {
        for (int i = 0; i < opcoes.size(); i++) {
            System.out.println("  " + (i + 1) + ") " + opcoes.get(i));
        }
    }
}
