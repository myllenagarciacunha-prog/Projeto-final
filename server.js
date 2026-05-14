const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = 3000;

const DATABASE = path.join(__dirname, 'banco_de_dados.txt');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});

app.get('/api/produtos', async (requisicao, resposta) => {
    try {
        const produtos = await consultarDados();
        resposta.json(produtos);
    } catch (erro) {
        console.error(erro);
        resposta.status(500).send('Não foi possível consultar os produtos.');
    }
});

async function consultarDados() {
    const dados = (await fs.promises.readFile(DATABASE, 'utf-8')).trim().split(/\r?\n/);
    const produtos = [];
    dados.forEach(dado => {
        produtos.push(new Produto(dado));
    });
};

function Produto(linha){
    const propriedades = linha.split("|");
    const prod = {};
    propriedades.forEach(propriedade => {
        const auxiliar = propriedade.split(":");
        prod[auxiliar[0].trim()] = auxiliar[1].trim();
    });
    this.nome = prod.nome;
    this.preco = Number.parseFloat(prod.preco);
    this.estoque = Number.parseInt(prod.estoque);
}