// Navegación móvil
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
        
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('active');
            
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
            
        // Burger Animation
        burger.classList.toggle('toggle');
    });
};
    
// Cambiar header al hacer scroll
const scrollHeader = () => {
    const header = document.querySelector('header');
    const scrollTop = document.querySelector('.scroll-top');
        
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
                header.classList.add('scrolled');
                scrollTop.classList.add('active');
        } else {
                header.classList.remove('scrolled');
                scrollTop.classList.remove('active');
        }
    });
};
    
// Scroll suave para enlaces internos
const smoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
        
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
                
            const href = this.getAttribute('href');
                
            if (href === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
                
            const offsetTop = document.querySelector(href).offsetTop - 80;
                
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
                
            // Cerrar menú móvil si está abierto
            const nav = document.querySelector('.nav-links');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                document.querySelector('.burger').classList.remove('toggle');
            }
        });
    });
};
    
// Animación de aparición al hacer scroll
const scrollAppear = () => {
    const fadeElements = document.querySelectorAll('.fade-in');
        
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px"
    };
        
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);
        
    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });
};
    
// Animación de barras de habilidades
const animateSkills = () => {
    const skills = document.querySelectorAll('.skill-progress');
    const skillSection = document.querySelector('.about-skills');
        
    const skillOptions = {
        threshold: 0.5
    };
        
    const skillObserver = new IntersectionObserver(function(entries, skillObserver) {
        if (entries[0].isIntersecting) {
            skills.forEach(skill => {
                const width = skill.getAttribute('data-width');
                skill.style.width = width;
            });
            skillObserver.unobserve(skillSection);
        }
    }, skillOptions);
        
    if (skillSection) {
        skillObserver.observe(skillSection);
    }
};
    
// Botón scroll arriba
const scrollToTop = () => {
    const scrollBtn = document.querySelector('.scroll-top');
        
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};
    
// Toggle modo oscuro
const toggleDarkMode = () => {
    const themeToggle = document.getElementById('theme-toggle');
        
    // Verificar preferencia guardada
    if (localStorage.getItem('dark-mode') === 'true') {
        document.documentElement.classList.add('dark-mode');
        themeToggle.checked = true;
    }
        
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'true');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'false');
        }
    });
};
    
// Formulario de contacto
const contactForm = () => {
    const form = document.querySelector('.contact-form');
      
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
             
            // Aquí iría tu lógica para enviar el formulario
            console.log({name, email, subject, message});
            
            // Simulación de envío exitoso
            alert('¡Mensaje enviado con éxito!');
            form.reset();
        });
    }
};
    
// Inicializar todas las funciones
window.addEventListener('DOMContentLoaded', () => {
    navSlide();
    scrollHeader();
    smoothScroll();
    scrollAppear();
    animateSkills();
    scrollToTop();
    toggleDarkMode();
    contactForm();
});