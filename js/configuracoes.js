// js/configuracoes.js - Lógica específica da página de Configurações

// --- LÓGICA DO NOME DO PERFIL ---
const configProfileForm = document.getElementById('config-profile-form');
if (configProfileForm) {
    const profileNameInput = document.getElementById('profile-name-input');
    const saveConfirmationMessage = document.getElementById('save-confirmation');
    const keyNomePerfilConfig = 'meuNomeDePerfil'; 

    function carregarNomeSalvoConfig() { 
        const nomeSalvo = localStorage.getItem(keyNomePerfilConfig); 
        if (nomeSalvo) { profileNameInput.value = nomeSalvo; } 
    }
    configProfileForm.addEventListener('submit', (evento) => {
        evento.preventDefault();
        localStorage.setItem(keyNomePerfilConfig, profileNameInput.value.trim());
        saveConfirmationMessage.style.display = 'block';
        setTimeout(() => { saveConfirmationMessage.style.display = 'none'; }, 3000);
    });
    if (typeof carregarNomeSalvoConfig === "function") carregarNomeSalvoConfig(); // Verifica se a função existe antes de chamar
}

// --- NOVA LÓGICA PARA PERSONALIZAÇÃO DE CORES ---
const configColorForm = document.getElementById('config-color-form');
if (configColorForm) {
    console.log("[COR DEBUG] config.js: Lógica de cores iniciada.");
    const colorPickerDestaque = document.getElementById('color-picker-destaque');
    const colorPickerValueSpan = document.getElementById('color-picker-value');
    const resetButton = document.getElementById('reset-color-button');
    const localStorageKeyCorDestaque = 'corDestaquePersonalizada';
    const defaultAccentColor = '#ff003c'; 

    function hexParaRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (!hex) return null;
        hex = hex.replace('#', '');
        if (hex.length === 3) { 
            r = parseInt(hex[0] + hex[0], 16); g = parseInt(hex[1] + hex[1], 16); b = parseInt(hex[2] + hex[2], 16); 
        } else if (hex.length === 6) { 
            r = parseInt(hex.substring(0, 2), 16); g = parseInt(hex.substring(2, 4), 16); b = parseInt(hex.substring(4, 6), 16); 
        } else { console.warn("[COR DEBUG] config.js: Formato HEX inválido em hexParaRgb:", hex); return null; }
        if (isNaN(r) || isNaN(g) || isNaN(b)) { console.warn("[COR DEBUG] config.js: Resultado NaN em hexParaRgb para:", hex); return null; }
        return { r, g, b };
    }

    function clarearCorHex(hex, percent) {
        let rgb = hexParaRgb(hex);
        if (!rgb) { console.warn("[COR DEBUG] config.js: Não foi possível clarear cor, hexParaRgb falhou para:", hex); return hex; }
        rgb.r = Math.min(255, Math.floor(rgb.r * (1 + percent / 100)));
        rgb.g = Math.min(255, Math.floor(rgb.g * (1 + percent / 100)));
        rgb.b = Math.min(255, Math.floor(rgb.b * (1 + percent / 100)));
        const paraHex = c => c.toString(16).padStart(2, '0');
        return `#${paraHex(rgb.r)}${paraHex(rgb.g)}${paraHex(rgb.b)}`;
    }

    function aplicarCorDeDestaque(hexColor) {
        console.log(`[COR DEBUG] config.js: aplicarCorDeDestaque chamada com: ${hexColor}`);
        if (!hexColor) { console.warn("[COR DEBUG] config.js: aplicarCorDeDestaque chamada com cor nula/inválida."); return; }

        document.documentElement.style.setProperty('--cor-destaque-vermelho', hexColor);
        console.log(`[COR DEBUG] config.js: Set --cor-destaque-vermelho = ${hexColor}`);
        
        let hoverColor = clarearCorHex(hexColor, 20); 
        document.documentElement.style.setProperty('--cor-destaque-vermelho-hover', hoverColor);
        console.log(`[COR DEBUG] config.js: Set --cor-destaque-vermelho-hover = ${hoverColor}`);

        const rgb = hexParaRgb(hexColor);
        if (rgb) {
            document.documentElement.style.setProperty('--cor-borda-neon', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
            console.log(`[COR DEBUG] config.js: Set --cor-borda-neon = rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
            document.documentElement.style.setProperty('--sombra-suave', `0 0 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
            console.log(`[COR DEBUG] config.js: Set --sombra-suave = 0 0 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
        } else {
            console.warn("[COR DEBUG] config.js: Não foi possível obter RGB para borda/sombra da cor:", hexColor);
        }
    }

    const corSalva = localStorage.getItem(localStorageKeyCorDestaque);
    console.log(`[COR DEBUG] config.js: Cor salva no localStorage ao carregar config: ${corSalva}`);
    if (corSalva) {
        // aplicarCorDeDestaque(corSalva); // Removido, pois main.js já aplica na carga
        colorPickerDestaque.value = corSalva;
        if(colorPickerValueSpan) colorPickerValueSpan.textContent = corSalva.toUpperCase();
    } else {
        // aplicarCorDeDestaque(defaultAccentColor); // Removido
        colorPickerDestaque.value = defaultAccentColor;
        if(colorPickerValueSpan) colorPickerValueSpan.textContent = defaultAccentColor.toUpperCase();
    }

    colorPickerDestaque.addEventListener('input', (evento) => {
        const novaCor = evento.target.value;
        console.log(`[COR DEBUG] config.js: Cor escolhida no picker: ${novaCor}`);
        aplicarCorDeDestaque(novaCor);
        localStorage.setItem(localStorageKeyCorDestaque, novaCor);
        if(colorPickerValueSpan) colorPickerValueSpan.textContent = novaCor.toUpperCase();
    });

    resetButton.addEventListener('click', () => {
        console.log("[COR DEBUG] config.js: Botão Reset Clicado.");
        aplicarCorDeDestaque(defaultAccentColor);
        localStorage.removeItem(localStorageKeyCorDestaque); 
        colorPickerDestaque.value = defaultAccentColor;
        if(colorPickerValueSpan) colorPickerValueSpan.textContent = defaultAccentColor.toUpperCase();
    });
}
// --- FIM DA LÓGICA PARA PERSONALIZAÇÃO DE CORES ---