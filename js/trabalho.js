// js/trabalho.js - Lógica específica da página Trabalho
console.log("trabalho.js carregado");

document.addEventListener('DOMContentLoaded', () => {
    console.log("Página Trabalho pronta e DOM carregado.");

    // --- ELEMENTOS DO DOM - PROJETOS ---
    const addProjetoForm = document.getElementById('add-projeto-trabalho-form');
    const projetoNomeInput = document.getElementById('projeto-nome-input');
    const projetoDescricaoInput = document.getElementById('projeto-descricao-input');
    const listaProjetosTrabalhoEl = document.getElementById('lista-projetos-trabalho');
    const projetosEmptyMessageEl = document.getElementById('projetos-empty-message');
    const addProjetoErrorEl = document.getElementById('add-projeto-error');

    // --- ELEMENTOS DO DOM - MODAL DE EDIÇÃO DE PROJETO ---
    const editProjetoModalEl = document.getElementById('edit-projeto-trabalho-modal');
    const editProjetoFormModal = document.getElementById('edit-projeto-trabalho-form-modal');
    const editProjetoIdModalInput = document.getElementById('edit-projeto-id-modal');
    const editProjetoNomeModalInput = document.getElementById('edit-projeto-nome-modal');
    const editProjetoDescricaoModalInput = document.getElementById('edit-projeto-descricao-modal');
    const modalCloseBtnProjeto = document.getElementById('modal-close-btn-projeto');
    const modalCancelBtnProjeto = document.getElementById('modal-cancel-btn-projeto');
    const editProjetoErrorModalEl = document.getElementById('edit-projeto-error-modal');

    // --- ELEMENTOS DO DOM - VISUALIZAÇÃO DE TAREFAS ---
    const viewListaProjetosEl = document.getElementById('view-lista-projetos');
    const viewDetalhesProjetoEl = document.getElementById('view-detalhes-projeto');
    const btnVoltarParaProjetos = document.getElementById('btn-voltar-para-projetos');
    const detalhesProjetoNomeEl = document.getElementById('detalhes-projeto-nome');
    const detalhesProjetoDescricaoEl = document.getElementById('detalhes-projeto-descricao');

    // --- ELEMENTOS DO DOM - FORMULÁRIO, LISTA E CONTROLES DE TAREFAS ---
    const addTarefaForm = document.getElementById('add-tarefa-form');
    const tarefaDescricaoInput = document.getElementById('tarefa-descricao-input');
    const tarefaPrazoInput = document.getElementById('tarefa-prazo-input');
    const tarefaPrioridadeInput = document.getElementById('tarefa-prioridade-input');
    const listaTarefasDoProjetoEl = document.getElementById('lista-tarefas-do-projeto');
    const tarefasEmptyMessageEl = document.getElementById('tarefas-empty-message');
    const addTarefaErrorEl = document.getElementById('add-tarefa-error');
    const selectFiltrarStatusTarefasEl = document.getElementById('select-filtrar-status-tarefas'); // (NOVO)
    const selectOrdenarTarefasEl = document.getElementById('select-ordenar-tarefas'); // (NOVO)

    // --- ELEMENTOS DO DOM - MODAL DE EDIÇÃO DE TAREFA ---
    const editTarefaModalEl = document.getElementById('edit-tarefa-modal');
    const editTarefaFormModal = document.getElementById('edit-tarefa-form-modal');
    const editTarefaIdProjetoModalInput = document.getElementById('edit-tarefa-id-projeto-modal');
    const editTarefaIdTarefaModalInput = document.getElementById('edit-tarefa-id-tarefa-modal');
    const editTarefaDescricaoModalInput = document.getElementById('edit-tarefa-descricao-modal');
    const editTarefaPrazoModalInput = document.getElementById('edit-tarefa-prazo-modal');
    const editTarefaPrioridadeModalInput = document.getElementById('edit-tarefa-prioridade-modal');
    const modalCloseBtnTarefa = document.getElementById('modal-close-btn-tarefa');
    const modalCancelBtnTarefa = document.getElementById('modal-cancel-btn-tarefa');
    const editTarefaErrorModalEl = document.getElementById('edit-tarefa-error-modal');

    // --- ESTADO DA APLICAÇÃO ---
    const localStorageKeyProjetosTrabalho = 'meusProjetosTrabalho';
    const localStorageKeyPrefFiltroTarefas = 'preferenciaFiltroStatusTarefasTrabalho'; // (NOVO)
    const localStorageKeyPrefOrdemTarefas = 'preferenciaOrdemTarefasTrabalho'; // (NOVO)
    let projetos = [];
    let projetoSendoEditadoId = null;
    let projetoSelecionadoId = null;
    let tarefaSendoEditadaId = null;
    let filtroStatusTarefasAtual = 'todas'; // (NOVO)
    let ordemTarefasAtual = 'padrao'; // (NOVO)

    // --- FUNÇÕES DE PREFERÊNCIAS DE ORDENAÇÃO/FILTRO --- (NOVAS)
    function carregarPreferenciasOrdenacaoFiltro() {
        const filtroSalvo = localStorage.getItem(localStorageKeyPrefFiltroTarefas);
        const ordemSalva = localStorage.getItem(localStorageKeyPrefOrdemTarefas);

        if (filtroSalvo) filtroStatusTarefasAtual = filtroSalvo;
        if (ordemSalva) ordemTarefasAtual = ordemSalva;

        if (selectFiltrarStatusTarefasEl) selectFiltrarStatusTarefasEl.value = filtroStatusTarefasAtual;
        if (selectOrdenarTarefasEl) selectOrdenarTarefasEl.value = ordemTarefasAtual;
    }

    function salvarPreferenciasOrdenacaoFiltro() {
        localStorage.setItem(localStorageKeyPrefFiltroTarefas, filtroStatusTarefasAtual);
        localStorage.setItem(localStorageKeyPrefOrdemTarefas, ordemTarefasAtual);
    }


    // --- FUNÇÕES DE CONTROLE DE VISUALIZAÇÃO ---
    function mostrarViewProjetos() {
        viewListaProjetosEl.style.display = 'block';
        viewDetalhesProjetoEl.style.display = 'none';
        projetoSelecionadoId = null;
        renderizarProjetos();
    }

    function mostrarViewTarefas() {
        viewListaProjetosEl.style.display = 'none';
        viewDetalhesProjetoEl.style.display = 'block';
    }

    // --- FUNÇÕES DE PROJETO ---
    function carregarProjetos() {
        const projetosSalvos = localStorage.getItem(localStorageKeyProjetosTrabalho);
        if (projetosSalvos) {
            projetos = JSON.parse(projetosSalvos);
            projetos.forEach(projeto => {
                if (!Array.isArray(projeto.tarefas)) projeto.tarefas = [];
                projeto.tarefas.forEach(tarefa => {
                    if (typeof tarefa.concluida === 'undefined') tarefa.concluida = false;
                    if (typeof tarefa.prioridadeTarefa === 'undefined') tarefa.prioridadeTarefa = 'Média';
                });
            });
        } else {
            projetos = [];
        }
    }

    function salvarProjetos() {
        localStorage.setItem(localStorageKeyProjetosTrabalho, JSON.stringify(projetos));
    }

    function exibirErroFormulario(mensagem, tipoFormulario = 'addProjeto') {
        let elErro;
        switch (tipoFormulario) {
            case 'addProjeto': elErro = addProjetoErrorEl; break;
            case 'editProjeto': elErro = editProjetoErrorModalEl; break;
            case 'addTarefa': elErro = addTarefaErrorEl; break;
            case 'editTarefa': elErro = editTarefaErrorModalEl; break;
            default: elErro = null;
        }
        if (elErro) { elErro.textContent = mensagem; elErro.style.display = 'block'; }
    }

    function limparErroFormulario(tipoFormulario = 'addProjeto') {
        let elErro;
        switch (tipoFormulario) {
            case 'addProjeto': elErro = addProjetoErrorEl; break;
            case 'editProjeto': elErro = editProjetoErrorModalEl; break;
            case 'addTarefa': elErro = addTarefaErrorEl; break;
            case 'editTarefa': elErro = editTarefaErrorModalEl; break;
            default: elErro = null;
        }
        if (elErro) { elErro.textContent = ''; elErro.style.display = 'none'; }
    }

    function abrirModalEdicaoProjeto(projetoId) {
        limparErroFormulario('editProjeto');
        const projetoParaEditar = projetos.find(p => p.id === projetoId);
        if (!editProjetoModalEl || !projetoParaEditar) return;
        projetoSendoEditadoId = projetoId;
        editProjetoIdModalInput.value = projetoParaEditar.id;
        editProjetoNomeModalInput.value = projetoParaEditar.nome;
        editProjetoDescricaoModalInput.value = projetoParaEditar.descricao || '';
        editProjetoModalEl.style.display = 'flex';
        setTimeout(() => editProjetoModalEl.classList.add('visible'), 10);
        editProjetoNomeModalInput.focus();
    }

    function fecharModalEdicaoProjeto() {
        if (!editProjetoModalEl) return;
        editProjetoModalEl.classList.remove('visible');
        setTimeout(() => {
            editProjetoModalEl.style.display = 'none';
            if (editProjetoFormModal) editProjetoFormModal.reset();
            limparErroFormulario('editProjeto');
            projetoSendoEditadoId = null;
        }, 300);
    }

    function selecionarProjeto(idProjeto) {
        projetoSelecionadoId = idProjeto;
        const projeto = projetos.find(p => p.id === idProjeto);
        if (projeto) {
            detalhesProjetoNomeEl.textContent = projeto.nome;
            detalhesProjetoDescricaoEl.textContent = projeto.descricao || "Este projeto não possui descrição.";
            carregarPreferenciasOrdenacaoFiltro(); // (NOVO) Carrega preferências ao selecionar projeto
            renderizarTarefasDoProjetoSelecionado();
            mostrarViewTarefas();
            if (addTarefaForm) addTarefaForm.reset();
            limparErroFormulario('addTarefa');
            if (tarefaPrazoInput) {
                const hoje = new Date().toISOString().split('T')[0];
                tarefaPrazoInput.setAttribute('min', hoje);
            }
            if (tarefaPrioridadeInput) tarefaPrioridadeInput.value = "Média";
        } else {
            console.error("Projeto não encontrado para seleção:", idProjeto);
            mostrarViewProjetos();
        }
    }

    function renderizarProjetos() {
        // ... (código de renderizarProjetos permanece o mesmo da etapa anterior) ...
        if (!listaProjetosTrabalhoEl || !projetosEmptyMessageEl) return;
        listaProjetosTrabalhoEl.innerHTML = '';
        if (projetos.length === 0) {
            projetosEmptyMessageEl.style.display = 'block';
            const pDentroDaLista = listaProjetosTrabalhoEl.querySelector('p.empty-list-message');
            if(pDentroDaLista) pDentroDaLista.remove();
        } else {
            projetosEmptyMessageEl.style.display = 'none';
            const projetosOrdenados = [...projetos].sort((a, b) => a.nome.localeCompare(b.nome));
            projetosOrdenados.forEach((projeto, index) => {
                const projetoCard = document.createElement('div');
                projetoCard.classList.add('dashboard-module', 'meta-card', 'projeto-card');
                projetoCard.style.animationDelay = `${index * 0.05}s`;
                const nomeProjeto = document.createElement('h3');
                nomeProjeto.textContent = projeto.nome;
                projetoCard.appendChild(nomeProjeto);
                if (projeto.descricao) {
                    const descricaoProjeto = document.createElement('p');
                    descricaoProjeto.style.maxHeight = '60px';
                    descricaoProjeto.style.overflow = 'hidden';
                    descricaoProjeto.style.textOverflow = 'ellipsis';
                    descricaoProjeto.textContent = projeto.descricao;
                    descricaoProjeto.style.whiteSpace = 'pre-wrap';
                    projetoCard.appendChild(descricaoProjeto);
                }
                const acoesProjeto = document.createElement('div');
                acoesProjeto.classList.add('meta-actions');
                const btnVerTarefas = document.createElement('button');
                btnVerTarefas.classList.add('btn', 'btn-primary');
                btnVerTarefas.textContent = 'Gerenciar Tarefas';
                btnVerTarefas.style.marginRight = 'auto';
                btnVerTarefas.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selecionarProjeto(projeto.id);
                });
                const btnEditar = document.createElement('button');
                btnEditar.classList.add('btn', 'btn-secondary-inline');
                btnEditar.textContent = 'Editar';
                btnEditar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    abrirModalEdicaoProjeto(projeto.id);
                });
                const btnExcluir = document.createElement('button');
                btnExcluir.classList.add('btn', 'btn-remove');
                btnExcluir.textContent = 'Excluir';
                btnExcluir.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm(`Você tem certeza que quer remover o projeto "${projeto.nome}" e todas as suas tarefas? Esta ação não pode ser desfeita.`)) {
                        projetos = projetos.filter(p => p.id !== projeto.id);
                        salvarProjetos();
                        renderizarProjetos();
                        if(projetoSelecionadoId === projeto.id) {
                            mostrarViewProjetos();
                        }
                    }
                });
                acoesProjeto.appendChild(btnVerTarefas);
                acoesProjeto.appendChild(btnEditar);
                acoesProjeto.appendChild(btnExcluir);
                projetoCard.appendChild(acoesProjeto);
                listaProjetosTrabalhoEl.appendChild(projetoCard);
            });
        }
    }


    // --- FUNÇÕES DE TAREFA ---
    function toggleEstadoTarefa(idProjeto, idTarefa) {
        const projeto = projetos.find(p => p.id === idProjeto);
        if (projeto && projeto.tarefas) {
            const tarefa = projeto.tarefas.find(t => t.idTarefa === idTarefa);
            if (tarefa) {
                tarefa.concluida = !tarefa.concluida;
                salvarProjetos();
                renderizarTarefasDoProjetoSelecionado();
            }
        }
    }
    
    function abrirModalEdicaoTarefa(idProjeto, idTarefa) {
        limparErroFormulario('editTarefa');
        const projeto = projetos.find(p => p.id === idProjeto);
        if (!projeto || !projeto.tarefas) return;
        const tarefaParaEditar = projeto.tarefas.find(t => t.idTarefa === idTarefa);
        if (!editTarefaModalEl || !tarefaParaEditar) return;
        tarefaSendoEditadaId = idTarefa;
        editTarefaIdProjetoModalInput.value = idProjeto;
        editTarefaIdTarefaModalInput.value = idTarefa;
        editTarefaDescricaoModalInput.value = tarefaParaEditar.descricaoTarefa;
        editTarefaPrazoModalInput.value = tarefaParaEditar.prazoTarefa || '';
        editTarefaPrioridadeModalInput.value = tarefaParaEditar.prioridadeTarefa || 'Média';
        if (editTarefaPrazoModalInput) {
            const hoje = new Date().toISOString().split('T')[0];
            editTarefaPrazoModalInput.setAttribute('min', hoje);
        }
        editTarefaModalEl.style.display = 'flex';
        setTimeout(() => editTarefaModalEl.classList.add('visible'), 10);
        editTarefaDescricaoModalInput.focus();
    }

    function fecharModalEdicaoTarefa() {
        if (!editTarefaModalEl) return;
        editTarefaModalEl.classList.remove('visible');
        setTimeout(() => {
            editTarefaModalEl.style.display = 'none';
            if (editTarefaFormModal) editTarefaFormModal.reset();
            limparErroFormulario('editTarefa');
            tarefaSendoEditadaId = null;
        }, 300);
    }

    function renderizarTarefasDoProjetoSelecionado() {
        if (!listaTarefasDoProjetoEl || !tarefasEmptyMessageEl || projetoSelecionadoId === null) return;
        const projetoAtual = projetos.find(p => p.id === projetoSelecionadoId);
        if (!projetoAtual || !Array.isArray(projetoAtual.tarefas)) {
            tarefasEmptyMessageEl.textContent = "Nenhuma tarefa adicionada a este projeto ainda.";
            tarefasEmptyMessageEl.style.display = 'block';
            listaTarefasDoProjetoEl.innerHTML = '';
            return;
        }

        let tarefasParaExibir = [...projetoAtual.tarefas];

        // 1. Aplicar Filtro de Status (NOVO)
        if (filtroStatusTarefasAtual === 'pendentes') {
            tarefasParaExibir = tarefasParaExibir.filter(t => !t.concluida);
        } else if (filtroStatusTarefasAtual === 'concluidas') {
            tarefasParaExibir = tarefasParaExibir.filter(t => t.concluida);
        }
        // Se 'todas', não faz nada com o filtro de status

        // 2. Aplicar Ordenação (NOVO)
        const prioridadesOrdem = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
        switch (ordemTarefasAtual) {
            case 'prazo-asc':
                tarefasParaExibir.sort((a, b) => {
                    const prazoA = a.prazoTarefa ? new Date(a.prazoTarefa + "T00:00:00") : null;
                    const prazoB = b.prazoTarefa ? new Date(b.prazoTarefa + "T00:00:00") : null;
                    if (a.concluida !== b.concluida) return a.concluida ? 1 : -1; // Pendentes primeiro
                    if (prazoA && prazoB) return prazoA - prazoB;
                    if (prazoA) return -1; // Com prazo antes
                    if (prazoB) return 1;  // Com prazo antes
                    return 0;
                });
                break;
            case 'prioridade-desc':
                tarefasParaExibir.sort((a, b) => {
                    if (a.concluida !== b.concluida) return a.concluida ? 1 : -1; // Pendentes primeiro
                    const pA = prioridadesOrdem[a.prioridadeTarefa || 'Média'];
                    const pB = prioridadesOrdem[b.prioridadeTarefa || 'Média'];
                    return pA - pB;
                });
                break;
            case 'descricao-asc':
                tarefasParaExibir.sort((a, b) => {
                    if (a.concluida !== b.concluida) return a.concluida ? 1 : -1; // Pendentes primeiro
                    return a.descricaoTarefa.localeCompare(b.descricaoTarefa);
                });
                break;
            case 'padrao': // Ordenação padrão (original)
            default:
                tarefasParaExibir.sort((a, b) => {
                    if (a.concluida !== b.concluida) return a.concluida ? 1 : -1;
                    const pA = prioridadesOrdem[a.prioridadeTarefa || 'Média'];
                    const pB = prioridadesOrdem[b.prioridadeTarefa || 'Média'];
                    if (pA !== pB) return pA - pB;
                    if (a.prazoTarefa && b.prazoTarefa) return new Date(a.prazoTarefa + "T00:00:00") - new Date(b.prazoTarefa + "T00:00:00");
                    else if (a.prazoTarefa) return -1;
                    else if (b.prazoTarefa) return 1;
                    return a.descricaoTarefa.localeCompare(b.descricaoTarefa);
                });
                break;
        }

        listaTarefasDoProjetoEl.innerHTML = '';
        if (tarefasParaExibir.length === 0) {
            tarefasEmptyMessageEl.textContent = "Nenhuma tarefa para os filtros/ordenação selecionados.";
            tarefasEmptyMessageEl.style.display = 'block';
        } else {
            tarefasEmptyMessageEl.style.display = 'none';
            tarefasParaExibir.forEach(tarefa => {
                const itemTarefa = document.createElement('li');
                itemTarefa.classList.add('checklist-item');
                if (tarefa.concluida) itemTarefa.classList.add('completed');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = tarefa.concluida;
                checkbox.id = `tarefa-${projetoAtual.id}-${tarefa.idTarefa}`;
                checkbox.addEventListener('change', () => toggleEstadoTarefa(projetoAtual.id, tarefa.idTarefa));
                itemTarefa.appendChild(checkbox);

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = tarefa.descricaoTarefa;
                itemTarefa.appendChild(label);

                const infoContainer = document.createElement('div');
                infoContainer.classList.add('task-info-container');

                if (tarefa.prioridadeTarefa) {
                    const prioridadeTag = document.createElement('span');
                    prioridadeTag.classList.add('tarefa-prioridade-tag', `prioridade-tag-${(tarefa.prioridadeTarefa).toLowerCase()}`);
                    prioridadeTag.textContent = tarefa.prioridadeTarefa;
                    infoContainer.appendChild(prioridadeTag);
                }

                if (tarefa.prazoTarefa) {
                    const prazoSpan = document.createElement('span');
                    prazoSpan.classList.add('task-prazo-display');
                    try {
                        const [ano, mes, dia] = tarefa.prazoTarefa.split('-');
                        prazoSpan.textContent = `${dia}/${mes}/${ano}`;
                    } catch (e) { prazoSpan.textContent = tarefa.prazoTarefa; }
                    infoContainer.appendChild(prazoSpan);
                }
                
                const btnEditarTarefa = document.createElement('button');
                btnEditarTarefa.classList.add('btn', 'btn-secondary-inline', 'btn-edit-habit');
                btnEditarTarefa.textContent = 'Editar';
                btnEditarTarefa.style.fontSize = '0.75rem'; btnEditarTarefa.style.padding = '0.2rem 0.5rem';
                btnEditarTarefa.addEventListener('click', () => abrirModalEdicaoTarefa(projetoAtual.id, tarefa.idTarefa));
                infoContainer.appendChild(btnEditarTarefa);

                const btnExcluirTarefa = document.createElement('button');
                btnExcluirTarefa.classList.add('btn-remove-habit');
                btnExcluirTarefa.textContent = 'X';
                btnExcluirTarefa.style.fontSize = '0.9rem'; btnExcluirTarefa.style.padding = '0.2rem 0.5rem';
                btnExcluirTarefa.addEventListener('click', () => {
                    if (confirm(`Tem certeza que quer excluir a tarefa "${tarefa.descricaoTarefa}"?`)) {
                        projetoAtual.tarefas = projetoAtual.tarefas.filter(t => t.idTarefa !== tarefa.idTarefa);
                        salvarProjetos(); renderizarTarefasDoProjetoSelecionado();
                    }
                });
                infoContainer.appendChild(btnExcluirTarefa);
                itemTarefa.appendChild(infoContainer);
                listaTarefasDoProjetoEl.appendChild(itemTarefa);
            });
        }
    }

    // --- EVENT LISTENERS ---
    // ... (Listeners de Projeto e Modal de Projeto permanecem os mesmos) ...
    if (addProjetoForm) { /* ... */ }
    if (editProjetoModalEl) { /* ... */ }
    if (btnVoltarParaProjetos) btnVoltarParaProjetos.addEventListener('click', mostrarViewProjetos);
    if (addTarefaForm) { /* ... */ }
    if (editTarefaModalEl) { /* ... */ }
    // Adicionando listeners para os novos selects de ordenação e filtro (NOVOS)
    if (selectFiltrarStatusTarefasEl) {
        selectFiltrarStatusTarefasEl.addEventListener('change', (e) => {
            filtroStatusTarefasAtual = e.target.value;
            salvarPreferenciasOrdenacaoFiltro();
            renderizarTarefasDoProjetoSelecionado();
        });
    }
    if (selectOrdenarTarefasEl) {
        selectOrdenarTarefasEl.addEventListener('change', (e) => {
            ordemTarefasAtual = e.target.value;
            salvarPreferenciasOrdenacaoFiltro();
            renderizarTarefasDoProjetoSelecionado();
        });
    }

    // --- INICIALIZAÇÃO ---
    carregarProjetos();
    carregarPreferenciasOrdenacaoFiltro(); // Carrega preferências globais
    mostrarViewProjetos(); // A view de detalhes chamará renderizarTarefasDoProjetoSelecionado, que usará as prefs
});