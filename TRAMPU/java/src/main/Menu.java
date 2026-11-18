package main;

import model.Usuario;
import service.TrampuService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Scanner;

public class Menu {
    private final Scanner entrada = new Scanner(System.in);
    private final TrampuService servico = new TrampuService();

    private String ler(String rotulo) {
        System.out.print(rotulo + " > ");
        return entrada.nextLine().trim();
    }

    private int numero(String rotulo) { return Integer.parseInt(ler(rotulo)); }
    private BigDecimal valor() { return new BigDecimal(ler("Valor por pessoa em R$").replace(',', '.')); }

    private void listar(List<?> itens) {
        if (itens.isEmpty()) System.out.println("Nenhum registro encontrado.");
        else itens.forEach(System.out::println);
    }

    private void demonstracao() {
        Usuario casa = servico.cadastrar("Casa do Largo", "casa@example.org", "", "Itu", "contratante");
        servico.cadastrar("Joana Lima", "joana@example.org", "", "Itu", "trabalhador");
        servico.publicar(casa.getId(), "Atendente de salão", "Atendimento no jantar.", "Alimentação", "Itu", "Largo do Centro",
            LocalDate.now().plusDays(3), LocalTime.of(17,0), LocalTime.of(22,0), new BigDecimal("150"), 3);
    }

    private void publicar() {
        int autor = numero("ID do contratante");
        String titulo = ler("Título"), descricao = ler("Descrição");
        for (int i = 0; i < TrampuService.CATEGORIAS.size(); i++)
            System.out.println((i+1) + " · " + TrampuService.CATEGORIAS.get(i));
        int categoria = numero("Número da categoria");
        if (categoria < 1 || categoria > TrampuService.CATEGORIAS.size()) throw new IllegalArgumentException("Categoria inválida.");
        String cidade = ler("Cidade"), local = ler("Local público");
        LocalDate data = LocalDate.parse(ler("Data AAAA-MM-DD"));
        LocalTime inicio = LocalTime.parse(ler("Início HH:mm")), fim = LocalTime.parse(ler("Fim HH:mm"));
        System.out.println(servico.publicar(autor, titulo, descricao, TrampuService.CATEGORIAS.get(categoria-1),
            cidade, local, data, inicio, fim, valor(), numero("Quantidade de vagas")));
    }

    private void executar() {
        demonstracao();
        System.out.println("TRAMPU · Console acadêmico com dados fictícios em memória");
        while (true) {
            System.out.println("\n1 Cadastrar usuário    2 Listar usuários       3 Publicar oportunidade");
            System.out.println("4 Listar oportunidades 5 Buscar oportunidade   6 Atualizar título e valor");
            System.out.println("7 Remover publicação   8 Enviar candidatura    9 Listar candidaturas");
            System.out.println("10 Decidir candidatura 11 Concluir serviço     0 Sair");
            try {
                switch (numero("Opção")) {
                    case 0: return;
                    case 1: System.out.println(servico.cadastrar(ler("Nome"), ler("E-mail fictício"), ler("Telefone opcional"),
                        ler("Cidade"), ler("Tipo: trabalhador ou contratante"))); break;
                    case 2: listar(servico.usuarios()); break;
                    case 3: publicar(); break;
                    case 4: listar(servico.buscar("")); break;
                    case 5: listar(servico.buscar(ler("Título, cidade ou categoria"))); break;
                    case 6: servico.atualizar(numero("ID do contratante"), numero("ID da oportunidade"), ler("Novo título"), valor()); break;
                    case 7: servico.remover(numero("ID do contratante"), numero("ID da oportunidade")); break;
                    case 8: System.out.println(servico.candidatar(numero("ID do trabalhador"), numero("ID da oportunidade"))); break;
                    case 9: listar(servico.candidaturas()); break;
                    case 10:
                        int dono = numero("ID do contratante"), id = numero("ID da candidatura");
                        String decisao = ler("Aprovar ou rejeitar?");
                        if (!decisao.equalsIgnoreCase("aprovar") && !decisao.equalsIgnoreCase("rejeitar"))
                            throw new IllegalArgumentException("Digite aprovar ou rejeitar.");
                        servico.decidir(dono, id, decisao.equalsIgnoreCase("aprovar")); break;
                    case 11: servico.concluir(numero("ID do contratante"), numero("ID da oportunidade")); break;
                    default: System.out.println("Escolha uma opção do menu."); continue;
                }
                System.out.println("Operação concluída.");
            } catch (NumberFormatException | DateTimeParseException e) {
                System.out.println("Formato inválido. Confira o número, a data ou o horário solicitado.");
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            } catch (NoSuchElementException e) {
                return;
            }
        }
    }

    public static void main(String[] args) { new Menu().executar(); }
}
