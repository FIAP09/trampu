package br.com.trampu.service;

/**
 * Validações de formato usadas pelos serviços.
 * Cada método lança RegraNegocioException com uma mensagem clara.
 */
public final class Validador {

    private Validador() {
    }

    public static String obrigatorio(String valor, String campo, int tamanhoMaximo) {
        if (valor == null || valor.isBlank()) {
            throw new RegraNegocioException(campo + " é obrigatório.");
        }
        String limpo = valor.trim();
        if (limpo.length() > tamanhoMaximo) {
            throw new RegraNegocioException(campo + " pode ter no máximo " + tamanhoMaximo + " caracteres.");
        }
        return limpo;
    }

    /** Campo opcional: devolve null se vazio. */
    public static String opcional(String valor, String campo, int tamanhoMaximo) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        return obrigatorio(valor, campo, tamanhoMaximo);
    }

    public static String username(String valor) {
        String u = obrigatorio(valor, "Username", 30).toLowerCase();
        if (u.startsWith("@")) {
            u = u.substring(1);
        }
        if (!u.matches("[a-z0-9._]{3,30}")) {
            throw new RegraNegocioException(
                    "Username deve ter de 3 a 30 caracteres: letras minúsculas, números, ponto ou _ (sem espaço).");
        }
        return u;
    }

    public static String email(String valor) {
        String e = obrigatorio(valor, "E-mail", 100).toLowerCase();
        if (!e.matches("[^@\\s]+@[^@\\s]+\\.[^@\\s]+")) {
            throw new RegraNegocioException("E-mail inválido. Exemplo: nome@email.com");
        }
        return e;
    }

    /** Aceita com ou sem máscara; guarda só os dígitos (DDD + número). */
    public static String telefone(String valor) {
        String digitos = somenteDigitos(obrigatorio(valor, "Telefone", 20));
        if (digitos.length() < 10 || digitos.length() > 11) {
            throw new RegraNegocioException("Telefone deve ter DDD + número (10 ou 11 dígitos).");
        }
        return digitos;
    }

    public static String cpf(String valor) {
        String digitos = somenteDigitos(obrigatorio(valor, "CPF", 14));
        if (digitos.length() != 11) {
            throw new RegraNegocioException("CPF deve ter 11 dígitos.");
        }
        return digitos;
    }

    /** CPF (11 dígitos) ou CNPJ (14 dígitos). */
    public static String documento(String valor) {
        String digitos = somenteDigitos(obrigatorio(valor, "CPF/CNPJ", 18));
        if (digitos.length() != 11 && digitos.length() != 14) {
            throw new RegraNegocioException("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos).");
        }
        return digitos;
    }

    public static void senhaForte(String senha) {
        if (senha == null || senha.length() < 8) {
            throw new RegraNegocioException("A senha precisa ter pelo menos 8 caracteres.");
        }
        boolean temLetra = false;
        boolean temNumero = false;
        for (char c : senha.toCharArray()) {
            if (Character.isLetter(c)) {
                temLetra = true;
            }
            if (Character.isDigit(c)) {
                temNumero = true;
            }
        }
        if (!temLetra || !temNumero) {
            throw new RegraNegocioException("A senha precisa ter letras e números.");
        }
    }

    public static String somenteDigitos(String valor) {
        return valor.replaceAll("\\D", "");
    }
}
