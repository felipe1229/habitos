// js/perfil.js - Lógica específica da página de Perfil (login.html)

// --- LÓGICA DA PÁGINA DE PERFIL (login.html) ---
const perfilNameForm = document.getElementById('perfil-name-form');
if (perfilNameForm) {
    const perfilPageNameInput = document.getElementById('perfil-page-name-input');
    const perfilSaveConfirmationMessage = document.getElementById('perfil-save-confirmation');
    const keyNomePerfilLogin = 'meuNomeDePerfil'; 

    function carregarNomeParaPaginaPerfilLogin() { 
        const nomeSalvo = localStorage.getItem(keyNomePerfilLogin); 
        if (nomeSalvo) { perfilPageNameInput.value = nomeSalvo; } 
    }
    perfilNameForm.addEventListener('submit', (evento) => {
        evento.preventDefault();
        localStorage.setItem(keyNomePerfilLogin, perfilPageNameInput.value.trim());
        perfilSaveConfirmationMessage.style.display = 'block';
        setTimeout(() => { perfilSaveConfirmationMessage.style.display = 'none'; }, 3000);
    });
    carregarNomeParaPaginaPerfilLogin();
}
// --- FIM DA LÓGICA DA PÁGINA DE PERFIL ---