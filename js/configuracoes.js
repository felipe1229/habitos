// ------------------------------------ //
// --- LÓGICA DO NOME DO PERFIL --- //
// ------------------------------------ //
const configProfileForm = document.getElementById('config-profile-form'); // Formulário de nome do perfil
if (configProfileForm) { // Executa apenas se o formulário existir
    const profileNameInput = document.getElementById('profile-name-input'); // Input do nome
    const saveConfirmationMessage = document.getElementById('save-confirmation'); // Mensagem de confirmação
    const keyNomePerfilConfig = 'meuNomeDePerfil'; // Chave do localStorage (mesma usada em outras partes)

    /** Carrega o nome salvo no localStorage para o input. */
    function carregarNomeSalvoConfig() { 
        const nomeSalvo = localStorage.getItem(keyNomePerfilConfig); 
        if (nomeSalvo) { 
            profileNameInput.value = nomeSalvo; 
        } 
    }

    // Evento de submissão do formulário de nome
    configProfileForm.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Impede recarregamento da página
        localStorage.setItem(keyNomePerfilConfig, profileNameInput.value.trim()); // Salva o nome
        saveConfirmationMessage.style.display = 'block'; // Mostra mensagem de sucesso
        // Esconde a mensagem após 3 segundos
        setTimeout(() => { 
            saveConfirmationMessage.style.display = 'none'; 
        }, 3000);
    });

    // Carrega o nome ao iniciar a página (se a função existir)
    if (typeof carregarNomeSalvoConfig === "function") {
        carregarNomeSalvoConfig();
    }
}

// ---------------------------------------------------- //
// --- LÓGICA PARA PERSONALIZAÇÃO DE CORES DO TEMA --- //
// ---------------------------------------------------- //
const configColorForm = document.getElementById('config-color-form'); // Formulário de seleção de cor
if (configColorForm) { // Executa apenas se o formulário existir
    // console.log("[COR DEBUG] config.js: Lógica de cores iniciada."); // Log para debug
    const colorPickerDestaque = document.getElementById('color-picker-destaque'); // Input type="color"
    const colorPickerValueSpan = document.getElementById('color-picker-value'); // Span para mostrar o valor HEX
    const resetButton = document.getElementById('reset-color-button'); // Botão para resetar cor
    const localStorageKeyCorDestaque = 'corDestaquePersonalizada'; // Chave do localStorage
    const defaultAccentColor = '#ff003c'; // Cor padrão do tema

    /** Converte uma cor hexadecimal para um objeto RGB.
     * (Esta função é duplicada de main.js, idealmente seria centralizada em um utilitário)
     * @param {string} hex - A cor em formato hexadecimal.
     * @returns {{r: number, g: number, b: number}|null} Objeto RGB ou null se inválido.
     */
    function hexParaRgb(hex) {
        // ... (código da função como em main.js)
        let r = 0, g = 0, b = 0;
        if (!hex) return null;
        hex = hex.replace('#', '');
        if (hex.length === 3) { 
            r = parseInt(hex[0] + hex[0], 16); g = parseInt(hex[1] + hex[1], 16); b = parseInt(hex[2] + hex[2], 16); 
        } else if (hex.length === 6) { 
            r = parseInt(hex.substring(0, 2), 16); g = parseInt(hex.substring(2, 4), 16); b = parseInt(hex.substring(4, 6), 16); 
        } else { return null; }
        if (isNaN(r) || isNaN(g) || isNaN(b)) { return null;}
        return { r, g, b };
    }

    /** Clareia uma cor hexadecimal por uma dada porcentagem.
     * (Esta função é duplicada de main.js, idealmente seria centralizada)
     * @param {string} hex - A cor hexadecimal base.
     * @param {number} percent - A porcentagem para clarear.
     * @returns {string} A nova cor hexadecimal clareada.
     */
    function clarearCorHex(hex, percent) {
        // ... (código da função como em main.js)
        let rgb = hexParaRgb(hex);
        if (!rgb) { return hex; }
        rgb.r = Math.min(255, Math.floor(rgb.r * (1 + percent / 100)));
        rgb.g = Math.min(255, Math.floor(rgb.g * (1 + percent / 100)));
        rgb.b = Math.min(255, Math.floor(rgb.b * (1 + percent / 100)));
        const paraHex = c => c.toString(16).padStart(2, '0');
        return `#${paraHex(rgb.r)}${paraHex(rgb.g)}${paraHex(rgb.b)}`;
    }

    /** Aplica a cor de destaque escolhida às variáveis CSS globais.
     * @param {string} hexColor - A cor a ser aplicada.
     */
    function aplicarCorDeDestaqueConfigPage(hexColor) { // Nome ligeiramente diferente para evitar conflito se main.js for carregado depois com o mesmo nome de função global
        // console.log(`[COR DEBUG] config.js: aplicarCorDeDestaque chamada com: ${hexColor}`);
        if (!hexColor) { /* console.warn("[COR DEBUG] config.js: aplicarCorDeDestaque chamada com cor nula/inválida."); */ return; }

        // Define as variáveis CSS no elemento :root (document.documentElement)
        document.documentElement.style.setProperty('--cor-destaque-vermelho', hexColor);
        
        let hoverColor = clarearCorHex(hexColor, 20); // Calcula cor para hover
        document.documentElement.style.setProperty('--cor-destaque-vermelho-hover', hoverColor);

        const rgbPrincipal = hexParaRgb(hexColor); // Converte para RGB
        if (rgbPrincipal) {
            document.documentElement.style.setProperty('--cor-borda-neon', `rgba(${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}, 0.5)`);
            document.documentElement.style.setProperty('--cor-borda-neon-rgb', `${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}`);
            document.documentElement.style.setProperty('--sombra-suave', `0 0 15px rgba(${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}, 0.3)`);
        } else {
            // console.warn("[COR DEBUG] config.js: Não foi possível obter RGB para borda/sombra da cor:", hexColor);
        }
    }

    // Carrega a cor salva ao iniciar a página de configurações
    const corSalva = localStorage.getItem(localStorageKeyCorDestaque);
    // console.log(`[COR DEBUG] config.js: Cor salva no localStorage ao carregar config: ${corSalva}`);
    if (corSalva) {
        // A aplicação da cor ao carregar a página já é feita pelo main.js globalmente.
        // Aqui, apenas atualizamos o valor do color picker e do span.
        colorPickerDestaque.value = corSalva;
        if(colorPickerValueSpan) colorPickerValueSpan.textContent = corSalva.toUpperCase();
    } else {
        colorPickerDestaque.value = defaultAccentColor;
        if(colorPickerValueSpan) colorPickerValueSpan.textContent = defaultAccentColor.toUpperCase();
    }

    // Evento de mudança no seletor de cor
    colorPickerDestaque.addEventListener('input', (evento) => {
        const novaCor = evento.target.value;
        // console.log(`[COR DEBUG] config.js: Cor escolhida no picker: ${novaCor}`);
        aplicarCorDeDestaqueConfigPage(novaCor); // Aplica a nova cor em tempo real
        localStorage.setItem(localStorageKeyCorDestaque, novaCor); // Salva no localStorage
        if(colorPickerValueSpan) colorPickerValueSpan.textContent = novaCor.toUpperCase(); // Atualiza o span
    });

    // Evento do botão de resetar cor
    resetButton.addEventListener('click', () => {
        // console.log("[COR DEBUG] config.js: Botão Reset Clicado.");
        aplicarCorDeDestaqueConfigPage(defaultAccentColor); // Aplica a cor padrão
        localStorage.removeItem(localStorageKeyCorDestaque); // Remove do localStorage
        colorPickerDestaque.value = defaultAccentColor; // Reseta o input de cor
        if(colorPickerValueSpan) colorPickerValueSpan.textContent = defaultAccentColor.toUpperCase(); // Reseta o span
    });
}