// js/dashboard.js - Lógica específica da página Dashboard

const addHabitFormDashboard = document.getElementById('add-habit-form'); 
const calendarioContainerDashboard = document.getElementById('calendario-container');
const listaSequenciaHabitosElDashboard = document.getElementById('lista-sequencia-habitos');
const grafico7DiasContainerElDashboard = document.getElementById('grafico-ultimos-7dias-wrapper'); 
const notificationsPlaceholderElDashboard = document.querySelector('.notifications-module .notifications-placeholder');
const comparacaoSemanalContainerElDashboard = document.getElementById('comparacao-semanal-container'); // Novo elemento

if (addHabitFormDashboard || calendarioContainerDashboard) { 
    // --- VARIÁVEIS GLOBAIS DO DASHBOARD ---
    let historicoHabitos = JSON.parse(localStorage.getItem('meuHistoricoHabitos')) || {};
    let dataAtualExibidaNoCalendario = new Date(); 
    let habitsListaDefinicoes = JSON.parse(localStorage.getItem('meusHabitos')) || []; 
    const chaveLocalStorageNomePerfil = 'meuNomeDePerfil'; 
    let milestonesAtingidosNotificados = JSON.parse(localStorage.getItem('meusMilestonesNotificados')) || {};
    const metasDeSequenciaParaNotificar = [3, 7, 14, 30, 60, 90, 100, 180, 365];

    // --- FUNÇÕES AUXILIARES GERAIS DO DASHBOARD ---
    function getDataAtualFormatadaParaHistorico() {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    }
    
    function salvarHistoricoHabitosNoStorage() {
        localStorage.setItem('meuHistoricoHabitos', JSON.stringify(historicoHabitos));
    }

    function salvarDefinicoesHabitosNoStorage() { 
        localStorage.setItem('meusHabitos', JSON.stringify(habitsListaDefinicoes));
    }

    function salvarMilestonesNotificadosNoStorage() {
        localStorage.setItem('meusMilestonesNotificados', JSON.stringify(milestonesAtingidosNotificados));
    }

    // --- DECLARAÇÕES ANTECIPADAS DE FUNÇÕES DE RENDERIZAÇÃO DO DASHBOARD ---
    let renderizarCalendarioNaTela;
    let renderizarSequenciasDeHabitos;
    let renderizarGraficoUltimos7DiasNaTela;
    let exibirNomeDoPerfilNoTituloDashboard;
    let exibirNotificacoesDashboard;
    let calcularTaxaConclusaoHabito; 
    let renderizarComparacaoSemanal; // Nova função

    // --- PERSONALIZAÇÃO: NOME DO PERFIL ---
    exibirNomeDoPerfilNoTituloDashboard = function() {
        const dashboardTitleEl = document.querySelector('.dashboard-title'); 
        const nomeSalvo = localStorage.getItem(chaveLocalStorageNomePerfil);
        if (dashboardTitleEl && nomeSalvo && nomeSalvo.trim() !== "") {
            dashboardTitleEl.textContent = `${nomeSalvo}, seu Painel de Controle Futurista`;
        } else if (dashboardTitleEl) {
            dashboardTitleEl.textContent = "Seu Painel de Controle Futurista";
        }
    }

    // --- LÓGICA DE NOTIFICAÇÕES ---
    if (notificationsPlaceholderElDashboard) {
        exibirNotificacoesDashboard = function(mensagens) {
            if (!notificationsPlaceholderElDashboard) return;
            if (mensagens && mensagens.length > 0) {
                notificationsPlaceholderElDashboard.innerHTML = ''; 
                mensagens.forEach((msg, index) => { 
                    const notificacaoDiv = document.createElement('div');
                    notificacaoDiv.classList.add('notification-item', 'animate-fadeInUp'); 
                    notificacaoDiv.style.animationDelay = `${index * 0.1}s`; 
                    notificacaoDiv.innerHTML = msg; 
                    notificationsPlaceholderElDashboard.appendChild(notificacaoDiv);
                });
            } else {
                notificationsPlaceholderElDashboard.innerHTML = '<p class="empty-list-message">Nenhuma notificação nova.</p>';
            }
        }
    }

    // --- LÓGICA DO CALENDÁRIO ---
    if (calendarioContainerDashboard) {
        const mesAnoAtualElCalendario = document.getElementById('mes-ano-atual');
        const calendarioGridDiasElCalendario = document.getElementById('calendario-grid-dias');
        const btnMesAnteriorCalendario = document.getElementById('btn-mes-anterior');
        const btnProximoMesCalendario = document.getElementById('btn-proximo-mes');

        renderizarCalendarioNaTela = function(ano, mes) { 
            if (!calendarioGridDiasElCalendario || !mesAnoAtualElCalendario) return; 
            calendarioGridDiasElCalendario.innerHTML = ''; 
            const primeiroDiaDoMes = new Date(ano, mes, 1);
            const ultimoDiaDoMes = new Date(ano, mes + 1, 0);
            const numeroDeDiasNoMes = ultimoDiaDoMes.getDate();
            const diaDaSemanaDoPrimeiroDia = primeiroDiaDoMes.getDay(); 
            const nomesDosMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            mesAnoAtualElCalendario.textContent = `${nomesDosMeses[mes]} ${ano}`;
            for (let i = 0; i < diaDaSemanaDoPrimeiroDia; i++) {
                const diaVazioEl = document.createElement('div');
                diaVazioEl.classList.add('dia-do-calendario', 'dia-vazio');
                calendarioGridDiasElCalendario.appendChild(diaVazioEl);
            }
            const hoje = new Date();
            const hojeFormatado = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
            for (let diaLoop = 1; diaLoop <= numeroDeDiasNoMes; diaLoop++) {
                const diaEl = document.createElement('div');
                diaEl.classList.add('dia-do-calendario');
                diaEl.textContent = diaLoop;
                const dataCompletaDoDia = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(diaLoop).padStart(2, '0')}`;
                if (typeof historicoHabitos !== 'undefined' && historicoHabitos[dataCompletaDoDia] && historicoHabitos[dataCompletaDoDia].length > 0) {
                    diaEl.classList.add('dia-com-atividade');
                }
                if (dataCompletaDoDia === hojeFormatado) {
                    diaEl.classList.add('dia-atual');
                }
                diaEl.addEventListener('click', () => {
                    const diaFormatadoParaAlert = String(diaLoop).padStart(2, '0');
                    const mesFormatadoParaAlert = String(mes + 1).padStart(2, '0');
                    const dataClicadaParaExibicao = `${diaFormatadoParaAlert}/${mesFormatadoParaAlert}/${ano}`;
                    if (typeof historicoHabitos !== 'undefined' && historicoHabitos[dataCompletaDoDia] && historicoHabitos[dataCompletaDoDia].length > 0) {
                        const atividadesDoDia = historicoHabitos[dataCompletaDoDia];
                        const mensagemAlert = `Atividades concluídas em ${dataClicadaParaExibicao}:\n\n- ${atividadesDoDia.join('\n- ')}`;
                        alert(mensagemAlert);
                    } else {
                        alert(`Nenhuma atividade registrada para ${dataClicadaParaExibicao}.`);
                    }
                });
                calendarioGridDiasElCalendario.appendChild(diaEl);
            }
        }
        btnMesAnteriorCalendario.addEventListener('click', () => {
            dataAtualExibidaNoCalendario.setMonth(dataAtualExibidaNoCalendario.getMonth() - 1);
            if (typeof renderizarCalendarioNaTela === 'function') renderizarCalendarioNaTela(dataAtualExibidaNoCalendario.getFullYear(), dataAtualExibidaNoCalendario.getMonth());
        });
        btnProximoMesCalendario.addEventListener('click', () => {
            dataAtualExibidaNoCalendario.setMonth(dataAtualExibidaNoCalendario.getMonth() + 1);
            if (typeof renderizarCalendarioNaTela === 'function') renderizarCalendarioNaTela(dataAtualExibidaNoCalendario.getFullYear(), dataAtualExibidaNoCalendario.getMonth());
        });
    } 

    // --- LÓGICA DE PROGRESSO - CONTADOR DE SEQUÊNCIA E TAXA DE CONCLUSÃO ---
    if (listaSequenciaHabitosElDashboard) {
        function calcularSequenciaHabito(textoDoHabito) {
            let sequencia = 0;
            let dataParaVerificar = new Date(); 
            while (true) {
                const dataFormatada = `${dataParaVerificar.getFullYear()}-${String(dataParaVerificar.getMonth() + 1).padStart(2, '0')}-${String(dataParaVerificar.getDate()).padStart(2, '0')}`;
                if (historicoHabitos[dataFormatada] && historicoHabitos[dataFormatada].includes(textoDoHabito)) {
                    sequencia++;
                    dataParaVerificar.setDate(dataParaVerificar.getDate() - 1);
                } else {
                    break; 
                }
            }
            return sequencia;
        }

        calcularTaxaConclusaoHabito = function(textoDoHabito, numDiasPeriodo) {
            let diasCompletos = 0;
            for (let i = 0; i < numDiasPeriodo; i++) {
                const dataParaVerificar = new Date();
                dataParaVerificar.setDate(dataParaVerificar.getDate() - i); 
                const dataFormatada = `${dataParaVerificar.getFullYear()}-${String(dataParaVerificar.getMonth() + 1).padStart(2, '0')}-${String(dataParaVerificar.getDate()).padStart(2, '0')}`;
                if (historicoHabitos[dataFormatada] && historicoHabitos[dataFormatada].includes(textoDoHabito)) {
                    diasCompletos++;
                }
            }
            return numDiasPeriodo > 0 ? Math.round((diasCompletos / numDiasPeriodo) * 100) : 0;
        }

        renderizarSequenciasDeHabitos = function() { 
            if (!listaSequenciaHabitosElDashboard) return;
            let novasNotificacoesParaExibir = [];
            if (!habitsListaDefinicoes || habitsListaDefinicoes.length === 0) {
                listaSequenciaHabitosElDashboard.innerHTML = '<p class="empty-list-message">Adicione hábitos para ver suas sequências.</p>';
                if (typeof exibirNotificacoesDashboard === 'function') exibirNotificacoesDashboard(novasNotificacoesParaExibir);
                return;
            }
            listaSequenciaHabitosElDashboard.innerHTML = ''; 
            let algumaSequenciaMostrada = false;

            habitsListaDefinicoes.forEach((habit, index) => { 
                const sequencia = calcularSequenciaHabito(habit.text);
                const taxaConclusao30Dias = calcularTaxaConclusaoHabito(habit.text, 30); 

                const itemLista = document.createElement('li');
                itemLista.classList.add('animate-fadeInUp'); 
                itemLista.style.animationDelay = `${index * 0.07}s`; 

                const nomeHabitoSpan = document.createElement('span');
                nomeHabitoSpan.classList.add('habit-info-principal'); 
                nomeHabitoSpan.textContent = `${habit.text}: `;
                
                const taxaSpan = document.createElement('span');
                taxaSpan.classList.add('habit-completion-rate');
                taxaSpan.textContent = `(${taxaConclusao30Dias}% últimos 30d)`;
                nomeHabitoSpan.appendChild(taxaSpan); 

                const contagemStreakSpan = document.createElement('span');
                contagemStreakSpan.classList.add('streak-count');
                contagemStreakSpan.textContent = `${sequencia} dia${sequencia !== 1 ? 's' : ''}`;
                
                itemLista.appendChild(nomeHabitoSpan);
                itemLista.appendChild(contagemStreakSpan);
                listaSequenciaHabitosElDashboard.appendChild(itemLista);
                algumaSequenciaMostrada = true;

                metasDeSequenciaParaNotificar.forEach(meta => {
                    if (sequencia === meta) {
                        const chaveMilestone = `${habit.text}_streak_${meta}`; 
                        if (!milestonesAtingidosNotificados[chaveMilestone]) {
                            const mensagemParabens = `Parabéns! Você atingiu uma sequência de <strong>${meta} dias</strong> para o hábito "<strong>${habit.text}</strong>"! Continue assim!`;
                            novasNotificacoesParaExibir.push(mensagemParabens);
                            milestonesAtingidosNotificados[chaveMilestone] = true; 
                        }
                    }
                });
            });

            if (!algumaSequenciaMostrada && habitsListaDefinicoes.length > 0) {
                 listaSequenciaHabitosElDashboard.innerHTML = '<p class="empty-list-message">Complete seus hábitos para construir sequências!</p>';
            }
            
            if (novasNotificacoesParaExibir.length > 0) {
                salvarMilestonesNotificadosNoStorage(); 
            }
            if (typeof exibirNotificacoesDashboard === 'function') {
                exibirNotificacoesDashboard(novasNotificacoesParaExibir);
            }
        }
    }

    // --- LÓGICA DE PROGRESSO - GRÁFICO ÚLTIMOS 7 DIAS ---
    if (grafico7DiasContainerElDashboard) {
        const barrasContainerElGrafico = grafico7DiasContainerElDashboard.querySelector('.grafico-barras-simples');
        const legendasContainerElGrafico = grafico7DiasContainerElDashboard.querySelector('.grafico-legendas-dias');
        renderizarGraficoUltimos7DiasNaTela = function() {
            if (!barrasContainerElGrafico || !legendasContainerElGrafico) return;
            barrasContainerElGrafico.innerHTML = ''; 
            legendasContainerElGrafico.innerHTML = ''; 
            const dados7Dias = [];
            const legendasDiasTexto = [];
            const nomesDiasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            let maximoHabitosConcluidos = 0;
            for (let i = 6; i >= 0; i--) { 
                const dataAlvo = new Date();
                dataAlvo.setDate(dataAlvo.getDate() - i); 
                const dataFormatada = `${dataAlvo.getFullYear()}-${String(dataAlvo.getMonth() + 1).padStart(2, '0')}-${String(dataAlvo.getDate()).padStart(2, '0')}`;
                const habitosDoDia = historicoHabitos[dataFormatada] || [];
                dados7Dias.push(habitosDoDia.length);
                if (habitosDoDia.length > maximoHabitosConcluidos) {
                    maximoHabitosConcluidos = habitosDoDia.length;
                }
                legendasDiasTexto.push(nomesDiasSemana[dataAlvo.getDay()]); 
            }
            if (maximoHabitosConcluidos === 0 && dados7Dias.every(count => count === 0)) {
                 barrasContainerElGrafico.innerHTML = '<p class="empty-list-message" style="width:100%; text-align:center; align-self:center;">Nenhuma atividade nos últimos 7 dias.</p>';
                 legendasDiasTexto.forEach(legendaTexto => { 
                    const legendaEl = document.createElement('div');
                    legendaEl.classList.add('legenda-dia');
                    legendaEl.textContent = legendaTexto;
                    legendasContainerElGrafico.appendChild(legendaEl);
                });
                return;
            }
            const alturaMaximaGrafico = 150; 
            dados7Dias.forEach((contagem, index) => {
                const barraEl = document.createElement('div');
                barraEl.classList.add('barra');
                const alturaBarra = maximoHabitosConcluidos > 0 ? (contagem / maximoHabitosConcluidos) * alturaMaximaGrafico : 0;
                barraEl.style.height = `${Math.max(alturaBarra, 0)}px`; 
                const tooltipEl = document.createElement('span');
                tooltipEl.classList.add('contagem-tooltip');
                tooltipEl.textContent = contagem;
                barraEl.appendChild(tooltipEl);
                barrasContainerElGrafico.appendChild(barraEl);
                const legendaEl = document.createElement('div');
                legendaEl.classList.add('legenda-dia');
                legendaEl.textContent = legendasDiasTexto[index];
                legendasContainerElGrafico.appendChild(legendaEl);
            });
        }
    }
    
    // --- LÓGICA DE PROGRESSO - COMPARAÇÃO SEMANAL DE HÁBITOS ---
    if (comparacaoSemanalContainerElDashboard) {
        const habitosEstaSemanaEl = document.getElementById('habitos-esta-semana');
        const habitosSemanaPassadaEl = document.getElementById('habitos-semana-passada');
        const diferencaSemanalEl = document.getElementById('diferenca-semanal');

        function getInicioFimDaSemana(data) {
            const dataBase = new Date(data);
            const diaDaSemana = dataBase.getDay(); 
            const inicioSemana = new Date(dataBase);
            inicioSemana.setDate(dataBase.getDate() - diaDaSemana);
            inicioSemana.setHours(0, 0, 0, 0); 
            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999); 
            return { inicio: inicioSemana, fim: fimSemana };
        }

        function contarHabitosNoPeriodo(dataInicio, dataFim) {
            let contagemTotal = 0;
            let dataCorrente = new Date(dataInicio);
            while (dataCorrente <= dataFim) {
                const dataFormatada = `${dataCorrente.getFullYear()}-${String(dataCorrente.getMonth() + 1).padStart(2, '0')}-${String(dataCorrente.getDate()).padStart(2, '0')}`;
                if (historicoHabitos[dataFormatada]) {
                    contagemTotal += historicoHabitos[dataFormatada].length;
                }
                dataCorrente.setDate(dataCorrente.getDate() + 1); 
            }
            return contagemTotal;
        }

        renderizarComparacaoSemanal = function() { 
            if (!habitosEstaSemanaEl || !habitosSemanaPassadaEl || !diferencaSemanalEl) return;
            const hoje = new Date();
            const semanaAtual = getInicioFimDaSemana(hoje);
            const contagemSemanaAtual = contarHabitosNoPeriodo(semanaAtual.inicio, semanaAtual.fim);
            const dataSemanaPassada = new Date(hoje);
            dataSemanaPassada.setDate(hoje.getDate() - 7); 
            const semanaPassada = getInicioFimDaSemana(dataSemanaPassada);
            const contagemSemanaPassada = contarHabitosNoPeriodo(semanaPassada.inicio, semanaPassada.fim);

            habitosEstaSemanaEl.textContent = contagemSemanaAtual;
            habitosSemanaPassadaEl.textContent = contagemSemanaPassada;
            const diferenca = contagemSemanaAtual - contagemSemanaPassada;
            diferencaSemanalEl.textContent = `${diferenca > 0 ? '+' : ''}${diferenca}`;
            diferencaSemanalEl.classList.remove('positivo', 'negativo', 'neutro');
            if (diferenca > 0) {
                diferencaSemanalEl.classList.add('positivo');
            } else if (diferenca < 0) {
                diferencaSemanalEl.classList.add('negativo');
            } else {
                diferencaSemanalEl.classList.add('neutro');
            }
        }
    }

    // --- FUNÇÃO CENTRAL PARA ATUALIZAR HISTÓRICO E UI DO DASHBOARD ---
    window.atualizarHistoricoHabitoEUIDashboard = function(textoDoHabito, foiConcluido) {
        const dataDeHoje = getDataAtualFormatadaParaHistorico();
        if (!historicoHabitos[dataDeHoje]) { historicoHabitos[dataDeHoje] = []; }
        const habitosConcluidosHoje = historicoHabitos[dataDeHoje];
        if (foiConcluido) {
            if (!habitosConcluidosHoje.includes(textoDoHabito)) { habitosConcluidosHoje.push(textoDoHabito); }
        } else {
            const indiceNoHistorico = habitosConcluidosHoje.indexOf(textoDoHabito);
            if (indiceNoHistorico > -1) { habitosConcluidosHoje.splice(indiceNoHistorico, 1); }
            if (habitosConcluidosHoje.length === 0) { delete historicoHabitos[dataDeHoje]; }
        }
        salvarHistoricoHabitosNoStorage();
        if (typeof renderizarCalendarioNaTela === 'function') {
            renderizarCalendarioNaTela(dataAtualExibidaNoCalendario.getFullYear(), dataAtualExibidaNoCalendario.getMonth());
        }
        if (typeof renderizarSequenciasDeHabitos === 'function') {
            renderizarSequenciasDeHabitos();
        }
        if (typeof renderizarGraficoUltimos7DiasNaTela === 'function') {
            renderizarGraficoUltimos7DiasNaTela();
        }
        if (typeof renderizarComparacaoSemanal === 'function') { // Chama a nova função
            renderizarComparacaoSemanal();
        }
    }

    // --- LÓGICA DA CHECKLIST DE HÁBITOS (INTERAÇÕES) ---
    if (addHabitFormDashboard) { 
        const newHabitInputDashboard = document.getElementById('new-habit-input');
        const dailyChecklistDashboard = document.getElementById('daily-checklist');
        const addHabitErrorElDashboard = document.getElementById('add-habit-error'); 

        function renderizarHabitosNaChecklist() { 
            if (!dailyChecklistDashboard) return; 
            dailyChecklistDashboard.innerHTML = '';
            const dataDeHoje = getDataAtualFormatadaParaHistorico();
            const habitosConcluidosHoje = historicoHabitos[dataDeHoje] || [];
            if (habitsListaDefinicoes.length === 0) {
                dailyChecklistDashboard.innerHTML = '<p class="empty-list-message">Você ainda não adicionou nenhum hábito...</p>';
                return;
            }
            habitsListaDefinicoes.forEach((habit, index) => {
                const itemLista = document.createElement('li');
                itemLista.classList.add('checklist-item', 'animate-fadeInUp');
                itemLista.style.animationDelay = `${index * 0.05}s`;
                const isCompletedToday = habitosConcluidosHoje.includes(habit.text);
                if (isCompletedToday) { itemLista.classList.add('completed'); }
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = isCompletedToday;
                checkbox.id = `habit-${index}`;
                checkbox.addEventListener('change', () => {
                    window.atualizarHistoricoHabitoEUIDashboard(habit.text, checkbox.checked); 
                    renderizarHabitosNaChecklist(); 
                });
                const label = document.createElement('label');
                label.htmlFor = `habit-${index}`;
                label.textContent = habit.text;
                const removeButton = document.createElement('button');
                removeButton.classList.add('btn-remove-habit');
                removeButton.textContent = 'X';
                removeButton.setAttribute('aria-label', 'Remover Hábito');
                removeButton.addEventListener('click', () => {
                    if (habitosConcluidosHoje.includes(habit.text)) {
                        window.atualizarHistoricoHabitoEUIDashboard(habit.text, false); 
                    }
                    habitsListaDefinicoes.splice(index, 1); 
                    salvarDefinicoesHabitosNoStorage();         
                    renderizarHabitosNaChecklist();  
                });
                itemLista.appendChild(checkbox);
                itemLista.appendChild(label);
                itemLista.appendChild(removeButton);
                dailyChecklistDashboard.appendChild(itemLista);
            });
        }

        addHabitFormDashboard.addEventListener('submit', (evento) => {
            evento.preventDefault();
            const textoDoHabito = newHabitInputDashboard.value.trim();
            if (addHabitErrorElDashboard) addHabitErrorElDashboard.style.display = 'none'; 

            if (textoDoHabito) {
                if (habitsListaDefinicoes.some(h => h.text === textoDoHabito)) {
                    if (addHabitErrorElDashboard) { 
                        addHabitErrorElDashboard.textContent = "Este hábito já existe na sua lista!";
                        addHabitErrorElDashboard.style.display = 'block';
                    }
                    return;
                }
                const novoHabito = { text: textoDoHabito };
                habitsListaDefinicoes.push(novoHabito);
                newHabitInputDashboard.value = '';
                salvarDefinicoesHabitosNoStorage(); 
                renderizarHabitosNaChecklist();
                if (typeof renderizarSequenciasDeHabitos === 'function') { renderizarSequenciasDeHabitos(); } 
                if (typeof renderizarGraficoUltimos7DiasNaTela === 'function') { renderizarGraficoUltimos7DiasNaTela(); }
                if (typeof renderizarComparacaoSemanal === 'function') { renderizarComparacaoSemanal(); }
            } else {
                if (addHabitErrorElDashboard) { 
                    addHabitErrorElDashboard.textContent = "Por favor, escreva um hábito antes de adicionar!";
                    addHabitErrorElDashboard.style.display = 'block';
                }
            }
        });

        if (newHabitInputDashboard && addHabitErrorElDashboard) { 
            newHabitInputDashboard.addEventListener('input', () => {
                if (addHabitErrorElDashboard.style.display === 'block') {
                    addHabitErrorElDashboard.style.display = 'none';
                    addHabitErrorElDashboard.textContent = ''; 
                }
            });
        }
        if (typeof renderizarHabitosNaChecklist === 'function') renderizarHabitosNaChecklist(); 
    }

    // --- CHAMADAS DE RENDERIZAÇÃO INICIAIS PARA O DASHBOARD ---
    if (typeof renderizarCalendarioNaTela === 'function') {
        renderizarCalendarioNaTela(dataAtualExibidaNoCalendario.getFullYear(), dataAtualExibidaNoCalendario.getMonth());
    }
    if (typeof renderizarSequenciasDeHabitos === 'function') {
        renderizarSequenciasDeHabitos(); 
    }
    if (typeof renderizarGraficoUltimos7DiasNaTela === 'function') {
        renderizarGraficoUltimos7DiasNaTela();
    }
    if (typeof renderizarComparacaoSemanal === 'function') { // Chamada inicial para a comparação semanal
        renderizarComparacaoSemanal();
    }
    if (typeof exibirNomeDoPerfilNoTituloDashboard === 'function') {
        exibirNomeDoPerfilNoTituloDashboard(); 
    }
    if (typeof exibirNotificacoesDashboard === 'function' && (!milestonesAtingidosNotificados || Object.keys(milestonesAtingidosNotificados).length === 0)) {
        // Se não houver milestones já notificados, garante que a área de notificação comece com a mensagem padrão.
        // A renderizarSequencias já chama exibirNotificacoes, então essa chamada aqui pode ser redundante ou para garantir o estado inicial.
        // exibirNotificacoesDashboard([]); // Já é chamada no início do bloco if (notificationsPlaceholderElGlobal)
    }
} 
// --- FIM DA LÓGICA DO DASHBOARD ---