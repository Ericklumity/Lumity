
// =================================
// CARRINHO DE COMPRAS - LUMITY
// =================================

// Recupera os produtos salvos
function obterCarrinho() {
    return JSON.parse(localStorage.getItem("lumity-carrinho")) || [];
}

// Salva os produtos
function salvarCarrinho(carrinho) {
    localStorage.setItem("lumity-carrinho", JSON.stringify(carrinho));
}

// Atualiza o contador do cabeçalho
function atualizarContador() {
    const carrinho = obterCarrinho();

    const quantidade = carrinho.reduce(
        (total, produto) => total + produto.quantidade,
        0
    );

    const contador = document.querySelector(".cart-count");

    if (contador) {
        contador.textContent = quantidade;
    }
}

// Adiciona um produto
function adicionarAoCarrinho(produto) {
    const carrinho = obterCarrinho();

    const existente = carrinho.find(
        item => item.id === produto.id
    );

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    salvarCarrinho(carrinho);
    atualizarContador();
    renderizarCarrinho();
}

// Mostra os produtos na página do carrinho
function renderizarCarrinho() {
    const areaItens = document.getElementById("carrinho-itens");
    const totalElemento = document.getElementById("carrinho-total");

    if (!areaItens || !totalElemento) return;

    const carrinho = obterCarrinho();

    if (carrinho.length === 0) {
        areaItens.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        totalElemento.textContent = "R$ 0,00";
        return;
    }

    let total = 0;

    areaItens.innerHTML = carrinho.map(produto => {
        const subtotal = produto.preco * produto.quantidade;
        total += subtotal;

        return `
            <div class="produto-carrinho">
                <div class="produto-carrinho-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}</p>
                </div>

                <div class="produto-carrinho-acoes">
                    <button data-acao="diminuir" data-id="${produto.id}">−</button>
                    <span>${produto.quantidade}</span>
                    <button data-acao="aumentar" data-id="${produto.id}">+</button>
                    <button data-acao="remover" data-id="${produto.id}">
                        Remover
                    </button>
                </div>

                <strong>
                    ${subtotal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </strong>
            </div>
        `;
    }).join("");

    totalElemento.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Altera a quantidade ou remove um produto
function alterarProduto(id, acao) {
    let carrinho = obterCarrinho();

    const produto = carrinho.find(item => item.id === id);

    if (!produto) return;

    if (acao === "aumentar") {
        produto.quantidade++;
    }

    if (acao === "diminuir") {
        produto.quantidade--;
    }

    if (acao === "remover" || produto.quantidade <= 0) {
        carrinho = carrinho.filter(item => item.id !== id);
    }

    salvarCarrinho(carrinho);
    atualizarContador();
    renderizarCarrinho();
}

// Reconhece os cliques nos botões
document.addEventListener("click", event => {
    const botao = event.target.closest("[data-acao]");

    if (botao) {
        alterarProduto(
            botao.dataset.id,
            botao.dataset.acao
        );
    }
});

// =================================
// BOTÕES DE ADICIONAR AO CARRINHO
// =================================

document.addEventListener("click", event => {
    const botao = event.target.closest(".adicionar-carrinho");

    if (!botao) return;

    const produto = {
        id: botao.dataset.id,
        nome: botao.dataset.nome,
        preco: Number(botao.dataset.preco)
    };

    adicionarAoCarrinho(produto);

    botao.textContent = "Adicionado!";
    
    setTimeout(() => {
        botao.textContent = "Adicionar ao carrinho";
    }, 1500);
});


// Inicialização das páginas
document.addEventListener("DOMContentLoaded", () => {
    atualizarContador();
    renderizarCarrinho();
});
