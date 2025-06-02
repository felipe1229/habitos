// js/financeiro.js - Lógica específica da página Financeiro

document.addEventListener('DOMContentLoaded', () => {
    console.log("Página Financeiro carregada e script financeiro.js executado.");

    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const addTransactionForm = document.getElementById('add-transaction-form');
    const transactionDescriptionInput = document.getElementById('transaction-description');
    const transactionAmountInput = document.getElementById('transaction-amount');
    const transactionTypeInput = document.getElementById('transaction-type');
    const transactionCategoryInput = document.getElementById('transaction-category');
    const transactionDateInput = document.getElementById('transaction-date');
    
    const transactionsListEl = document.getElementById('transactions-list');
    const transactionsEmptyMessageEl = document.getElementById('transactions-empty-message');

    const saldoAtualValorEl = document.getElementById('saldo-atual-valor'); 
    const saldoContainerEl = document.querySelector('.saldo-container'); 
    const submitTransactionButton = addTransactionForm ? addTransactionForm.querySelector('button[type="submit"]') : null;
    
    const transactionFormErrorEl = document.getElementById('transaction-form-error');
    const filterTransactionTypeEl = document.getElementById('filter-transaction-type');

    // Elementos para o Resumo Mensal
    const btnMesAnteriorResumoEl = document.getElementById('btn-mes-anterior-resumo');
    const btnProximoMesResumoEl = document.getElementById('btn-proximo-mes-resumo');
    const mesAnoResumoEl = document.getElementById('mes-ano-resumo');
    const totalReceitasMesEl = document.getElementById('total-receitas-mes');
    const totalDespesasMesEl = document.getElementById('total-despesas-mes');
    const saldoMesValorEl = document.getElementById('saldo-mes-valor');
    const saldoMesContainerEl = document.querySelector('.saldo-mes-container'); // Container para o saldo do mês

    // --- ESTADO DA APLICAÇÃO (DADOS) ---
    let transactions = JSON.parse(localStorage.getItem('minhasTransacoesFinanceiras')) || [];
    let editingTransactionId = null; 
    let dataResumoExibida = new Date(); // Data para controlar o mês/ano do resumo mensal

    // --- FUNÇÕES DE MANIPULAÇÃO DE DADOS E LOCALSTORAGE ---
    /** Salva o array de transações atual no localStorage. */
    function salvarTransacoes() {
        localStorage.setItem('minhasTransacoesFinanceiras', JSON.stringify(transactions));
    }

    // --- FUNÇÕES DE UI E RENDERIZAÇÃO ---
    /** Define a data de hoje como padrão para o input de data da transação. */
    function setDefaultDate() {
        if (transactionDateInput && !transactionDateInput.value) { 
            const hoje = new Date();
            const ano = hoje.getFullYear();
            const mes = String(hoje.getMonth() + 1).padStart(2, '0');
            const dia = String(hoje.getDate()).padStart(2, '0');
            transactionDateInput.value = `${ano}-${mes}-${dia}`;
        }
    }

    /** Calcula o saldo GERAL com base em TODAS as transações e atualiza a exibição. */
    function calcularEExibirSaldoGlobal() {
        if (!saldoAtualValorEl || !saldoContainerEl) {
            console.error("DEBUG: Elementos do saldo global não foram encontrados para exibição.");
            return;
        }

        let saldoGlobal = 0;
        transactions.forEach(trans => {
            if (trans.type === 'receita') {
                saldoGlobal += parseFloat(trans.amount); 
            } else if (trans.type === 'despesa') {
                saldoGlobal -= parseFloat(trans.amount); 
            }
        });

        saldoAtualValorEl.textContent = `R$ ${saldoGlobal.toFixed(2).replace('.', ',')}`;

        saldoContainerEl.classList.remove('saldo-positivo', 'saldo-negativo', 'saldo-neutro');
        if (saldoGlobal > 0) {
            saldoContainerEl.classList.add('saldo-positivo');
        } else if (saldoGlobal < 0) {
            saldoContainerEl.classList.add('saldo-negativo');
        } else {
            saldoContainerEl.classList.add('saldo-neutro');
        }
    }
    
    /** Calcula e exibe o resumo financeiro (receitas, despesas, saldo) para um mês/ano específico.
     * @param {Date} dataParaResumo - Um objeto Date representando qualquer dia do mês/ano desejado.
     */
    function renderizarResumoMensal(dataParaResumo) {
        if (!mesAnoResumoEl || !totalReceitasMesEl || !totalDespesasMesEl || !saldoMesValorEl || !saldoMesContainerEl) {
            console.error("DEBUG: Elementos do resumo mensal não encontrados.");
            return;
        }

        const ano = dataParaResumo.getFullYear();
        const mes = dataParaResumo.getMonth(); // 0-11

        const nomesDosMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        mesAnoResumoEl.textContent = `${nomesDosMeses[mes]} ${ano}`;

        let totalReceitasDoMes = 0;
        let totalDespesasDoMes = 0;

        transactions.forEach(trans => {
            const dataTransacao = new Date(trans.date + "T00:00:00"); // Adiciona T00:00:00 para consistência de fuso
            if (dataTransacao.getFullYear() === ano && dataTransacao.getMonth() === mes) {
                if (trans.type === 'receita') {
                    totalReceitasDoMes += parseFloat(trans.amount);
                } else if (trans.type === 'despesa') {
                    totalDespesasDoMes += parseFloat(trans.amount);
                }
            }
        });

        const saldoDoMes = totalReceitasDoMes - totalDespesasDoMes;

        totalReceitasMesEl.textContent = `R$ ${totalReceitasDoMes.toFixed(2).replace('.', ',')}`;
        totalDespesasMesEl.textContent = `R$ ${totalDespesasDoMes.toFixed(2).replace('.', ',')}`;
        saldoMesValorEl.textContent = `R$ ${saldoDoMes.toFixed(2).replace('.', ',')}`;

        saldoMesContainerEl.classList.remove('saldo-positivo', 'saldo-negativo', 'saldo-neutro');
        if (saldoDoMes > 0) saldoMesContainerEl.classList.add('saldo-positivo');
        else if (saldoDoMes < 0) saldoMesContainerEl.classList.add('saldo-negativo');
        else saldoMesContainerEl.classList.add('saldo-neutro');
    }


    /** Prepara o formulário para edição de uma transação específica. */
    function popularFormularioParaEdicao(transactionId) {
        const transacaoParaEditar = transactions.find(t => t.id === transactionId);
        if (transacaoParaEditar && addTransactionForm) {
            limparErroFormularioTransacao(); 
            editingTransactionId = transactionId; 

            transactionDescriptionInput.value = transacaoParaEditar.description;
            transactionAmountInput.value = transacaoParaEditar.amount;
            transactionTypeInput.value = transacaoParaEditar.type;
            transactionCategoryInput.value = transacaoParaEditar.category;
            transactionDateInput.value = transacaoParaEditar.date;

            if (submitTransactionButton) {
                submitTransactionButton.textContent = 'Salvar Alterações';
            }
            transactionDescriptionInput.focus(); 
        } else {
            console.error("Transação não encontrada para edição ou formulário não existe.");
        }
    }
    
    /** Reseta o formulário para o modo de adição. */
    function resetarFormularioParaAdicao() {
        editingTransactionId = null; 
        if (addTransactionForm) addTransactionForm.reset();
        if (submitTransactionButton) submitTransactionButton.textContent = 'Adicionar Transação';
        setDefaultDate(); 
        if (transactionCategoryInput) {
            const optionSelected = transactionCategoryInput.querySelector('option[selected]');
            if (optionSelected) {
                 transactionCategoryInput.value = optionSelected.value;
            } else if (transactionCategoryInput.options.length > 0) {
                 transactionCategoryInput.value = "outras-despesas"; 
            }
        }
        limparErroFormularioTransacao(); 
    }

    /** Renderiza a lista de transações na tela usando <li>, aplicando filtros se houver. */
    function renderizarTransacoes() {
        if (!transactionsListEl || !transactionsEmptyMessageEl || !filterTransactionTypeEl) {
            console.error("DEBUG: Elementos da lista de transações, mensagem de vazio ou filtro não encontrados.");
            return;
        }
        transactionsListEl.innerHTML = ''; 

        const tipoFiltrado = filterTransactionTypeEl.value;
        let transacoesParaExibir = transactions;

        if (tipoFiltrado !== "todos") {
            transacoesParaExibir = transactions.filter(trans => trans.type === tipoFiltrado);
        }

        if (transacoesParaExibir.length === 0) {
            if (transactionsEmptyMessageEl) {
                if (tipoFiltrado !== "todos") {
                    transactionsEmptyMessageEl.textContent = `Nenhuma transação do tipo "${tipoFiltrado}" encontrada.`;
                } else {
                    transactionsEmptyMessageEl.textContent = 'Nenhuma transação registrada ainda.';
                }
                transactionsEmptyMessageEl.style.display = 'block'; 
            }
        } else {
            if (transactionsEmptyMessageEl) {
                transactionsEmptyMessageEl.style.display = 'none'; 
            }

            const transacoesOrdenadas = [...transacoesParaExibir].sort((a, b) => new Date(b.date) - new Date(a.date));

            transacoesOrdenadas.forEach(trans => {
                const listItem = document.createElement('li');
                listItem.dataset.transactionId = trans.id; 

                const corBordaTipo = trans.type === 'receita' ? 'var(--cor-sucesso-verde)' : 'var(--cor-destaque-vermelho)';
                listItem.style.borderLeftColor = corBordaTipo;
                
                const [ano, mes, dia] = trans.date.split('-');
                const dataFormatada = `${dia}/${mes}/${ano}`;
                const valorFormatado = parseFloat(trans.amount).toFixed(2).replace('.', ',');
                const tipoFormatado = trans.type.charAt(0).toUpperCase() + trans.type.slice(1);
                const categoriaFormatada = trans.category ? (trans.category.charAt(0).toUpperCase() + trans.category.slice(1).replace(/-/g, ' ')) : 'N/A';

                const row1 = document.createElement('div');
                row1.classList.add('transaction-item-row');
                const descriptionSpan = document.createElement('span');
                descriptionSpan.classList.add('transaction-description');
                descriptionSpan.textContent = trans.description;
                row1.appendChild(descriptionSpan);
                const amountSpan = document.createElement('span');
                amountSpan.classList.add('transaction-amount', trans.type); 
                amountSpan.textContent = `R$ ${valorFormatado}`;
                row1.appendChild(amountSpan);
                listItem.appendChild(row1);

                const row2 = document.createElement('div');
                row2.classList.add('transaction-item-row', 'transaction-details');
                const dateSpan = document.createElement('span');
                dateSpan.textContent = `Data: ${dataFormatada}`;
                row2.appendChild(dateSpan);
                const typeSpan = document.createElement('span');
                typeSpan.textContent = `Tipo: ${tipoFormatado}`;
                row2.appendChild(typeSpan);
                const categorySpan = document.createElement('span');
                categorySpan.textContent = `Categoria: ${categoriaFormatada}`;
                row2.appendChild(categorySpan);
                listItem.appendChild(row2);
                
                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('transaction-item-row', 'transaction-actions');
                const editButton = document.createElement('button');
                editButton.classList.add('btn', 'btn-secondary-inline', 'btn-edit-transaction'); 
                editButton.textContent = 'Editar';
                editButton.setAttribute('aria-label', `Editar ${trans.description}`);
                editButton.addEventListener('click', (e) => { e.stopPropagation(); popularFormularioParaEdicao(trans.id); });
                actionsDiv.appendChild(editButton);
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('btn', 'btn-delete-transaction'); 
                deleteButton.textContent = 'Excluir';
                deleteButton.setAttribute('aria-label', `Excluir ${trans.description}`);
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`Tem certeza que deseja excluir a transação "${trans.description}"?`)) {
                        transactions = transactions.filter(t => t.id !== trans.id);
                        salvarTransacoes();
                        renderizarTransacoes(); 
                        if (editingTransactionId === trans.id) resetarFormularioParaAdicao();
                    }
                });
                actionsDiv.appendChild(deleteButton);
                listItem.appendChild(actionsDiv);
                transactionsListEl.appendChild(listItem);
            });
        }
        calcularEExibirSaldoGlobal(); // Calcula e exibe o saldo global
        renderizarResumoMensal(dataResumoExibida); // Renderiza o resumo para o mês atual do resumo
    }

    // --- FUNÇÕES DE FEEDBACK DE ERRO DO FORMULÁRIO DE TRANSAÇÃO ---
    function exibirErroFormularioTransacao(mensagem) {
        if (transactionFormErrorEl) {
            transactionFormErrorEl.textContent = mensagem;
            transactionFormErrorEl.style.display = 'block';
        } else {
            console.error("Elemento de erro do formulário de transação não encontrado:", mensagem);
        }
    }

    function limparErroFormularioTransacao() {
        if (transactionFormErrorEl) {
            transactionFormErrorEl.textContent = '';
            transactionFormErrorEl.style.display = 'none';
        }
    }

    // --- EVENT LISTENERS ---
    if (addTransactionForm) {
        addTransactionForm.addEventListener('submit', (evento) => {
            evento.preventDefault();
            limparErroFormularioTransacao(); 

            const description = transactionDescriptionInput.value.trim();
            const amount = parseFloat(transactionAmountInput.value); 
            const type = transactionTypeInput.value;
            const category = transactionCategoryInput.value; 
            const date = transactionDateInput.value;

            if (!description || !date || !category) {
                exibirErroFormularioTransacao("Descrição, data e categoria são obrigatórios.");
                return;
            }
            if (isNaN(amount)) {
                exibirErroFormularioTransacao("O valor da transação deve ser um número.");
                transactionAmountInput.focus(); 
                return;
            }
            if (amount <= 0) {
                exibirErroFormularioTransacao("O valor da transação deve ser maior que zero.");
                transactionAmountInput.focus();
                return;
            }

            if (editingTransactionId) { 
                const transactionIndex = transactions.findIndex(t => t.id === editingTransactionId);
                if (transactionIndex > -1) {
                    transactions[transactionIndex].description = description;
                    transactions[transactionIndex].amount = amount;
                    transactions[transactionIndex].type = type;
                    transactions[transactionIndex].category = category;
                    transactions[transactionIndex].date = date;
                }
            } else { 
                const novaTransacao = {
                    id: Date.now(), 
                    description: description,
                    amount: amount, 
                    type: type,
                    category: category, 
                    date: date
                };
                transactions.push(novaTransacao); 
            }
            
            salvarTransacoes(); 
            renderizarTransacoes(); 
            resetarFormularioParaAdicao(); 
        });

        [transactionDescriptionInput, transactionAmountInput, transactionDateInput, transactionCategoryInput, transactionTypeInput].forEach(input => {
            if (input) { 
                input.addEventListener('input', limparErroFormularioTransacao);
                if(input.tagName === 'SELECT' || input.type === 'date') {
                    input.addEventListener('change', limparErroFormularioTransacao);
                }
            }
        });
    }

    if (filterTransactionTypeEl) {
        filterTransactionTypeEl.addEventListener('change', renderizarTransacoes);
    }

    // Listeners para navegação do resumo mensal
    if (btnMesAnteriorResumoEl) {
        btnMesAnteriorResumoEl.addEventListener('click', () => {
            dataResumoExibida.setMonth(dataResumoExibida.getMonth() - 1);
            renderizarResumoMensal(dataResumoExibida);
        });
    }

    if (btnProximoMesResumoEl) {
        btnProximoMesResumoEl.addEventListener('click', () => {
            dataResumoExibida.setMonth(dataResumoExibida.getMonth() + 1);
            renderizarResumoMensal(dataResumoExibida);
        });
    }

    // --- INICIALIZAÇÃO DA PÁGINA ---
    setDefaultDate(); 
    renderizarTransacoes(); // Isso já chama calcularEExibirSaldoGlobal e renderizarResumoMensal
});