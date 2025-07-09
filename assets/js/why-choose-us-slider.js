document.addEventListener('DOMContentLoaded', function() {
    // Elementos do slider
    const features = document.querySelector('.why-choose-us .features');
    const featureItems = document.querySelectorAll('.why-choose-us .feature');
    const indicators = document.querySelectorAll('.why-choose-us .indicator');
    const prevButton = document.querySelector('.why-choose-us .prev');
    const nextButton = document.querySelector('.why-choose-us .next');
    
    // Verificar se os elementos existem
    if (features && featureItems.length > 0 && indicators.length > 0) {
        
        let currentIndex = 0;
        const totalItems = featureItems.length;
        
        // Função para atualizar o slide
        function updateSlide() {
            // Calcular a posição de scroll
            const featureWidth = featureItems[0].offsetWidth;
            const scrollPosition = currentIndex * featureWidth;
            
            // Scroll suave para a posição
            features.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            // Atualizar indicadores
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        // Event listeners para os botões de navegação
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlide();
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', function() {
                if (currentIndex < totalItems - 1) {
                    currentIndex++;
                    updateSlide();
                }
            });
        }
        
        // Event listeners para os indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                currentIndex = index;
                updateSlide();
            });
        });
        
        // Detectar scroll manual e atualizar indicadores
        features.addEventListener('scroll', function() {
            const featureWidth = featureItems[0].offsetWidth;
            const scrollPosition = features.scrollLeft;
            
            // Determinar qual slide está mais visível
            const newIndex = Math.round(scrollPosition / featureWidth);
            
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalItems) {
                currentIndex = newIndex;
                
                // Atualizar apenas os indicadores (sem fazer scroll adicional)
                indicators.forEach((indicator, index) => {
                    if (index === currentIndex) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
            }
        });
        
        // Inicializar o slide
        updateSlide();
        
        // Ajustar quando a janela for redimensionada
        window.addEventListener('resize', function() {
            updateSlide();
        });
    } else {
        // Se não for mobile, esconder os controles de navegação
        const slideNav = document.querySelector('.why-choose-us .slide-nav');
        const slideIndicators = document.querySelector('.why-choose-us .slide-indicators');
        
        if (slideNav) {
            slideNav.style.display = 'none';
        }
        
        if (slideIndicators) {
            slideIndicators.style.display = 'none';
        }
    }
});