// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const langToggle = document.getElementById('lang-toggle');
const contactForm = document.getElementById('contact-form');

// ---------------------------------------------------------------------------
// Language (ES / EN)
// ---------------------------------------------------------------------------

// Spanish is the markup's own text; capture it once so switching back is lossless.
const I18N_ES = { ...I18N_ES_EXTRA };
document.querySelectorAll('[data-i18n]').forEach(el => {
    I18N_ES[el.dataset.i18n] = el.innerHTML;
});
document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    I18N_ES[el.dataset.i18nPlaceholder] = el.placeholder;
});
I18N_ES['meta.title'] = document.title;
I18N_ES['meta.description'] = document.querySelector('meta[name="description"]').content;

let currentLang = 'es';

function t(key) {
    const dict = currentLang === 'en' ? I18N_EN : I18N_ES;
    return dict[key] ?? I18N_ES[key] ?? key;
}

function setLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'es';
    document.documentElement.lang = currentLang;
    document.documentElement.dataset.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerHTML = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
        el.setAttribute('aria-label', el.placeholder);
    });
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]').content = t('meta.description');

    try {
        localStorage.setItem('lang', currentLang);
    } catch (e) { /* storage unavailable: language just won't persist */ }
}

function initialLanguage() {
    // ?lang=en lets a shared link (CV, LinkedIn) open straight in English
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (fromUrl === 'en' || fromUrl === 'es') return fromUrl;

    try {
        const saved = localStorage.getItem('lang');
        if (saved === 'en' || saved === 'es') return saved;
    } catch (e) { /* ignore */ }

    return 'es';
}

langToggle.addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'es' : 'en');
});

setLanguage(initialLanguage());

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

function setMenuOpen(open) {
    navMenu.classList.toggle('active', open);
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
}

navToggle.addEventListener('click', () => {
    setMenuOpen(!navMenu.classList.contains('active'));
});

// Close mobile menu when clicking on a link (scrolling itself is handled by CSS)
navLinks.forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
});

// ESC key closes mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        setMenuOpen(false);
    }
});

// Header gets a solid background once the page scrolls
const header = document.querySelector('.header');
function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Active navigation link: the section crossing the upper third of the viewport
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    });
}, { rootMargin: '-30% 0px -60% 0px' });

document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

// ---------------------------------------------------------------------------
// Reveal on scroll
// ---------------------------------------------------------------------------

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.card, .timeline-item, .skill-group, .contact-item')
    .forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

// ---------------------------------------------------------------------------
// Contact Form Handling
// ---------------------------------------------------------------------------

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.textContent = t('form.sending');
        submitButton.disabled = true;
        contactForm.classList.add('loading');

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            contactForm.reset();
            showNotification(t('form.success'), 'success');

            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            contactForm.classList.remove('loading');
        }, 2000);
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'status');
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span></span>
        <button class="notification-close" aria-label="Cerrar">&times;</button>
    `;
    notification.querySelector('span').textContent = message;
    document.body.appendChild(notification);

    const close = () => {
        if (!notification.isConnected) return;
        notification.classList.add('closing');
        setTimeout(() => notification.remove(), 300);
    };

    notification.querySelector('.notification-close').addEventListener('click', close);
    setTimeout(close, 5000);
}

// ---------------------------------------------------------------------------
// External Links Handling
// ---------------------------------------------------------------------------

document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});
