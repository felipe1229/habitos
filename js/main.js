// js/main.js - Lógica global do site, como menu hambúrguer e aplicação de tema personalizado.

// Aguarda o DOM estar completamente carregado para executar o script.
// (Alternativamente, colocar <script defer src="..."></script> no HTML)

// --------------------------------- //
// --- LÓGICA DO MENU HAMBÚRGUER --- //
// --------------------------------- //
// Seleciona o elemento do ícone do menu (toggle) e a lista de links da navegação.
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Adiciona funcionalidade ao menu hambúrguer apenas se os elementos existirem na página.
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        // Alterna a classe 'active' na lista de links para mostrá-la ou escondê-la (controlado pelo CSS).
        navLinks.classList.toggle('active');
        // Alterna a classe 'open' no ícone do menu para animar a transformação em "X" (controlado pelo CSS).
        menuToggle.classList.toggle('open');
    });
}
// --- FIM DA LÓGICA DO MENU HAMBÚRGUER --- //


// ------------------------------------------------------------------- //
// --- APLICAR COR DE DESTAQUE PERSONALIZADA AO CARREGAR A PÁGINA --- //
// ------------------------------------------------------------------- //
// Função auto-executável (IIFE) para aplicar o tema de cor salvo no localStorage.
(function aplicarTemaSalvo() {
    // console.log("[COR DEBUG] main.js: Tentando aplicar tema salvo..."); // Para depuração

    const localStorageKeyCorDestaque = 'corDestaquePersonalizada'; // Chave usada no localStorage para a cor.
    const defaultAccentColor = '#ff003c'; // Cor de destaque padrão do site.
    
    // Obtém a cor salva; se não houver, usa a cor padrão.
    const corSalva = localStorage.getItem(localStorageKeyCorDestaque);
    const corAplicar = corSalva || defaultAccentColor; 

    // console.log(`[COR DEBUG] main.js: Cor a aplicar na carga: ${corAplicar} (Salva: ${corSalva})`); // Para depuração

    /** * Converte uma cor hexadecimal para um objeto RGB.
     * @param {string} hex - A cor em formato hexadecimal (ex: '#FF003C' ou 'FF003C').
     * @returns {{r: number, g: number, b: number}|null} Um objeto com componentes r, g, b, ou null se o formato hex for inválido.
     */
    function hexParaRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (!hex) return null; // Validação básica
        
        hex = hex.replace('#', ''); // Remove o '#' se presente

        // Converte formatos hex de 3 ou 6 dígitos para RGB.
        if (hex.length === 3) { 
            r = parseInt(hex[0] + hex[0], 16); 
            g = parseInt(hex[1] + hex[1], 16); 
            b = parseInt(hex[2] + hex[2], 16); 
        } else if (hex.length === 6) { 
            r = parseInt(hex.substring(0, 2), 16); 
            g = parseInt(hex.substring(2, 4), 16); 
            b = parseInt(hex.substring(4, 6), 16); 
        } else { 
            // console.warn("[COR DEBUG] main.js: Formato HEX inválido em hexParaRgb:", hex); // Para depuração
            return null; // Formato inválido
        }
        // Verifica se a conversão resultou em NaN (Not a Number), o que indica um erro.
        if (isNaN(r) || isNaN(g) || isNaN(b)) { 
            // console.warn("[COR DEBUG] main.js: Resultado NaN em hexParaRgb para:", hex); // Para depuração
            return null; 
        }
        return { r, g, b };
    }

    /** * Clareia uma cor hexadecimal por uma dada porcentagem.
     * @param {string} hex - A cor hexadecimal base.
     * @param {number} percent - A porcentagem para clarear (ex: 20 para clarear 20%).
     * @returns {string} A nova cor hexadecimal clareada, ou a original se a conversão falhar.
     */
    function clarearCorHex(hex, percent) {
        let rgb = hexParaRgb(hex);
        if (!rgb) { 
            // console.warn("[COR DEBUG] main.js: Não foi possível clarear cor, hexParaRgb falhou para:", hex); // Para depuração
            return hex; // Retorna a cor original em caso de falha
        }
        // Aumenta cada componente RGB pela porcentagem, limitado ao valor máximo de 255.
        rgb.r = Math.min(255, Math.floor(rgb.r * (1 + percent / 100)));
        rgb.g = Math.min(255, Math.floor(rgb.g * (1 + percent / 100)));
        rgb.b = Math.min(255, Math.floor(rgb.b * (1 + percent / 100)));
        
        // Converte os componentes RGB de volta para formato hexadecimal.
        const paraHex = c => c.toString(16).padStart(2, '0'); // Garante dois dígitos (ex: 'F' vira '0F')
        return `#${paraHex(rgb.r)}${paraHex(rgb.g)}${paraHex(rgb.b)}`;
    }

    // Aplica a cor de destaque principal às variáveis CSS globais.
    document.documentElement.style.setProperty('--cor-destaque-vermelho', corAplicar);
    // console.log(`[COR DEBUG] main.js: Set --cor-destaque-vermelho = ${corAplicar}`); // Para depuração
    
    // Calcula e aplica a cor de destaque para o estado :hover (clareada em 20%).
    let hoverColor = clarearCorHex(corAplicar, 20); 
    document.documentElement.style.setProperty('--cor-destaque-vermelho-hover', hoverColor);
    // console.log(`[COR DEBUG] main.js: Set --cor-destaque-vermelho-hover = ${hoverColor}`); // Para depuração
    
    // Converte a cor principal para RGB para ser usada em variáveis CSS que necessitam de opacidade (rgba).
    const rgbPrincipal = hexParaRgb(corAplicar);
    if (rgbPrincipal) {
        // Define a variável para a cor da borda neon (com 50% de opacidade).
        document.documentElement.style.setProperty('--cor-borda-neon', `rgba(${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}, 0.5)`);
        // Define uma variável com apenas os componentes RGB, para uso no CSS com a função rgba().
        document.documentElement.style.setProperty('--cor-borda-neon-rgb', `${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}`);
        // console.log(`[COR DEBUG] main.js: Set --cor-borda-neon = rgba(${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}, 0.5)`); // Para depuração
        
        // Define a variável para a sombra suave (com 30% de opacidade).
        document.documentElement.style.setProperty('--sombra-suave', `0 0 15px rgba(${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}, 0.3)`);
        // console.log(`[COR DEBUG] main.js: Set --sombra-suave = 0 0 15px rgba(${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}, 0.3)`); // Para depuração
    } else {
        // console.warn("[COR DEBUG] main.js: Não foi possível obter RGB para borda/sombra da cor:", corAplicar); // Para depuração
    }
})(); 
// --- FIM DA APLICAÇÃO DE COR PERSONALIZADA --- //