package br.com.trampu.service;

import br.com.trampu.dados.BaseDeDados;
import br.com.trampu.model.Categoria;
import br.com.trampu.model.Cidade;

import java.util.List;

/** Cidades e categorias atendidas pela Trampu. */
public class CatalogoService {

    private final BaseDeDados base;

    public CatalogoService(BaseDeDados base) {
        this.base = base;
    }

    public List<Cidade> listarCidades() {
        return base.getCidades();
    }

    public List<Categoria> listarCategorias() {
        return base.getCategorias();
    }

    public Cidade buscarCidade(int id) {
        for (Cidade c : base.getCidades()) {
            if (c.getId() == id) {
                return c;
            }
        }
        throw new RegraNegocioException("Cidade não encontrada.");
    }

    public Categoria buscarCategoria(int id) {
        for (Categoria c : base.getCategorias()) {
            if (c.getId() == id) {
                return c;
            }
        }
        throw new RegraNegocioException("Categoria não encontrada.");
    }
}
