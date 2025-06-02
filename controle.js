// Global vars
const htmlForm = document.querySelector("#form");
const descTrasacaoInput = document.getElementById("descricao");
const valorTransacaoInput = document.getElementById("montante");
const tipoTransacaoSelect = document.getElementById("tipo"); // NOVO
const balancoH1 = document.querySelector("#balanco");
const receitaP = document.querySelector("#din-positivo");
const despesaP = document.querySelector("#din-negativo");
const trasacoesUl = document.querySelector("#transacoes");
const chave_transacoes_storage = "if_financas";
const chave_contador = "contador_transacoes";

let transacoesSalvas = JSON.parse(localStorage.getItem(chave_transacoes_storage)) || [];
let contadorTransacoes = parseInt(localStorage.getItem(chave_contador)) || 0;

htmlForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const descricaoTransacaoStr = descTrasacaoInput.value.trim();
    const valorTransacaoStr = valorTransacaoInput.value.trim();
    const tipo = tipoTransacaoSelect.value;

    if (descricaoTransacaoStr === "") {
        alert("Preencha a descrição da transação!");
        descTrasacaoInput.focus();
        return;
    }

    if (valorTransacaoStr === "" || isNaN(valorTransacaoStr)) {
        alert("Preencha o valor da transação!");
        valorTransacaoInput.focus();
        return;
    }

    let valor = parseFloat(valorTransacaoStr);
    if (tipo === "despesa") valor *= -1;

    const transacao = {
        id: contadorTransacoes++,
        descricao: descricaoTransacaoStr,
        valor: valor
    };

    localStorage.setItem(chave_contador, contadorTransacoes);
    transacoesSalvas.push(transacao);
    localStorage.setItem(chave_transacoes_storage, JSON.stringify(transacoesSalvas));

    somaAoSaldo(transacao);
    somaReceitaDespesa(transacao);
    addTransacaoALista(transacao);

    descTrasacaoInput.value = "";
    valorTransacaoInput.value = "";
    tipoTransacaoSelect.value = "receita";
});

function addTransacaoALista(transacao) {
    const sinal = transacao.valor > 0 ? "" : "-";
    const classe = transacao.valor > 0 ? "positivo" : "negativo";

    const li = document.createElement("li");
    li.classList.add(classe);
    li.setAttribute("data-id", transacao.id);

    li.innerHTML = `
        ${transacao.descricao}
        <span>${sinal}R$${Math.abs(transacao.valor).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transacao.id})">X</button>
    `;
    trasacoesUl.append(li);
}

function somaReceitaDespesa(transacao) {
    const elemento = transacao.valor > 0 ? receitaP : despesaP;
    const substituir = transacao.valor > 0 ? "+ R$" : "- R$";

    let valor = elemento.innerHTML.trim().replace(substituir, "").replace(",", ".");
    valor = parseFloat(valor) || 0;
    valor += Math.abs(transacao.valor);

    elemento.innerHTML = `${substituir}${valor.toFixed(2)}`;
}

function somaAoSaldo(transacao) {
    let total = parseFloat(balancoH1.innerHTML.replace("R$", "").replace(",", ".")) || 0;
    total += transacao.valor;
    balancoH1.innerHTML = `R$${total.toFixed(2)}`;
}

function carregaDados() {
    trasacoesUl.innerHTML = "";
    receitaP.innerHTML = "+ R$0.00";
    despesaP.innerHTML = "- R$0.00";
    balancoH1.innerHTML = "R$0.00";

    transacoesSalvas.forEach(transacao => {
        somaAoSaldo(transacao);
        somaReceitaDespesa(transacao);
        addTransacaoALista(transacao);
    });
}

function removeTransaction(transactionId) {
    const index = transacoesSalvas.findIndex((t) => t.id === transactionId);
    if (index === -1) return;

    const transacao = transacoesSalvas[index];

    atualizaSaldoRemovido(transacao);
    transacoesSalvas.splice(index, 1);
    localStorage.setItem(chave_transacoes_storage, JSON.stringify(transacoesSalvas));

    const li = trasacoesUl.querySelector(`li[data-id="${transactionId}"]`);
    if (li) trasacoesUl.removeChild(li);
}

function atualizaSaldoRemovido(transacao) {
    let total = parseFloat(balancoH1.innerHTML.replace("R$", "").replace(",", ".")) || 0;
    total -= transacao.valor;
    balancoH1.innerHTML = `R$${total.toFixed(2)}`;

    let valorAtualElemento, novoValor;
    if (transacao.valor > 0) {
        valorAtualElemento = parseFloat(receitaP.innerHTML.replace("+ R$", "").replace(",", ".")) || 0;
        novoValor = valorAtualElemento - transacao.valor;
        receitaP.innerHTML = `+ R$${novoValor.toFixed(2)}`;
    } else {
        valorAtualElemento = parseFloat(despesaP.innerHTML.replace("- R$", "").replace(",", ".")) || 0;
        novoValor = valorAtualElemento - Math.abs(transacao.valor);
        despesaP.innerHTML = `- R$${novoValor.toFixed(2)}`;
    }
}

carregaDados();