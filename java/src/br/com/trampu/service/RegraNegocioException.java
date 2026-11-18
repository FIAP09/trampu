package br.com.trampu.service;

/**
 * Erro de validação ou de regra de negócio.
 * A mensagem é pensada para ser mostrada direto ao usuário.
 */
public class RegraNegocioException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
