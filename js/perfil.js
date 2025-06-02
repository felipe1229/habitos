// --------------------------------------------------- //
// --- LÓGICA DA PÁGINA DE PERFIL (login.html) --- //
// --------------------------------------------------- //
// Seleciona o formulário de nome de perfil
const perfilNameForm = document.getElementById('perfil-name-form'); 
if (perfilNameForm) { // Garante que o script só roda se o formulário existir
    const perfilPageNameInput = document.getElementById('perfil-page-name-input'); // Input para o nome
    const perfilSaveConfirmationMessage = document.getElementById('perfil-save-confirmation'); // Mensagem de confirmação
    const keyNomePerfilLogin = 'meuNomeDePerfil'; // Chave do localStorage (consistente com outras páginas)

    /** Carrega o nome salvo do localStorage para o campo de input na página de perfil. */
    function carregarNomeParaPaginaPerfilLogin() { 
        const nomeSalvo = localStorage.getItem(keyNomePerfilLogin); 
        if (nomeSalvo) { 
            perfilPageNameInput.value = nomeSalvo; 
        } 
    }

    // Evento de submissão do formulário de nome na página de perfil
    perfilNameForm.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Impede o recarregamento da página
        localStorage.setItem(keyNomePerfilLogin, perfilPageNameInput.value.trim()); // Salva o nome
        perfilSaveConfirmationMessage.style.display = 'block'; // Mostra mensagem de sucesso
        // Esconde a mensagem após 3 segundos
        setTimeout(() => { 
            perfilSaveConfirmationMessage.style.display = 'none'; 
        }, 3000);
    });

    // Carrega o nome ao iniciar a página de perfil
    carregarNomeParaPaginaPerfilLogin();
}