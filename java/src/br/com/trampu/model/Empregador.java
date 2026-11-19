package br.com.trampu.model;

public class Empregador extends Usuario {

    /** CPF (11 dígitos) ou CNPJ (14 dígitos). */
    private String documento;
    /** Opcional: muita gente contrata como pessoa física. */
    private String nomeNegocio;

    public Empregador(int id, String nome, String username, String documento, String email,
                      String telefone, String senhaHash, Cidade cidade) {
        super(id, nome, username, email, telefone, senhaHash, cidade);
        this.documento = documento;
    }

    @Override
    public String getTipoConta() {
        return "Empregador";
    }

    @Override
    public String getNomeExibicao() {
        if (nomeNegocio == null || nomeNegocio.isBlank()) {
            return getNome();
        }
        return nomeNegocio + " (" + getNome() + ")";
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public String getNomeNegocio() {
        return nomeNegocio;
    }

    public void setNomeNegocio(String nomeNegocio) {
        this.nomeNegocio = nomeNegocio;
    }
}
