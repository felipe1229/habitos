// --- SELEÇÃO DE ELEMENTOS DO FORMULÁRIO DE ADICIONAR META --- //
const addMetaForm = document.getElementById('add-meta-form');
if (addMetaForm) { // Garante que o script só roda se o formulário principal da página existir
    const metaTitleInput = document.getElementById('meta-title-input');
    const metaDescriptionInput = document.getElementById('meta-description-input');
    const metaTargetDateInput = document.getElementById('meta-target-date-input'); 
    const metaPriorityInput = document.getElementById('meta-priority-input');   
    const metasListContainer = document.getElementById('metas-list'); // Container onde as metas são renderizadas

    // --- SELEÇÃO DE ELEMENTOS DO MODAL DE EDIÇÃO DE META --- //
    const editMetaModalEl = document.getElementById('edit-meta-modal'); // O overlay do modal
    const editMetaFormModal = document.getElementById('edit-meta-form-modal'); // O formulário dentro do modal
    const editMetaIdModalInput = document.getElementById('edit-meta-id-modal'); // Input hidden para o ID da meta
    const editMetaTitleModalInput = document.getElementById('edit-meta-title-modal');
    const editMetaDescriptionModalInput = document.getElementById('edit-meta-description-modal');
    const editMetaTargetDateModalInput = document.getElementById('edit-meta-target-date-modal');
    const editMetaPriorityModalInput = document.getElementById('edit-meta-priority-modal');
    const modalCloseBtnMeta = document.getElementById('modal-close-btn-meta'); // Botão "X" para fechar o modal
    const modalCancelBtnMeta = document.getElementById('modal-cancel-btn-meta'); // Botão "Cancelar" no modal

    // --- CONFIGURAÇÃO DE DATA MÍNIMA PARA INPUTS DE DATA --- //
    // Impede que o usuário selecione datas passadas para a meta
    if (metaTargetDateInput) { 
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
        const dia = String(hoje.getDate()).padStart(2, '0');
        const dataMinimaParaInput = `${ano}-${mes}-${dia}`; 
        metaTargetDateInput.setAttribute('min', dataMinimaParaInput);
        // Aplica também ao input de data no modal de edição
        if (editMetaTargetDateModalInput) { 
            editMetaTargetDateModalInput.setAttribute('min', dataMinimaParaInput);
        }
    }

    // --- GERENCIAMENTO DE DADOS DAS METAS (localStorage) --- //
    // Carrega as metas do localStorage ou inicializa um array vazio
    let metas = JSON.parse(localStorage.getItem('minhasMetas')) || [];

    /** Salva o array de metas atual no localStorage. */
    function salvarMetas() {
        localStorage.setItem('minhasMetas', JSON.stringify(metas));
    }

    // --- FUNÇÕES DO MODAL DE EDIÇÃO DE METAS --- //
    /** Abre o modal de edição e preenche com os dados da meta selecionada.
     * @param {object} metaParaEditar - O objeto da meta a ser editada.
     */
    function abrirModalEdicaoMeta(metaParaEditar) {
        if (!editMetaModalEl || !metaParaEditar) return; // Validação

        // Preenche os campos do formulário do modal
        editMetaIdModalInput.value = metaParaEditar.id;
        editMetaTitleModalInput.value = metaParaEditar.title;
        editMetaDescriptionModalInput.value = metaParaEditar.description || '';
        editMetaTargetDateModalInput.value = metaParaEditar.targetDate || '';
        editMetaPriorityModalInput.value = metaParaEditar.priority || 'Média';
        
        editMetaModalEl.style.display = 'flex'; // Mostra o overlay do modal
        setTimeout(() => { // Pequeno delay para a transição CSS funcionar
            editMetaModalEl.classList.add('visible');
        }, 10); 
    }

    /** Fecha o modal de edição de metas e reseta o formulário. */
    function fecharModalEdicaoMeta() {
        if (!editMetaModalEl) return;
        editMetaModalEl.classList.remove('visible'); // Inicia transição de saída
        setTimeout(() => { // Espera a transição CSS antes de ocultar completamente
            editMetaModalEl.style.display = 'none';
            if (editMetaFormModal) editMetaFormModal.reset(); // Limpa o formulário do modal
        }, 300); // Tempo deve corresponder à transição CSS
    }

    // Adiciona event listeners para fechar o modal
    if (editMetaModalEl) { 
        if (modalCloseBtnMeta) { // Botão "X"
            modalCloseBtnMeta.addEventListener('click', fecharModalEdicaoMeta);
        }
        if (modalCancelBtnMeta) { // Botão "Cancelar"
            modalCancelBtnMeta.addEventListener('click', fecharModalEdicaoMeta);
        }
        // Fechar ao clicar fora do conteúdo do modal (no overlay)
        editMetaModalEl.addEventListener('click', (evento) => {
            if (evento.target === editMetaModalEl) { 
                fecharModalEdicaoMeta();
            }
        });
    }


    // --- RENDERIZAÇÃO DAS METAS NA PÁGINA --- //
    /** Renderiza todos os cards de metas na interface. */
    function renderizarMetas() {
        if (!metasListContainer) return;
        metasListContainer.innerHTML = ''; // Limpa a lista atual

        // Mensagem se não houver metas
        if (metas.length === 0) {
            metasListContainer.innerHTML = '<p class="empty-list-message">Nenhuma meta definida ainda. Que tal criar uma e conquistar seus objetivos?</p>';
            return;
        }

        // Ordena as metas: não concluídas primeiro, depois por ID (mais recentes primeiro implicitamente pelo Date.now())
        // Você pode adicionar critérios de ordenação mais complexos aqui se desejar (ex: por prioridade, data)
        const metasOrdenadas = [...metas].sort((a, b) => {
            if (a.completed === b.completed) {
                return b.id - a.id; // Mais recentes primeiro entre status iguais
            }
            return a.completed ? 1 : -1; // Não concluídas (false) vêm antes
        });


        metasOrdenadas.forEach((meta, index) => { 
            const metaCard = document.createElement('div');
            metaCard.classList.add('meta-card', 'dashboard-module', 'animate-fadeInUp');
            metaCard.style.animationDelay = `${index * 0.05}s`; // Animação de entrada escalonada

            if (meta.completed) {
                metaCard.classList.add('completed-meta'); // Classe para metas concluídas
            }
            
            // Título da Meta
            const tituloMeta = document.createElement('h3');
            tituloMeta.textContent = meta.title;
            metaCard.appendChild(tituloMeta);

            // Prioridade da Meta (se existir)
            if (meta.priority) {
                const prioridadeEl = document.createElement('p');
                prioridadeEl.classList.add('meta-field');
                prioridadeEl.innerHTML = `<strong>Prioridade:</strong> ${meta.priority}`;
                metaCard.appendChild(prioridadeEl);
            }

            // Data Limite da Meta (se existir)
            if (meta.targetDate) {
                const dataLimiteEl = document.createElement('p');
                dataLimiteEl.classList.add('meta-field');
                try { // Formata a data para DD/MM/AAAA
                    const [ano, mes, dia] = meta.targetDate.split('-');
                    const dataFormatada = `${dia}/${mes}/${ano}`;
                    dataLimiteEl.innerHTML = `<strong>Data Limite:</strong> ${dataFormatada}`;
                } catch (e) { // Fallback se a data não estiver no formato esperado
                    dataLimiteEl.innerHTML = `<strong>Data Limite:</strong> ${meta.targetDate}`;
                }
                metaCard.appendChild(dataLimiteEl);
            }
            
            // Descrição da Meta
            const descricaoMeta = document.createElement('p');
            descricaoMeta.textContent = meta.description || "Sem descrição."; // Fallback se não houver descrição
            metaCard.appendChild(descricaoMeta);

            // Status da Meta (Concluída / Em Andamento)
            const statusMetaEl = document.createElement('div');
            statusMetaEl.classList.add('meta-status');
            statusMetaEl.textContent = meta.completed ? 'Status: Concluída' : 'Status: Em Andamento';
            metaCard.appendChild(statusMetaEl);

            // Botões de Ação para a Meta
            const acoesMeta = document.createElement('div');
            acoesMeta.classList.add('meta-actions');

            // Botão Editar Meta
            const btnEditarMeta = document.createElement('button');
            btnEditarMeta.classList.add('btn', 'btn-secondary-inline'); // Estilo de botão secundário inline
            btnEditarMeta.textContent = 'Editar';
            btnEditarMeta.setAttribute('aria-label', `Editar Meta ${meta.title}`);
            btnEditarMeta.addEventListener('click', () => {
                abrirModalEdicaoMeta(meta); // Abre o modal com os dados desta meta
            });
            acoesMeta.appendChild(btnEditarMeta);

            // Botão Concluir/Reabrir Meta
            const btnConcluir = document.createElement('button');
            btnConcluir.classList.add('btn', 'btn-secondary');
            btnConcluir.textContent = meta.completed ? 'Reabrir Meta' : 'Concluir Meta';
            btnConcluir.setAttribute('aria-label', `${meta.completed ? 'Reabrir' : 'Concluir'} Meta ${meta.title}`);
            btnConcluir.addEventListener('click', () => {
                const metaParaAtualizar = metas.find(m => m.id === meta.id);
                if (metaParaAtualizar) {
                    metaParaAtualizar.completed = !metaParaAtualizar.completed; // Alterna o status
                    salvarMetas();
                    renderizarMetas(); // Re-renderiza a lista
                }
            });

            // Botão Remover Meta
            const btnRemover = document.createElement('button');
            btnRemover.classList.add('btn', 'btn-remove'); // Estilo de botão de remoção
            btnRemover.textContent = 'Remover';
            btnRemover.setAttribute('aria-label', `Remover Meta ${meta.title}`);
            btnRemover.addEventListener('click', () => {
                // Confirmação antes de remover
                if (confirm(`Você tem certeza que quer remover a meta "${meta.title}"?`)) {
                    metas = metas.filter(m => m.id !== meta.id); // Remove a meta do array
                    salvarMetas();
                    renderizarMetas(); // Re-renderiza a lista
                }
            });

            acoesMeta.appendChild(btnConcluir);
            acoesMeta.appendChild(btnRemover);
            metaCard.appendChild(acoesMeta);
            metasListContainer.appendChild(metaCard); // Adiciona o card da meta ao container
        });
    }

    // --- EVENT LISTENER PARA SUBMISSÃO DO FORMULÁRIO DE EDIÇÃO (NO MODAL) --- //
    if (editMetaFormModal) {
        editMetaFormModal.addEventListener('submit', (evento) => {
            evento.preventDefault(); // Impede recarregamento da página
            const idMetaEditando = editMetaIdModalInput.value; // Pega o ID da meta (vem como string)
            const novoTitulo = editMetaTitleModalInput.value.trim();
            const novaDescricao = editMetaDescriptionModalInput.value.trim();
            const novaDataLimite = editMetaTargetDateModalInput.value;
            const novaPrioridade = editMetaPriorityModalInput.value;

            if (!novoTitulo) { // Validação básica do título
                alert("O título da meta não pode ficar vazio!");
                return;
            }

            // Encontra a meta no array para atualizar (converte ID para número para comparação)
            const metaIndex = metas.findIndex(m => m.id == Number(idMetaEditando)); 

            if (metaIndex > -1) { // Se a meta for encontrada
                metas[metaIndex].title = novoTitulo;
                metas[metaIndex].description = novaDescricao;
                metas[metaIndex].targetDate = novaDataLimite || null; // Permite data vazia
                metas[metaIndex].priority = novaPrioridade;
                
                salvarMetas();
                renderizarMetas();
                fecharModalEdicaoMeta(); // Fecha o modal após salvar
            } else {
                alert("Erro: Meta não encontrada para edição.");
                // console.error("Meta não encontrada para edição com ID:", idMetaEditando, typeof idMetaEditando);
            }
        });
    }

    // --- EVENT LISTENER PARA SUBMISSÃO DO FORMULÁRIO DE ADICIONAR NOVA META --- //
    addMetaForm.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Impede recarregamento da página
        const titulo = metaTitleInput.value.trim();
        const descricao = metaDescriptionInput.value.trim();
        const dataLimite = metaTargetDateInput.value; 
        const prioridade = metaPriorityInput.value;

        if (titulo) { // Se o título foi preenchido
            const novaMeta = {
                id: Date.now(), // ID único baseado no timestamp atual
                title: titulo,
                description: descricao,
                targetDate: dataLimite || null, // Permite data vazia
                priority: prioridade,
                completed: false // Novas metas começam como não concluídas
            };
            metas.push(novaMeta); // Adiciona a nova meta ao array
            
            // Limpa os campos do formulário principal
            metaTitleInput.value = '';
            metaDescriptionInput.value = '';
            metaTargetDateInput.value = ''; 
            metaPriorityInput.value = 'Média'; // Reseta prioridade para o padrão
            
            salvarMetas();
            renderizarMetas(); // Atualiza a exibição das metas
        } else {
            alert("Por favor, dê um título para a sua meta!"); 
        }
    });

    // --- RENDERIZAÇÃO INICIAL DAS METAS AO CARREGAR A PÁGINA --- //
    renderizarMetas(); 
}