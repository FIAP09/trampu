// Servidor estático para abrir todas as páginas na mesma origem local.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const raiz = path.join(__dirname, "web");
const tipos = {".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8",
    ".js":"text/javascript; charset=utf-8", ".jpg":"image/jpeg", ".svg":"image/svg+xml"};
const arquivos = new Map();
for (const pasta of ["", "css", "js", "assets"]) {
    for (const item of fs.readdirSync(path.join(raiz, pasta), {withFileTypes:true})) {
        if (item.isFile() && tipos[path.extname(item.name)]) {
            arquivos.set("/"+path.posix.join(pasta, item.name),path.join(raiz, pasta, item.name));
        }
    }
}
const porta = Number(process.env.PORT || 8080);
const servidor = http.createServer((req,res) => {
    const url = req.url.split("?")[0];
    const arquivo = arquivos.get(url === "/" ? "/index.html" : url);
    if (!arquivo || !["GET","HEAD"].includes(req.method)) {
        res.writeHead(404).end("Arquivo indisponível.");
        return;
    }
    fs.readFile(arquivo,(erro, dados) => {
        if (erro) { res.writeHead(500).end("Falha na leitura do arquivo."); return; }
        res.writeHead(200,{"Content-Type":tipos[path.extname(arquivo)]});
        res.end(req.method==="HEAD"?undefined:dados);
    });
});
servidor.on("error",erro => {
    console.error("Falha ao iniciar o servidor local.", erro.message);
    process.exitCode = 1;
});
servidor.listen(porta,"127.0.0.1",() => console.log("Trampu disponível em http://127.0.0.1:"+servidor.address().port));
