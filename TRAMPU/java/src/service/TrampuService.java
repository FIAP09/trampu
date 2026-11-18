package service;

import model.Candidatura;
import model.Oportunidade;
import model.Usuario;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class TrampuService {
    public static final List<String> CATEGORIAS = List.of("Alimentação", "Eventos", "Limpeza", "Jardinagem", "Comércio", "Serviços gerais");
    private final List<Usuario> usuarios = new ArrayList<>();
    private final List<Oportunidade> oportunidades = new ArrayList<>();
    private final List<Candidatura> candidaturas = new ArrayList<>();
    private int proximoIdOportunidade = 1;

    private void exigir(boolean condicao, String mensagem) {
        if (!condicao) throw new IllegalArgumentException(mensagem);
    }

    private String texto(String valor, String campo) {
        exigir(valor != null && !valor.isBlank(), "Preencha " + campo + ".");
        return valor.trim();
    }

    private BigDecimal validarValor(BigDecimal valor) {
        exigir(valor != null && valor.signum() > 0 && valor.stripTrailingZeros().scale() <= 2,
               "Informe remuneração positiva com até duas casas decimais.");
        return valor.setScale(2);
    }

    public Usuario cadastrar(String nome, String email, String telefone, String cidade, String tipo) {
        String contato = texto(email, "o e-mail").toLowerCase(Locale.ROOT);
        exigir(contato.matches("[^\\s@]+@[^\\s@]+\\.[^\\s@]+"), "E-mail inválido.");
        exigir(usuarios.stream().noneMatch(u -> u.getEmail().equals(contato)), "E-mail já cadastrado.");
        exigir("trabalhador".equals(tipo) || "contratante".equals(tipo), "Perfil inválido.");
        String tel = telefone == null ? "" : telefone.trim();
        exigir(tel.isEmpty() || tel.replaceAll("[ ()-]", "").matches("[0-9]{10,11}"), "Telefone inválido.");
        Usuario u = new Usuario(usuarios.size()+1, texto(nome, "o nome"), contato, tel, texto(cidade, "a cidade"), tipo);
        usuarios.add(u);
        return u;
    }

    public Usuario usuario(int id) {
        return usuarios.stream().filter(u -> u.getId() == id).findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));
    }

    public Oportunidade oportunidade(int id) {
        return oportunidades.stream().filter(v -> v.getId() == id).findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Oportunidade não encontrada."));
    }

    public List<Usuario> usuarios() { return List.copyOf(usuarios); }
    public List<Candidatura> candidaturas() { return List.copyOf(candidaturas); }

    public List<Oportunidade> buscar(String termo) {
        String filtro = termo.trim().toLowerCase(Locale.ROOT);
        List<Oportunidade> resultado = new ArrayList<>();
        for (Oportunidade v : oportunidades) {
            String campos = v.getTitulo() + " " + v.getCidade() + " " + v.getCategoria();
            if (campos.toLowerCase(Locale.ROOT).contains(filtro)) resultado.add(v);
        }
        return resultado;
    }

    public Oportunidade publicar(int autor, String titulo, String descricao, String categoria, String cidade,
                                String local, LocalDate data, LocalTime inicio, LocalTime fim, BigDecimal valor, int vagas) {
        Usuario dono = usuario(autor);
        exigir(dono.getTipoUsuario().equals("contratante"), "Somente contratantes podem publicar.");
        exigir(CATEGORIAS.contains(categoria), "Escolha uma categoria do catálogo.");
        exigir(data != null && inicio != null && data.atTime(inicio).isAfter(LocalDateTime.now()), "O início precisa estar no futuro.");
        exigir(fim != null && fim.isAfter(inicio), "O fim precisa ser posterior ao início no mesmo dia.");
        exigir(vagas > 0, "Informe pelo menos uma vaga.");
        Oportunidade v = new Oportunidade(proximoIdOportunidade, dono, texto(titulo,"o título"), texto(descricao,"a descrição"),
            categoria, texto(cidade,"a cidade"), texto(local,"o local"), data, inicio, fim, validarValor(valor), vagas);
        oportunidades.add(v);
        proximoIdOportunidade++;
        return v;
    }

    private void verificarAberta(Oportunidade v) {
        exigir(v.getStatus().equals("Aberta") && v.getDataServico().atTime(v.getInicio()).isAfter(LocalDateTime.now()),
            "Esta oportunidade já não recebe candidaturas.");
    }

    public Candidatura candidatar(int autor, int vaga) {
        Usuario trabalhador = usuario(autor);
        Oportunidade v = oportunidade(vaga);
        exigir(trabalhador.getTipoUsuario().equals("trabalhador"), "Somente trabalhadores podem se candidatar.");
        verificarAberta(v);
        exigir(candidaturas.stream().noneMatch(c -> c.getTrabalhador() == trabalhador && c.getOportunidade() == v),
            "Candidatura já registrada.");
        Candidatura c = new Candidatura(candidaturas.size()+1, trabalhador, v, LocalDate.now());
        candidaturas.add(c);
        return c;
    }

    private void verificarDono(int autor, Oportunidade v) {
        exigir(v.getContratante().getId() == autor, "Operação exclusiva do contratante responsável.");
    }

    private void rejeitarPendentes(Oportunidade v) {
        candidaturas.stream().filter(c -> c.getOportunidade() == v && c.getStatus().equals("Pendente"))
            .forEach(c -> c.decidir(false));
    }

    public void decidir(int autor, int id, boolean aprovar) {
        Candidatura c = candidaturas.stream().filter(x -> x.getId() == id).findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Candidatura não encontrada."));
        Oportunidade v = c.getOportunidade();
        verificarDono(autor, v);
        verificarAberta(v);
        exigir(c.getStatus().equals("Pendente"), "A candidatura já recebeu uma decisão.");
        long ocupadas = candidaturas.stream().filter(x -> x.getOportunidade() == v && x.getStatus().equals("Aprovada")).count();
        exigir(ocupadas < v.getQuantidadeVagas(), "Vagas esgotadas.");
        c.decidir(aprovar);
        if (aprovar && ocupadas+1 == v.getQuantidadeVagas()) {
            v.preencher();
            rejeitarPendentes(v);
        }
    }

    public void concluir(int autor, int id) {
        Oportunidade v = oportunidade(id);
        verificarDono(autor, v);
        exigir(!v.getStatus().equals("Concluída"), "Oportunidade já concluída.");
        exigir(!v.getDataServico().atTime(v.getFim()).isAfter(LocalDateTime.now()), "Aguarde o fim do serviço.");
        v.concluir();
        rejeitarPendentes(v);
    }

    private Oportunidade editavel(int autor, int id) {
        Oportunidade v = oportunidade(id);
        verificarDono(autor, v);
        verificarAberta(v);
        exigir(candidaturas.stream().noneMatch(c -> c.getOportunidade() == v), "Já há candidatura vinculada a esta oportunidade.");
        return v;
    }

    public void atualizar(int autor, int id, String titulo, BigDecimal valor) {
        Oportunidade v = editavel(autor, id);
        String novoTitulo = texto(titulo, "o título");
        BigDecimal novaRemuneracao = validarValor(valor);
        v.setTitulo(novoTitulo);
        v.setRemuneracao(novaRemuneracao);
    }

    public void remover(int autor, int id) {
        oportunidades.remove(editavel(autor, id));
    }
}
