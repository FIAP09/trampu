package br.com.trampu.service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Hash de senha com PBKDF2-HMAC-SHA256, usando apenas o JDK.
 *
 * Formato salvo (igual ao do banco e da web):
 *   pbkdf2_sha256$<iteracoes>$<salt base64>$<hash base64>
 *
 * - O salt é aleatório e diferente para cada usuário.
 * - 600.000 iterações é a recomendação da OWASP para PBKDF2-SHA256.
 * - As iterações ficam dentro do texto salvo, então dá para aumentar
 *   no futuro sem quebrar as senhas antigas.
 */
public final class SenhaUtil {

    private static final String ALGORITMO = "PBKDF2WithHmacSHA256";
    private static final String PREFIXO = "pbkdf2_sha256";
    private static final int ITERACOES = 600_000;
    private static final int TAMANHO_SALT = 16;     // bytes
    private static final int TAMANHO_HASH = 256;    // bits

    private static final SecureRandom RANDOM = new SecureRandom();

    private SenhaUtil() {
    }

    public static String gerarHash(String senha) {
        byte[] salt = new byte[TAMANHO_SALT];
        RANDOM.nextBytes(salt);
        byte[] hash = calcular(senha, salt, ITERACOES);
        Base64.Encoder b64 = Base64.getEncoder();
        return PREFIXO + "$" + ITERACOES + "$" + b64.encodeToString(salt) + "$" + b64.encodeToString(hash);
    }

    public static boolean verificar(String senha, String hashSalvo) {
        if (senha == null || hashSalvo == null) {
            return false;
        }
        String[] partes = hashSalvo.split("\\$");
        if (partes.length != 4 || !PREFIXO.equals(partes[0])) {
            return false;
        }
        try {
            int iteracoes = Integer.parseInt(partes[1]);
            byte[] salt = Base64.getDecoder().decode(partes[2]);
            byte[] esperado = Base64.getDecoder().decode(partes[3]);
            byte[] calculado = calcular(senha, salt, iteracoes);
            // comparação em tempo constante
            return MessageDigest.isEqual(esperado, calculado);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private static byte[] calcular(String senha, byte[] salt, int iteracoes) {
        PBEKeySpec spec = new PBEKeySpec(senha.toCharArray(), salt, iteracoes, TAMANHO_HASH);
        try {
            return SecretKeyFactory.getInstance(ALGORITMO).generateSecret(spec).getEncoded();
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("PBKDF2 indisponível nesta JVM", e);
        } finally {
            spec.clearPassword();
        }
    }
}
