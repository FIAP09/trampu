package model;

public class Usuario {
    private final int id;
    private final String nome;
    private final String email;
    private final String telefone;
    private final String cidade;
    private final String tipoUsuario;

    public Usuario(int id, String nome, String email, String telefone, String cidade, String tipoUsuario) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cidade = cidade;
        this.tipoUsuario = tipoUsuario;
    }

    public int getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getTelefone() { return telefone; }
    public String getCidade() { return cidade; }
    public String getTipoUsuario() { return tipoUsuario; }
    @Override
    public String toString() {
        return id + " | " + nome + " | " + tipoUsuario + " | " + cidade;
    }
}
