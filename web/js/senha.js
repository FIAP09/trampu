/* =====================================================================
   Hash de senha com PBKDF2-HMAC-SHA256 (Web Crypto, nativo do navegador).
   Mesmo formato do Java (SenhaUtil) e do banco:
     pbkdf2_sha256$<iteracoes>$<salt base64>$<hash base64>
   ===================================================================== */

const Senha = {
  ITERACOES: 600000,

  disponivel() {
    return Boolean(window.crypto && window.crypto.subtle);
  },

  paraBase64(bytes) {
    let texto = "";
    for (let i = 0; i < bytes.length; i++) {
      texto += String.fromCharCode(bytes[i]);
    }
    return btoa(texto);
  },

  deBase64(base64) {
    const texto = atob(base64);
    const bytes = new Uint8Array(texto.length);
    for (let i = 0; i < texto.length; i++) {
      bytes[i] = texto.charCodeAt(i);
    }
    return bytes;
  },

  async calcular(senha, salt, iteracoes) {
    const chave = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: salt, iterations: iteracoes },
      chave, 256
    );
    return new Uint8Array(bits);
  },

  async gerarHash(senha) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await this.calcular(senha, salt, this.ITERACOES);
    return "pbkdf2_sha256$" + this.ITERACOES + "$" + this.paraBase64(salt) + "$" + this.paraBase64(hash);
  },

  async verificar(senha, hashSalvo) {
    const partes = String(hashSalvo).split("$");
    if (partes.length !== 4 || partes[0] !== "pbkdf2_sha256") {
      return false;
    }
    const iteracoes = parseInt(partes[1], 10);
    const salt = this.deBase64(partes[2]);
    const esperado = this.deBase64(partes[3]);
    const calculado = await this.calcular(senha, salt, iteracoes);
    if (calculado.length !== esperado.length) {
      return false;
    }
    let diferenca = 0;
    for (let i = 0; i < calculado.length; i++) {
      diferenca |= calculado[i] ^ esperado[i];
    }
    return diferenca === 0;
  }
};
