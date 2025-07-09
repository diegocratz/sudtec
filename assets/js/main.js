document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    setTimeout(function() {
        const preloader = document.querySelector('.preloader');
        preloader.classList.add('fade-out');
        
        // Habilitar scroll após o preloader desaparecer
        setTimeout(function() {
            document.body.style.overflow = 'auto';
            preloader.style.display = 'none';
        }, 500);
    }, 1500); // Tempo de exibição do preloader (1.5 segundos)
    
    // Atualizar o ano atual no rodapé
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    // Variáveis
    const header = document.querySelector('.header');
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const nav = document.querySelector('.nav');
    const faqItems = document.querySelectorAll('.faq-item');
    const contactForm = document.getElementById('contactForm');
    
    // Adicionar classe 'scrolled' ao header quando rolar a página
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Adicionar efeito de hover para o botão de WhatsApp
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton) {
        whatsappButton.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 1s infinite';
        });
        
        whatsappButton.addEventListener('mouseleave', function() {
            this.style.animation = 'bounce 2s infinite';
        });
        
        // Garantir que o botão permaneça no canto direito durante a rolagem
        function fixWhatsappPosition() {
            whatsappButton.style.right = '30px';
            whatsappButton.style.left = 'auto';
            whatsappButton.style.position = 'fixed';
            whatsappButton.style.bottom = '30px';
        }
        
        // Aplicar posicionamento imediatamente
        fixWhatsappPosition();
        
        // Aplicar posicionamento durante a rolagem
        window.addEventListener('scroll', fixWhatsappPosition);
        
        // Aplicar posicionamento quando a janela for redimensionada
        window.addEventListener('resize', fixWhatsappPosition);
    }
    
    // Menu Mobile
    if (mobileMenuIcon) {
        // Criar o ícone de fechar menu
        const closeMenu = document.createElement('div');
        closeMenu.classList.add('close-menu');
        closeMenu.innerHTML = '<i class="fas fa-times"></i>';
        nav.appendChild(closeMenu);
        
        // Abrir menu mobile
        mobileMenuIcon.addEventListener('click', function() {
            nav.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impedir rolagem quando menu estiver aberto
        });
        
        // Fechar menu mobile
        closeMenu.addEventListener('click', function() {
            nav.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar rolagem
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                document.body.style.overflow = ''; // Restaurar rolagem
            });
        });
    }
    
    // Adicionar classe 'active' ao link do menu correspondente à seção visível
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        const navLinks = document.querySelectorAll('.nav ul li a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // FAQ Accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Fechar todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').classList.remove('active');
                }
            });
            
            // Alternar o estado do item atual
            item.classList.toggle('active');
            question.classList.toggle('active');
        });
    });
    
    // Formulário de Contato
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validação básica do formulário
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Validação de email
            const emailField = contactForm.querySelector('#email');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('error');
                }
            }
            
            if (isValid) {
                // Mostrar indicador de carregamento
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitButton.disabled = true;
                
                try {
                    // Coletar dados do formulário
                    const formData = new FormData(contactForm);
                    const formValues = {};
                    
                    for (let [key, value] of formData.entries()) {
                        formValues[key] = value;
                    }
                    
                    // Enviar dados para o servidor
                    const response = await fetch('/send-email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formValues)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        // Exibir mensagem de sucesso
                        const successMessage = document.createElement('div');
                        successMessage.classList.add('success-message');
                        successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${result.message}`;
                        
                        // Substituir formulário pela mensagem de sucesso
                        const formContainer = contactForm.parentNode;
                        formContainer.innerHTML = '';
                        formContainer.appendChild(successMessage);
                        
                        // Restaurar formulário após 10 segundos
                        setTimeout(() => {
                            location.reload();
                        }, 10000);
                    } else {
                        // Exibir mensagem de erro
                        showErrorMessage(result.message || 'Erro ao enviar mensagem. Tente novamente.');
                    }
                    
                } catch (error) {
                    console.error('Erro ao enviar formulário:', error);
                    showErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
                } finally {
                    // Restaurar botão
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }
            }
        });
        
        // Função para exibir mensagens de erro
        function showErrorMessage(message) {
            // Remover mensagem de erro anterior se existir
            const existingError = contactForm.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
            
            contactForm.insertBefore(errorMessage, contactForm.firstChild);
            
            // Remover mensagem após 5 segundos
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        }
        
        // Remover classe de erro ao digitar
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                if (field.value.trim()) {
                    field.classList.remove('error');
                }
            });
        });
    }
    
    // Animação de rolagem suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animação de entrada para elementos quando ficam visíveis
    const animateOnScroll = function() {
        const elements = document.querySelectorAll(
            '.service-card, .feature, .testimonial, .about-content, .contact-content, ' +
            '.pc-category, .feature-item, .faq-item, .contact-item, .form-group, ' +
            '.footer-content > div, .section-header h2, .section-header p'
        );
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
        
        // Animação para elementos que já estão visíveis no carregamento inicial
        const heroElements = document.querySelectorAll('.hero-content h2, .hero-content p, .hero-buttons, .hero-image img');
        heroElements.forEach(element => {
            element.style.opacity = '1';
        });
    };
    
    // Adicionar classe CSS para animação
    const style = document.createElement('style');
    style.innerHTML = `
        .service-card, .feature, .testimonial, .about-content, .contact-content {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .service-card.animate, .feature.animate, .testimonial.animate, .about-content.animate, .contact-content.animate {
            opacity: 1;
            transform: translateY(0);
        }
        .success-message {
            background-color: var(--success-color);
            color: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            margin-top: 20px;
        }
        .error-message {
            background-color: #dc3545;
            color: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            margin-bottom: 20px;
            animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .error {
            border-color: #dc3545 !important;
        }
        button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
    
    // Executar animação ao carregar a página e ao rolar
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Inicializar animação de contador para estatísticas
    const initCounters = function() {
        const stats = document.querySelectorAll('.stat-number');
        const statsSection = document.querySelector('.about-stats');
        
        if (!statsSection) return;
        
        let counted = false;
        
        window.addEventListener('scroll', function() {
            if (counted) return;
            
            const statsSectionPosition = statsSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (statsSectionPosition < windowHeight - 100) {
                stats.forEach(stat => {
                    const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                    let count = 0;
                    const duration = 2000; // 2 segundos
                    const increment = Math.ceil(target / (duration / 20)); // Incremento a cada 20ms
                    
                    const counter = setInterval(() => {
                        count += increment;
                        if (count >= target) {
                            stat.textContent = stat.textContent.includes('+') ? target + '+' : target;
                            clearInterval(counter);
                        } else {
                            stat.textContent = stat.textContent.includes('+') ? count + '+' : count;
                        }
                    }, 20);
                });
                
                counted = true;
            }
        });
    };
    
    initCounters();
    
    // Inicializar carrossel de depoimentos
    const initTestimonialsSlider = function() {
        const slider = document.querySelector('.testimonials-slider');
        const testimonials = document.querySelectorAll('.testimonial');
        
        if (!slider || testimonials.length <= 1) return;
        
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // Eventos de mouse para arrastar o slider
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Velocidade de rolagem
            slider.scrollLeft = scrollLeft - walk;
        });
        
        // Adicionar navegação por botões
        const sliderNav = document.createElement('div');
        sliderNav.classList.add('slider-nav');
        
        const prevBtn = document.createElement('button');
        prevBtn.classList.add('slider-nav-btn', 'prev-btn');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const nextBtn = document.createElement('button');
        nextBtn.classList.add('slider-nav-btn', 'next-btn');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        sliderNav.appendChild(prevBtn);
        sliderNav.appendChild(nextBtn);
        
        slider.parentNode.appendChild(sliderNav);
        
        // Estilo para os botões de navegação
        const navStyle = document.createElement('style');
        navStyle.innerHTML = `
            .slider-nav {
                display: flex;
                justify-content: center;
                margin-top: 30px;
                gap: 15px;
            }
            .slider-nav-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: var(--white);
                border: 1px solid var(--border-color);
                color: var(--primary-color);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--transition);
            }
            .slider-nav-btn:hover {
                background-color: var(--primary-color);
                color: var(--white);
            }
            .testimonials-slider.active {
                cursor: grabbing;
            }
        `;
        document.head.appendChild(navStyle);
        
        // Funcionalidade dos botões
        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -350, behavior: 'smooth' });
        });
        
        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: 350, behavior: 'smooth' });
        });
        
        // Auto-scroll para dispositivos móveis
        let autoScrollInterval;
        
        const startAutoScroll = () => {
            if (window.innerWidth < 768) {
                autoScrollInterval = setInterval(() => {
                    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
                        // Voltar ao início quando chegar ao final
                        slider.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        slider.scrollBy({ left: 350, behavior: 'smooth' });
                    }
                }, 5000);
            }
        };
        
        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };
        
        // Iniciar auto-scroll em dispositivos móveis
        startAutoScroll();
        
        // Parar auto-scroll quando o usuário interagir com o slider
        slider.addEventListener('mousedown', stopAutoScroll);
        slider.addEventListener('touchstart', stopAutoScroll);
        
        // Reiniciar auto-scroll quando a janela for redimensionada
        window.addEventListener('resize', () => {
            stopAutoScroll();
            startAutoScroll();
        });
    };
    
    initTestimonialsSlider();
    
    // Inicializar carrossel de slides
    const initHeroCarousel = function() {
        const slides = document.querySelectorAll('.slide');
        const indicators = document.querySelectorAll('.indicator');
        let currentSlide = 0;
        let slideInterval;
        
        if (slides.length === 0) return;
        
        // Função para mostrar slide específico
        function showSlide(index) {
            // Remover classe active de todos os slides e indicadores
            slides.forEach(slide => slide.classList.remove('active', 'prev'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Adicionar classe active ao slide e indicador atual
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            
            currentSlide = index;
        }
        
        // Função para próximo slide
        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }
        
        // Função para slide anterior
        function prevSlide() {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        }
        
        // Função para iniciar auto-play
        function startAutoPlay() {
            slideInterval = setInterval(nextSlide, 5000); // Troca a cada 5 segundos
        }
        
        // Função para parar auto-play
        function stopAutoPlay() {
            clearInterval(slideInterval);
        }
        
        // Event listeners para controles de navegação
        window.changeSlide = function(direction) {
            stopAutoPlay();
            if (direction === 1) {
                nextSlide();
            } else {
                prevSlide();
            }
            // Reiniciar auto-play após 3 segundos
            setTimeout(startAutoPlay, 3000);
        };
        
        // Event listener para indicadores
        window.currentSlide = function(index) {
            stopAutoPlay();
            showSlide(index - 1); // index começa em 1, mas array começa em 0
            // Reiniciar auto-play após 3 segundos
            setTimeout(startAutoPlay, 3000);
        };
        
        // Pausar auto-play quando mouse estiver sobre o carrossel
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoPlay);
            carousel.addEventListener('mouseleave', startAutoPlay);
        }
        
        // Controle por teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
        });
        
        // Suporte para touch/swipe em dispositivos móveis
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        });
        
        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            // Reiniciar auto-play após 3 segundos
            setTimeout(startAutoPlay, 3000);
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - próximo slide
                    nextSlide();
                } else {
                    // Swipe right - slide anterior
                    prevSlide();
                }
            }
        }
        
        // Inicializar carrossel
        showSlide(0);
        startAutoPlay();
        
        // Pausar auto-play quando a aba não estiver visível
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        });
    };
    
    initHeroCarousel();
});