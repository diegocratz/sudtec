/**
 * Script para ajustar dinamicamente o padding-top do body com base na altura do header
 * Isso garante que não haja espaço excessivo entre o topo e o hero em diferentes tamanhos de tela
 */
document.addEventListener("DOMContentLoaded", function () { 
    const header = document.querySelector(".header"); 
    if (header) { 
        // Função para ajustar o padding-top do body
        function adjustBodyPadding() {
            const headerHeight = header.offsetHeight; 
            document.body.style.paddingTop = `${headerHeight}px`;
        }
        
        // Ajustar o padding inicialmente
        adjustBodyPadding();
        
        // Ajustar o padding quando a janela for redimensionada
        window.addEventListener('resize', adjustBodyPadding);
        
        // Ajustar após o carregamento completo da página (para garantir que todas as imagens e recursos estejam carregados)
        window.addEventListener('load', adjustBodyPadding);
    } 
});