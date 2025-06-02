// Global vars
const htmlForm = document.querySelector("#form");
const descTrasacaoInput = document.getElementById("descricao");
const valorTransacaoInput = document.getElementById("montante");
const balancoH1 = document.querySelector("#balanco");
const receitaP = document.querySelector("#din-positivo");
const despesaP = document.querySelector("#din-negativo");
const trasacoesUl = document.querySelector("#transacoes");
const chave_transacoes_storage = "if_financas";


let transacoesSalvas;
try {
    transacoesSalvas = JSON.parse(localStorage.getItem(chave_transacoes_storage));
} catch (error) {
    transacoesSalvas = [];
}

if (transacoesSalvas == null) {
    transacoesSalvas = [];
}



htmlForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const descricaoTransacaoStr = descTrasacaoInput.value.trim();
    const valorTransacaoStr = valorTransacaoInput.value.trim();

    if (descricaoTransacaoStr === "") {
        alert("Preencha a descrição da transação!");
        descTrasacao.focus();
        return;
    }

    if (valorTransacaoStr === "") {
        alert("Preencha o valor da transação!");
        valorTransacao.focus();
        return;
    }

    const transacao = {
        id: parseInt(Math.random() * 5000),
        descricao: descricaoTransacaoStr,
        valor: parseFloat(valorTransacaoStr)
    }

    somaAoSaldo(transacao);
    somaReceitaDespesa(transacao);
    addTransacaoALista(transacao);

    transacoesSalvas.push(transacao);
    localStorage.setItem(chave_transacoes_storage, JSON.stringify(transacoesSalvas));
    descTrasacaoInput.value = "";
    valorTransacaoInput.value = "";
});

function addTransacaoALista(transacao) {
    const sinal = transacao.valor > 0 ? "" : "-";
    const classe = transacao.valor > 0 ? "positivo" : "negativo";

    let liStr = `${transacao.descricao}
                     <span>${sinal}R$${Math.abs(transacao.valor)}</span>
                     <button class="delete-btn" onclick="removeTransaction(${transacao.id})">X</button>`
    const li = document.createElement("li");
    li.classList.add(classe);
    li.innerHTML = liStr;
    trasacoesUl.append(li);
}

function somaReceitaDespesa(transacao) {
    const elemento = transacao.valor > 0 ? receitaP : despesaP;
    const substituir = transacao.valor > 0 ? "+ R$" : "- R$";

    let valor = elemento.innerHTML.trim().replace(substituir, "");

    valor = parseFloat(valor);
    valor += Math.abs(transacao.valor);

    elemento.innerHTML = `${substituir}${valor}`;
}

function somaAoSaldo(transacao) {
    const valor = transacao.valor;

    let total = balancoH1.innerHTML.trim();
    total = total.replace("R$", "");
    total = parseFloat(total);
    total += valor;
    balancoH1.innerHTML = `R$${total.toFixed(2)}`;
}

function carregaDados(){
    trasacoesUl.innerHTML = "";
    receitaP.innerHTML = "R$0.00";
    despesaP.innerHTML = "R$0.00";
    balancoH1.innerHTML = "R$0.00";

    for (let i= 0 ; i < transacoesSalvas.length; i++){
        somaAoSaldo(transacoesSalvas[i]);
        somaReceitaDespesa(transacoesSalvas[i]);
        addTransacaoALista(transacoesSalvas[i]);
    }
}

function removeTransaction(transactionId){
    const transactionIndex = transacoesSalvas.findIndex((transaction) => transaction.id == transactionId);
    transacoesSalvas.splice(transactionIndex, 1);

    localStorage.setItem(chave_transacoes_storage, JSON.stringify(transacoesSalvas));

    carregaDados();

}

carregaDados();

