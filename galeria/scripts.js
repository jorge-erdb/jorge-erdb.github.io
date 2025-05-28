// ==============================================
// SISTEMA DE TRANSFORMACIÓN DE ESTILOS
// ==============================================

// Configuración de estilos disponibles
const availableStyles = {
    'default': {
        name: 'Estilo Principal',
        description: 'Diseño base con paleta iridiscente y efectos glassmorphism',
        cssFile: null, // Usa los estilos base
        color: 'var(--gradient-holographic)',
        icon: 'fas fa-palette'
    },
    'corporate': {
        name: 'Corporate',
        description: 'Estilo empresarial profesional',
        cssFile: 'styles/corporate.css',
        color: '#1e3a8a',
        icon: 'fas fa-building',
        disabled: false // ¡Nuevo estilo disponible!
    },
    'minimal': {
        name: 'Minimal',
        description: 'Diseño limpio y minimalista en blanco y negro',
        cssFile: 'styles/minimal.css',
        color: '#000000',
        icon: 'fas fa-minus',
        disabled: false // Cambiar a false cuando esté listo
    },
    'brutalist': {
        name: 'Brutalist',
        description: 'Diseño bold y arquitectónico con tipografías pesadas',
        cssFile: 'styles/brutalist.css',
        color: '#ff4444',
        icon: 'fas fa-cube',
        disabled: false
    },
    'glassmorphism': {
        name: 'Glass',
        description: 'Efectos de vidrio esmerilado y transparencias',
        cssFile: 'styles/glassmorphism.css',
        color: 'rgba(255,255,255,0.2)',
        icon: 'fas fa-gem',
        disabled: true
    },
    'retro': {
        name: 'Retro',
        description: 'Inspiración vintage de los años 80 y 90',
        cssFile: 'styles/retro.css',
        color: '#ff6b35',
        icon: 'fas fa-tv',
        disabled: false
    }
};

let currentStyle = 'default';

// Inicializar sistema de estilos
function initStyleSystem() {
    setupStyleButtons();
    updateFooterStylesList();
    setupRandomStyleButton();

    console.log('🎨 Style transformation system initialized!');
}

// Configurar botones de estilo en navegación
function setupStyleButtons() {
    const styleButtons = document.querySelectorAll('.nav-link[data-style]');

    styleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const style = button.dataset.style;

            if (style && availableStyles[style]) {
                e.preventDefault();

                if (!button.classList.contains('disabled')) {
                    changeStyle(style);
                }
            }
        });
    });
}

// Cambiar estilo principal
function changeStyle(newStyle) {
    if (availableStyles[newStyle]?.disabled) {
        showNotification('Este estilo estará disponible próximamente', 'info');
        return;
    }

    if (newStyle === currentStyle) return;

    // Efecto de transición
    document.body.classList.add('style-changing');

    setTimeout(() => {
        // Actualizar estilo actual
        currentStyle = newStyle;
        const style = availableStyles[newStyle];

        // Actualizar indicadores
        updateStyleIndicators(style);

        // Cargar CSS específico del estilo
        loadStyleCSS(style.cssFile);

        // Actualizar elementos activos
        updateActiveStyleElements(newStyle);

        // Completar transición
        setTimeout(() => {
            document.body.classList.remove('style-changing');
            showNotification(`Estilo cambiado a: ${style.name}`, 'success');
        }, 300);

    }, 200);
}

// Actualizar indicadores de estilo
function updateStyleIndicators(style) {
    const styleName = document.getElementById('current-style-name');
    const styleDescription = document.getElementById('current-style-description');

    if (styleName) styleName.textContent = style.name;
    if (styleDescription) styleDescription.textContent = style.description;
}

// Cargar CSS específico del estilo
function loadStyleCSS(cssFile) {
    // Remover CSS anterior si existe
    const existingStyleLink = document.getElementById('dynamic-style-link');
    if (existingStyleLink) {
        existingStyleLink.remove();
    }

    // Cargar nuevo CSS si se especifica
    if (cssFile) {
        const link = document.createElement('link');
        link.id = 'dynamic-style-link';
        link.rel = 'stylesheet';
        link.href = cssFile;
        document.head.appendChild(link);
    }
}

// Actualizar elementos activos
function updateActiveStyleElements(styleKey) {
    // Actualizar navegación
    const navLinks = document.querySelectorAll('.nav-link[data-style]');
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.style === styleKey);
    });
}

// Configurar botón de estilo aleatorio
function setupRandomStyleButton() {
    const randomBtn = document.getElementById('random-style-btn');
    if (!randomBtn) return;

    randomBtn.addEventListener('click', () => {
        const availableKeys = Object.keys(availableStyles).filter(
            key => !availableStyles[key].disabled && key !== currentStyle
        );

        if (availableKeys.length > 0) {
            const randomStyle = availableKeys[Math.floor(Math.random() * availableKeys.length)];
            changeStyle(randomStyle);
        }
    });
}

// Actualizar lista de estilos en footer
function updateFooterStylesList() {
    const footerList = document.getElementById('footer-styles-list');
    if (!footerList) return;

    footerList.innerHTML = '';

    Object.entries(availableStyles).forEach(([styleKey, style]) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" onclick="changeStyle('${styleKey}')" 
               ${style.disabled ? 'class="disabled"' : ''}>
                <i class="${style.icon}"></i> ${style.name}
                ${style.disabled ? ' (Próximamente)' : ''}
            </a>
        `;
        footerList.appendChild(li);
    });
}

// ==============================================
// PORTFOLIO SPECIFIC JAVASCRIPT
// ==============================================

// DOM Elements específicos del portafolio
const portfolioGrid = document.querySelector('.portfolio-grid');
const filterButtons = document.querySelectorAll('.filter-button');
const portfolioCards = document.querySelectorAll('.portfolio-card');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxTitle = document.querySelector('.lightbox-info h3');
const lightboxDescription = document.querySelector('.lightbox-info p');
const lightboxClose = document.querySelector('.lightbox-close');

// ==============================================
// SISTEMA DE FILTROS
// ==============================================

// Configuración de categorías y proyectos
const portfolioData = {
    'web-design': [
        {
            id: 'corporate-site',
            title: 'Sitio Corporativo Moderno',
            description: 'Diseño web profesional para empresa de consultoría con enfoque en UX/UI y conversiones.',
            category: 'web-design',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'SCSS'],
            image: 'placeholder', // Cambiar por URL real cuando tengas las imágenes
            demoUrl: '#',
            codeUrl: '#'
        },
        {
            id: 'ecommerce-platform',
            title: 'Plataforma E-commerce',
            description: 'Tienda en línea completa con carrito de compras, pagos integrados y panel administrativo.',
            category: 'web-design',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            image: 'placeholder',
            demoUrl: '#',
            codeUrl: '#'
        }
    ],
    'landing-pages': [
        {
            id: 'saas-landing',
            title: 'Landing Page SaaS',
            description: 'Página de aterrizaje optimizada para conversión de software como servicio.',
            category: 'landing-pages',
            technologies: ['Vue.js', 'Tailwind', 'AOS'],
            image: 'placeholder',
            demoUrl: '#',
            codeUrl: '#'
        },
        {
            id: 'restaurant-landing',
            title: 'Landing Restaurante',
            description: 'Sitio web para restaurante local con reservaciones online y menú interactivo.',
            category: 'landing-pages',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP'],
            image: 'placeholder',
            demoUrl: '#',
            codeUrl: '#'
        }
    ],
    'web-apps': [
        {
            id: 'task-manager',
            title: 'Gestor de Tareas',
            description: 'Aplicación web para gestión de proyectos y tareas con colaboración en tiempo real.',
            category: 'web-apps',
            technologies: ['React', 'Firebase', 'Material-UI'],
            image: 'placeholder',
            demoUrl: '#',
            codeUrl: '#'
        },
        {
            id: 'dashboard-analytics',
            title: 'Dashboard Analítico',
            description: 'Panel de control con métricas en tiempo real y visualizaciones interactivas.',
            category: 'web-apps',
            technologies: ['Vue.js', 'D3.js', 'Express', 'PostgreSQL'],
            image: 'placeholder',
            demoUrl: '#',
            codeUrl: '#'
        }
    ],
    'pyme-solutions': [
        {
            id: 'inventory-system',
            title: 'Sistema de Inventario',
            description: 'Solución completa para gestión de inventario y ventas para pequeñas empresas.',
            category: 'pyme-solutions',
            technologies: ['PHP', 'MySQL', 'Bootstrap', 'jQuery'],
            image: 'placeholder',
            demoUrl: '#',
            codeUrl: '#'
        },
        {
            id: 'crm-simple',
            title: 'CRM Simplificado',
            description: 'Sistema de relación con clientes diseñado específicamente para PyMEs mexicanas.',
            category: 'pyme-solutions',
            technologies: ['Laravel', 'MySQL', 'Vue.js'],
            image: 'placeholder',
            demoUrl: '#',
            codeUrl: '#'
        }
    ]
};

// Función para inicializar el portafolio
function initPortfolio() {
    renderPortfolioGrid('all');
    setupFilterButtons();
    setupLightbox();
    setupAnimations();
    updatePortfolioStats();

    console.log('🎨 Portfolio initialized successfully!');
}

// ==============================================
// RENDERIZADO DE PROYECTOS
// ==============================================

function renderPortfolioGrid(category = 'all') {
    if (!portfolioGrid) return;

    // Limpiar grid actual
    portfolioGrid.innerHTML = '';

    // Mostrar loading
    portfolioGrid.innerHTML = '<div class="portfolio-loading"><div class="loading-spinner"></div>Cargando proyectos...</div>';

    setTimeout(() => {
        portfolioGrid.innerHTML = '';

        // Obtener proyectos según categoría
        let projectsToShow = [];

        if (category === 'all') {
            // Combinar todos los proyectos
            Object.values(portfolioData).forEach(categoryProjects => {
                projectsToShow = [...projectsToShow, ...categoryProjects];
            });
        } else {
            projectsToShow = portfolioData[category] || [];
        }

        // Renderizar cada proyecto
        projectsToShow.forEach((project, index) => {
            const projectCard = createProjectCard(project, index);
            portfolioGrid.appendChild(projectCard);
        });

        // Activar animaciones
        setTimeout(() => {
            const cards = portfolioGrid.querySelectorAll('.portfolio-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });
        }, 100);

    }, 500); // Simular tiempo de carga
}

function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'portfolio-card portfolio-card-shine';
    card.dataset.category = project.category;
    card.dataset.project = project.id;

    // Crear tecnologías HTML
    const techTags = project.technologies.map(tech =>
        `<span class="tech-tag">${tech}</span>`
    ).join('');

    card.innerHTML = `
        <div class="portfolio-card-image">
            ${project.image === 'placeholder' ?
            `<div class="portfolio-card-placeholder">
                    <i class="fas fa-${getIconForCategory(project.category)}"></i>
                </div>` :
            `<img src="${project.image}" alt="${project.title}">`
        }
            <div class="portfolio-card-overlay">
                <button class="btn btn-outline btn-small" onclick="openLightbox('${project.id}')">
                    <i class="fas fa-eye"></i> Ver
                </button>
                <a href="${project.demoUrl}" class="btn btn-primary btn-small" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Demo
                </a>
            </div>
        </div>
        <div class="portfolio-card-content">
            <span class="portfolio-card-category">${getCategoryName(project.category)}</span>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="portfolio-card-tech">
                ${techTags}
            </div>
            <div class="portfolio-card-links">
                <a href="${project.demoUrl}" class="btn btn-outline" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Ver Demo
                </a>
                <a href="${project.codeUrl}" class="btn btn-secondary" target="_blank">
                    <i class="fab fa-github"></i> Código
                </a>
            </div>
        </div>
    `;

    return card;
}

// ==============================================
// SISTEMA DE FILTROS
// ==============================================

function setupFilterButtons() {
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Agregar clase active al botón clickeado
            button.classList.add('active');

            // Obtener categoría
            const category = button.dataset.filter;

            // Filtrar proyectos
            filterProjects(category);

            // Actualizar estadísticas
            updatePortfolioStats(category);
        });
    });
}

function filterProjects(category) {
    // Efecto de transición
    const cards = document.querySelectorAll('.portfolio-card');

    cards.forEach(card => {
        card.classList.add('filtering');
    });

    setTimeout(() => {
        renderPortfolioGrid(category);
    }, 300);
}

// ==============================================
// LIGHTBOX PARA IMÁGENES
// ==============================================

function setupLightbox() {
    if (!lightbox) return;

    // Cerrar lightbox al hacer clic en el botón de cerrar
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Cerrar lightbox al hacer clic fuera del contenido
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Cerrar lightbox con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

function openLightbox(projectId) {
    if (!lightbox) return;

    // Encontrar proyecto
    let project = null;
    Object.values(portfolioData).forEach(categoryProjects => {
        const found = categoryProjects.find(p => p.id === projectId);
        if (found) project = found;
    });

    if (!project) return;

    // Actualizar contenido del lightbox
    if (lightboxImage) {
        if (project.image === 'placeholder') {
            lightboxImage.style.display = 'none';
        } else {
            lightboxImage.src = project.image;
            lightboxImage.alt = project.title;
            lightboxImage.style.display = 'block';
        }
    }

    if (lightboxTitle) {
        lightboxTitle.textContent = project.title;
    }

    if (lightboxDescription) {
        lightboxDescription.textContent = project.description;
    }

    // Mostrar lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ==============================================
// ESTADÍSTICAS DEL PORTAFOLIO
// ==============================================

function updatePortfolioStats(category = 'all') {
    const statsElements = {
        projects: document.querySelector('.stat-projects .stat-number'),
        technologies: document.querySelector('.stat-technologies .stat-number'),
        clients: document.querySelector('.stat-clients .stat-number'),
        experience: document.querySelector('.stat-experience .stat-number')
    };

    let projectCount = 0;
    let techSet = new Set();

    if (category === 'all') {
        Object.values(portfolioData).forEach(categoryProjects => {
            projectCount += categoryProjects.length;
            categoryProjects.forEach(project => {
                project.technologies.forEach(tech => techSet.add(tech));
            });
        });
    } else {
        const categoryProjects = portfolioData[category] || [];
        projectCount = categoryProjects.length;
        categoryProjects.forEach(project => {
            project.technologies.forEach(tech => techSet.add(tech));
        });
    }

    // Animar números
    if (statsElements.projects) {
        animateNumber(statsElements.projects, projectCount);
    }
    if (statsElements.technologies) {
        animateNumber(statsElements.technologies, techSet.size);
    }
    if (statsElements.clients) {
        animateNumber(statsElements.clients, 15); // Número fijo de clientes
    }
    if (statsElements.experience) {
        animateNumber(statsElements.experience, 3); // Años de experiencia
    }
}

function animateNumber(element, targetNumber) {
    const startNumber = 0;
    const duration = 1000;
    const steps = 60;
    const increment = (targetNumber - startNumber) / steps;

    let currentNumber = startNumber;
    let stepCount = 0;

    const timer = setInterval(() => {
        currentNumber += increment;
        stepCount++;

        if (stepCount >= steps) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }

        element.textContent = Math.floor(currentNumber);
    }, duration / steps);
}

// ==============================================
// ANIMACIONES Y EFECTOS
// ==============================================

function setupAnimations() {
    // Intersection Observer para animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observar elementos del portafolio
    const elementsToAnimate = document.querySelectorAll(
        '.portfolio-card, .filter-button, .stat-item, .portfolio-hero-content'
    );

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Efecto parallax suave para el hero
function setupParallaxEffect() {
    const heroSection = document.querySelector('.portfolio-hero');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = scrolled * 0.5;

        if (heroSection) {
            heroSection.style.transform = `translateY(${parallaxSpeed}px)`;
        }
    });
}

// ==============================================
// FUNCIONES UTILITARIAS
// ==============================================

function getIconForCategory(category) {
    const icons = {
        'web-design': 'palette',
        'landing-pages': 'rocket',
        'web-apps': 'cogs',
        'pyme-solutions': 'building'
    };
    return icons[category] || 'code';
}

function getCategoryName(category) {
    const names = {
        'web-design': 'Diseño Web',
        'landing-pages': 'Landing Pages',
        'web-apps': 'Aplicaciones Web',
        'pyme-solutions': 'Soluciones PyME'
    };
    return names[category] || 'Proyecto';
}

// ==============================================
// BÚSQUEDA Y FILTRADO AVANZADO
// ==============================================

function setupSearchFunctionality() {
    const searchInput = document.querySelector('.portfolio-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounceSearch);
}

const debounceSearch = debounce((e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.portfolio-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const technologies = Array.from(card.querySelectorAll('.tech-tag'))
            .map(tag => tag.textContent.toLowerCase());

        const matchesSearch = title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            technologies.some(tech => tech.includes(searchTerm));

        if (matchesSearch) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}, 300);

// ==============================================
// NAVEGACIÓN ENTRE PROYECTOS
// ==============================================

function setupProjectNavigation() {
    const navButtons = document.querySelectorAll('.nav-project');

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = button.dataset.project;
            navigateToProject(projectId);
        });
    });
}

function navigateToProject(projectId) {
    const projectCard = document.querySelector(`[data-project="${projectId}"]`);
    if (projectCard) {
        projectCard.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Efecto de highlight
        projectCard.style.boxShadow = '0 0 30px rgba(37, 137, 189, 0.6)';
        setTimeout(() => {
            projectCard.style.boxShadow = '';
        }, 2000);
    }
}

// ==============================================
// LAZY LOADING DE IMÁGENES
// ==============================================

function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ==============================================
// COMPARTIR PROYECTOS
// ==============================================

function shareProject(projectId) {
    const project = findProjectById(projectId);
    if (!project) return;

    const shareData = {
        title: `${project.title} - Jorge Erdmann Portfolio`,
        text: project.description,
        url: `${window.location.origin}/portfolio#${projectId}`
    };

    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(shareData.url).then(() => {
            showNotification('Enlace copiado al portapapeles', 'success');
        });
    }
}

function findProjectById(projectId) {
    let foundProject = null;
    Object.values(portfolioData).forEach(categoryProjects => {
        const project = categoryProjects.find(p => p.id === projectId);
        if (project) foundProject = project;
    });
    return foundProject;
}

// ==============================================
// MODO PRESENTACIÓN
// ==============================================

function togglePresentationMode() {
    document.body.classList.toggle('presentation-mode');

    if (document.body.classList.contains('presentation-mode')) {
        showNotification('Modo presentación activado', 'success');
        // Ocultar elementos no esenciales
        const elementsToHide = document.querySelectorAll('.nav-menu, .footer');
        elementsToHide.forEach(el => el.style.display = 'none');
    } else {
        showNotification('Modo presentación desactivado', 'success');
        // Mostrar elementos
        const elementsToShow = document.querySelectorAll('.nav-menu, .footer');
        elementsToShow.forEach(el => el.style.display = '');
    }
}

// ==============================================
// EXPORTAR PORTAFOLIO
// ==============================================

function exportPortfolioData() {
    const portfolioInfo = {
        projects: portfolioData,
        stats: {
            totalProjects: Object.values(portfolioData).flat().length,
            categories: Object.keys(portfolioData).length,
            technologies: [...new Set(Object.values(portfolioData).flat()
                .map(p => p.technologies).flat())].length
        },
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(portfolioInfo, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'jorge-erdmann-portfolio.json';
    link.click();

    showNotification('Portafolio exportado exitosamente', 'success');
}

// ==============================================
// EVENTOS DE TECLADO ESPECÍFICOS
// ==============================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K = Buscar
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.portfolio-search');
            if (searchInput) searchInput.focus();
        }

        // P = Modo presentación
        if (e.key === 'p' && !e.ctrlKey && !e.metaKey) {
            togglePresentationMode();
        }

        // E = Exportar
        if (e.key === 'e' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            exportPortfolioData();
        }
    });
}

// ==============================================
// INICIALIZACIÓN
// ==============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initStyleSystem();

    initPortfolio();

    initMobileNavigation();

    setupSearchFunctionality();
    setupProjectNavigation();
    setupLazyLoading();
    setupKeyboardShortcuts();

    setupParallaxEffectBackground();

    // Manejar cambio de hash en URL
    window.addEventListener('hashchange', () => {
        const projectId = window.location.hash.substring(1);
        if (projectId) {
            navigateToProject(projectId);
        }
    });

    // Navegar a proyecto si hay hash en URL
    if (window.location.hash) {
        const projectId = window.location.hash.substring(1);
        setTimeout(() => navigateToProject(projectId), 1000);
    }
});

// Optimización de rendimiento
window.addEventListener('beforeunload', () => {
    // Limpiar observers y timers
    if (typeof observer !== 'undefined') {
        observer.disconnect();
    }
});

function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    function toggleMobileMenu() {
        if (navMenu && navToggle) {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    // Close mobile menu
    function closeMobileMenu() {
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Set up event listeners
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Only close if it's not a disabled link and we're on mobile
            if (!link.classList.contains('disabled') && window.innerWidth <= 768) {
                setTimeout(closeMobileMenu, 100);
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            // If click is outside the nav container
            if (!e.target.closest('.nav-container')) {
                closeMobileMenu();
            }
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    console.log('📱 Mobile navigation initialized');
}

function isMobileMenuOpen() {
    const navMenu = document.getElementById('nav-menu');
    return navMenu ? navMenu.classList.contains('active') : false;
}

// Function to force close mobile menu (useful for programmatic closing)
function forceMobileMenuClose() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');

    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Export functions for global access
window.mobileNavUtils = {
    isOpen: isMobileMenuOpen,
    forceClose: forceMobileMenuClose
};

// ==============================================
// FUNCIONES GLOBALES ACCESIBLES
// ==============================================

// Exponer funciones para uso en HTML
window.portfolioFunctions = {
    openLightbox,
    closeLightbox,
    shareProject,
    togglePresentationMode,
    exportPortfolioData,
    filterProjects,
    changeStyle // Agregar función de cambio de estilo
};

console.log('🎨 Portfolio JavaScript loaded successfully!');
console.log('📱 Keyboard shortcuts: Ctrl+K (search), P (presentation), Ctrl+E (export)');
console.log('🎨 Style system ready! Available styles:', Object.keys(availableStyles));