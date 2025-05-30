// js/metas.js - Lógica específica da página de Metas

const addMetaForm = document.getElementById('add-meta-form');
if (addMetaForm) {
    const metaTitleInput = document.getElementById('meta-title-input');
    const metaDescriptionInput = document.getElementById('meta-description-input');
    const metaTargetDateInput = document.getElementById('meta-target-date-input'); 
    const metaPriorityInput = document.getElementById('meta-priority-input');   
    const metasListContainer = document.getElementById('metas-list');

    // Elementos do Modal de Edição de Meta
    const editMetaModalEl = document.getElementById('edit-meta-modal');
    const editMetaFormModal = document.getElementById('edit-meta-form-modal');
    const editMetaIdModalInput = document.getElementById('edit-meta-id-modal');
    const editMetaTitleModalInput = document.getElementById('edit-meta-title-modal');
    const editMetaDescriptionModalInput = document.getElementById('edit-meta-description-modal');
    const editMetaTargetDateModalInput = document.getElementById('edit-meta-target-date-modal');
    const editMetaPriorityModalInput = document.getElementById('edit-meta-priority-modal');
    const modalCloseBtnMeta = document.getElementById('modal-close-btn-meta');
    const modalCancelBtnMeta = document.getElementById('modal-cancel-btn-meta');

    // Configurar a data mínima para os inputs de data (adicionar e editar)
    if (metaTargetDateInput) { 
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); 
        const dia = String(hoje.getDate()).padStart(2, '0');
        const dataMinimaParaInput = `${ano}-${mes}-${dia}`; 
        metaTargetDateInput.setAttribute('min', dataMinimaParaInput);
        if (editMetaTargetDateModalInput) { 
            editMetaTargetDateModalInput.setAttribute('min', dataMinimaParaInput);
        }
    }

    let metas = JSON.parse(localStorage.getItem('minhasMetas')) || [];

    function salvarMetas() {
        localStorage.setItem('minhasMetas', JSON.stringify(metas));
    }

    // --- Funções do Modal de Edição ---
    function abrirModalEdicaoMeta(metaParaEditar) {
        if (!editMetaModalEl || !metaParaEditar) return;

        editMetaIdModalInput.value = metaParaEditar.id;
        editMetaTitleModalInput.value = metaParaEditar.title;
        editMetaDescriptionModalInput.value = metaParaEditar.description || '';
        editMetaTargetDateModalInput.value = metaParaEditar.targetDate || '';
        editMetaPriorityModalInput.value = metaParaEditar.priority || 'Média';
        
        editMetaModalEl.style.display = 'flex'; 
        setTimeout(() => { 
            editMetaModalEl.classList.add('visible');
        }, 10); 
    }

    function fecharModalEdicaoMeta() {
        if (!editMetaModalEl) return;
        editMetaModalEl.classList.remove('visible');
        setTimeout(() => { 
            editMetaModalEl.style.display = 'none';
            if (editMetaFormModal) editMetaFormModal.reset(); 
        }, 300); 
    }

    if (editMetaModalEl) { // Garante que os listeners só são adicionados se o modal existir
        if (modalCloseBtnMeta) {
            modalCloseBtnMeta.addEventListener('click', fecharModalEdicaoMeta);
        }
        if (modalCancelBtnMeta) {
            modalCancelBtnMeta.addEventListener('click', fecharModalEdicaoMeta);
        }
        editMetaModalEl.addEventListener('click', (evento) => {
            if (evento.target === editMetaModalEl) { 
                fecharModalEdicaoMeta();
            }
        });
    }


    function renderizarMetas() {
        metasListContainer.innerHTML = '';
        if (metas.length === 0) {
            metasListContainer.innerHTML = '<p class="empty-list-message">Nenhuma meta definida ainda. Que tal criar uma e conquistar seus objetivos?</p>';
            return;
        }

        metas.forEach((meta, index) => { 
            const metaCard = document.createElement('div');
            metaCard.classList.add('meta-card', 'dashboard-module', 'animate-fadeInUp');
            metaCard.style.animationDelay = `${index * 0.05}s`; 

            if (meta.completed) {
                metaCard.classList.add('completed-meta');
            }
            
            const tituloMeta = document.createElement('h3');
            tituloMeta.textContent = meta.title;
            metaCard.appendChild(tituloMeta);

            if (meta.priority) {
                const prioridadeEl = document.createElement('p');
                prioridadeEl.classList.add('meta-field');
                prioridadeEl.innerHTML = `<strong>Prioridade:</strong> ${meta.priority}`;
                metaCard.appendChild(prioridadeEl);
            }

            if (meta.targetDate) {
                const dataLimiteEl = document.createElement('p');
                dataLimiteEl.classList.add('meta-field');
                try { 
                    const [ano, mes, dia] = meta.targetDate.split('-');
                    const dataFormatada = `${dia}/${mes}/${ano}`;
                    dataLimiteEl.innerHTML = `<strong>Data Limite:</strong> ${dataFormatada}`;
                } catch (e) { 
                    dataLimiteEl.innerHTML = `<strong>Data Limite:</strong> ${meta.targetDate}`;
                }
                metaCard.appendChild(dataLimiteEl);
            }
            
            const descricaoMeta = document.createElement('p');
            descricaoMeta.textContent = meta.description || "Sem descrição."; 
            metaCard.appendChild(descricaoMeta);

            const statusMetaEl = document.createElement('div');
            statusMetaEl.classList.add('meta-status');
            statusMetaEl.textContent = meta.completed ? 'Status: Concluída' : 'Status: Em Andamento';
            metaCard.appendChild(statusMetaEl);

            const acoesMeta = document.createElement('div');
            acoesMeta.classList.add('meta-actions');

            const btnEditarMeta = document.createElement('button');
            btnEditarMeta.classList.add('btn', 'btn-secondary-inline'); 
            btnEditarMeta.textContent = 'Editar';
            btnEditarMeta.setAttribute('aria-label', 'Editar Meta');
            btnEditarMeta.addEventListener('click', () => {
                abrirModalEdicaoMeta(meta); 
            });
            acoesMeta.appendChild(btnEditarMeta);

            const btnConcluir = document.createElement('button');
            btnConcluir.classList.add('btn', 'btn-secondary');
            btnConcluir.textContent = meta.completed ? 'Reabrir Meta' : 'Concluir Meta';
            btnConcluir.addEventListener('click', () => {
                const metaParaAtualizar = metas.find(m => m.id === meta.id);
                if (metaParaAtualizar) {
                    metaParaAtualizar.completed = !metaParaAtualizar.completed;
                    salvarMetas();
                    renderizarMetas();
                }
            });

            const btnRemover = document.createElement('button');
            btnRemover.classList.add('btn', 'btn-remove');
            btnRemover.textContent = 'Remover';
            btnRemover.setAttribute('aria-label', 'Remover Meta');
            btnRemover.addEventListener('click', () => {
                if (confirm(`Você tem certeza que quer remover a meta "${meta.title}"?`)) {
                    metas = metas.filter(m => m.id !== meta.id);
                    salvarMetas();
                    renderizarMetas();
                }
            });

            acoesMeta.appendChild(btnConcluir);
            acoesMeta.appendChild(btnRemover);
            metaCard.appendChild(acoesMeta);
            metasListContainer.appendChild(metaCard);
        });
    }

    if (editMetaFormModal) {
        editMetaFormModal.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const idMetaEditando = editMetaIdModalInput.value; // ID vem como string do input
            const novoTitulo = editMetaTitleModalInput.value.trim();
            const novaDescricao = editMetaDescriptionModalInput.value.trim();
            const novaDataLimite = editMetaTargetDateModalInput.value;
            const novaPrioridade = editMetaPriorityModalInput.value;

            if (!novoTitulo) {
                alert("O título da meta não pode ficar vazio!");
                return;
            }

            const metaIndex = metas.findIndex(m => m.id == Number(idMetaEditando)); // Converte ID para número para comparar

            if (metaIndex > -1) {
                metas[metaIndex].title = novoTitulo;
                metas[metaIndex].description = novaDescricao;
                metas[metaIndex].targetDate = novaDataLimite || null;
                metas[metaIndex].priority = novaPrioridade;
                
                salvarMetas();
                renderizarMetas();
                fecharModalEdicaoMeta();
            } else {
                alert("Erro: Meta não encontrada para edição.");
                // console.error("Meta não encontrada para edição com ID:", idMetaEditando, typeof idMetaEditando);
            }
        });
    }

    addMetaForm.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const titulo = metaTitleInput.value.trim();
        const descricao = metaDescriptionInput.value.trim();
        const dataLimite = metaTargetDateInput.value; 
        const prioridade = metaPriorityInput.value;

        if (titulo) {
            const novaMeta = {
                id: Date.now(), 
                title: titulo,
                description: descricao,
                targetDate: dataLimite || null, 
                priority: prioridade,
                completed: false
            };
            metas.push(novaMeta);
            
            metaTitleInput.value = '';
            metaDescriptionInput.value = '';
            metaTargetDateInput.value = ''; 
            metaPriorityInput.value = 'Média'; 
            
            salvarMetas();
            renderizarMetas();
        } else {
            alert("Por favor, dê um título para a sua meta!"); 
        }
    });
    renderizarMetas(); 
}
// --- FIM DA LÓGICA DA PÁGINA DE METAS ---