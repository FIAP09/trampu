package br.com.trampu;

import br.com.trampu.dados.BaseDeDados;
import br.com.trampu.service.CandidaturaService;
import br.com.trampu.service.CatalogoService;
import br.com.trampu.service.UsuarioService;
import br.com.trampu.service.VagaService;
import br.com.trampu.view.Console;
import br.com.trampu.view.MenuPrincipal;

/**
 * Trampu - trabalho local para cidades pequenas.
 * Global Solution 2026/2 - CitizenTech - FIAP
 */
public class Main {

    public static void main(String[] args) {
        BaseDeDados base = new BaseDeDados();

        CatalogoService catalogo = new CatalogoService(base);
        UsuarioService usuarioService = new UsuarioService(base);
        VagaService vagaService = new VagaService(base);
        CandidaturaService candidaturaService = new CandidaturaService(base, vagaService);

        MenuPrincipal menu = new MenuPrincipal(new Console(), catalogo, usuarioService, vagaService, candidaturaService);
        menu.iniciar();
    }
}
