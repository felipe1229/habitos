// --------------------------------- //
// --- LÓGICA DO MENU HAMBÚRGUER --- //
// --------------------------------- //
const menuToggle = document.querySelector('.menu-toggle'); // Seleciona o ícone do menu
const navLinks = document.querySelector('.nav-links');     // Seleciona a lista de links

if (menuToggle && navLinks) { // Verifica se ambos os elementos existem
    menuToggle.addEventListener('click', () => { // Adiciona evento de clique ao ícone
        navLinks.classList.toggle('active');    // Alterna a classe 'active' nos links (mostra/esconde)
        menuToggle.classList.toggle('open');    // Alterna a classe 'open' no ícone (animação para "X")
    });
}
// --- FIM DA LÓGICA DO MENU HAMBÚRGUER --- //


// ------------------------------------------------------------------- //
// --- APLICAR COR DE DESTAQUE PERSONALIZADA AO CARREGAR A PÁGINA --- //
// ------------------------------------------------------------------- //
(function aplicarTemaSalvo() { // Função auto-executável para aplicar o tema
    // console.log("[COR DEBUG] main.js: Tentando aplicar tema salvo..."); // Log para debug
    const localStorageKeyCorDestaque = 'corDestaquePersonalizada'; // Chave do localStorage
    const defaultAccentColor = '#ff003c'; // Cor de destaque padrão
    
    // Pega a cor salva no localStorage ou usa a padrão se não houver
    const corSalva = localStorage.getItem(localStorageKeyCorDestaque);
    const corAplicar = corSalva || defaultAccentColor; 


    /** Converte uma cor hexadecimal para um objeto RGB.
     * @param {string} hex - A cor em formato hexadecimal (ex: '#FF003C').
     * @returns {{r: number, g: number, b: number}|null} Objeto RGB ou null se inválido.
     */
    function hexParaRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (!hex) return null; // Retorna nulo se o hex for inválido
        hex = hex.replace('#', ''); // Remove o '#' se presente

        // Converte formatos de 3 ou 6 dígitos
        if (hex.length === 3) { 
            r = parseInt(hex[0] + hex[0], 16); 
            g = parseInt(hex[1] + hex[1], 16); 
            b = parseInt(hex[2] + hex[2], 16); 
        } else if (hex.length === 6) { 
            r = parseInt(hex.substring(0, 2), 16); 
            g = parseInt(hex.substring(2, 4), 16); 
            b = parseInt(hex.substring(4, 6), 16); 
        } else {  
            return null; 
        }
        // Verifica se a conversão resultou em NaN (Not a Number)
        if (isNaN(r) || isNaN(g) || isNaN(b)) {  
            return null;
        }
        return { r, g, b };
    }

    /** Clareia uma cor hexadecimal por uma dada porcentagem.
     * @param {string} hex - A cor hexadecimal base.
     * @param {number} percent - A porcentagem para clarear (ex: 20 para 20%).
     * @returns {string} A nova cor hexadecimal clareada.
     */
    function clarearCorHex(hex, percent) {
        let rgb = hexParaRgb(hex);
        if (!rgb) { 
            // console.warn("[COR DEBUG] main.js: Não foi possível clarear cor, hexParaRgb falhou para:", hex); 
            return hex; // Retorna a cor original se a conversão falhar
        }
        // Aumenta cada componente RGB pela porcentagem, limitado a 255
        rgb.r = Math.min(255, Math.floor(rgb.r * (1 + percent / 100)));
        rgb.g = Math.min(255, Math.floor(rgb.g * (1 + percent / 100)));
        rgb.b = Math.min(255, Math.floor(rgb.b * (1 + percent / 100)));
        
        // Converte de volta para hexadecimal
        const paraHex = c => c.toString(16).padStart(2, '0');
        return `#${paraHex(rgb.r)}${paraHex(rgb.g)}${paraHex(rgb.b)}`;
    }

    // Aplica a cor de destaque principal às variáveis CSS correspondentes
    document.documentElement.style.setProperty('--cor-destaque-vermelho', corAplicar);
    
    let hoverColor = clarearCorHex(corAplicar, 20); // Clareia em 20% para o hover
    document.documentElement.style.setProperty('--cor-destaque-vermelho-hover', hoverColor);
    
    // Converte a cor principal para RGB para usar em variáveis com opacidade (rgba)
    const rgbPrincipal = hexParaRgb(corAplicar);
    if (rgbPrincipal) {
        // Aplica a cor para bordas neon (com opacidade)
        document.documentElement.style.setProperty('--cor-borda-neon', `rgba(${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}, 0.5)`);
        document.documentElement.style.setProperty('--cor-borda-neon-rgb', `${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}`); // Para uso em CSS
        
        // Aplica a cor para sombras suaves (com opacidade)
        document.documentElement.style.setProperty('--sombra-suave', `0 0 15px rgba(${rgbPrincipal.r}, ${rgbPrincipal.g}, ${rgbPrincipal.b}, 0.3)`);
        
    } else {
    }
})(); 
