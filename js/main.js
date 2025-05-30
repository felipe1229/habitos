// js/main.js - Lógica global, como o menu hambúrguer

// --- LÓGICA DO MENU HAMBÚRGUER ---
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });
}
// --- FIM DA LÓGICA DO MENU HAMBÚRGUER ---


// --- APLICAR COR DE DESTAQUE PERSONALIZADA AO CARREGAR A PÁGINA ---
(function aplicarTemaSalvo() {
    console.log("[COR DEBUG] main.js: Tentando aplicar tema salvo...");
    const localStorageKeyCorDestaque = 'corDestaquePersonalizada';
    const defaultAccentColor = '#ff003c'; 
    const corSalva = localStorage.getItem(localStorageKeyCorDestaque);
    const corAplicar = corSalva || defaultAccentColor; 

    console.log(`[COR DEBUG] main.js: Cor a aplicar na carga: ${corAplicar} (Salva: ${corSalva})`);

    function hexParaRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (!hex) return null;
        hex = hex.replace('#', '');
        if (hex.length === 3) { 
            r = parseInt(hex[0] + hex[0], 16); g = parseInt(hex[1] + hex[1], 16); b = parseInt(hex[2] + hex[2], 16); 
        } else if (hex.length === 6) { 
            r = parseInt(hex.substring(0, 2), 16); g = parseInt(hex.substring(2, 4), 16); b = parseInt(hex.substring(4, 6), 16); 
        } else { console.warn("[COR DEBUG] main.js: Formato HEX inválido em hexParaRgb:", hex); return null; }
        if (isNaN(r) || isNaN(g) || isNaN(b)) { console.warn("[COR DEBUG] main.js: Resultado NaN em hexParaRgb para:", hex); return null;}
        return { r, g, b };
    }

    function clarearCorHex(hex, percent) {
        let rgb = hexParaRgb(hex);
        if (!rgb) { console.warn("[COR DEBUG] main.js: Não foi possível clarear cor, hexParaRgb falhou para:", hex); return hex; }
        rgb.r = Math.min(255, Math.floor(rgb.r * (1 + percent / 100)));
        rgb.g = Math.min(255, Math.floor(rgb.g * (1 + percent / 100)));
        rgb.b = Math.min(255, Math.floor(rgb.b * (1 + percent / 100)));
        const paraHex = c => c.toString(16).padStart(2, '0');
        return `#${paraHex(rgb.r)}${paraHex(rgb.g)}${paraHex(rgb.b)}`;
    }

    document.documentElement.style.setProperty('--cor-destaque-vermelho', corAplicar);
    console.log(`[COR DEBUG] main.js: Set --cor-destaque-vermelho = ${corAplicar}`);
    
    let hoverColor = clarearCorHex(corAplicar, 20);
    document.documentElement.style.setProperty('--cor-destaque-vermelho-hover', hoverColor);
    console.log(`[COR DEBUG] main.js: Set --cor-destaque-vermelho-hover = ${hoverColor}`);
    
    const rgb = hexParaRgb(corAplicar);
    if (rgb) {
        document.documentElement.style.setProperty('--cor-borda-neon', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
        console.log(`[COR DEBUG] main.js: Set --cor-borda-neon = rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
        document.documentElement.style.setProperty('--sombra-suave', `0 0 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
        console.log(`[COR DEBUG] main.js: Set --sombra-suave = 0 0 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
    } else {
        console.warn("[COR DEBUG] main.js: Não foi possível obter RGB para borda/sombra da cor:", corAplicar);
    }
})(); 
// --- FIM DA APLICAÇÃO DE COR PERSONALIZADA ---