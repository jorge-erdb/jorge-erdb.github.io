// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');
const contactForm = document.querySelector('.contact-form');

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger menu
    const bars = navToggle.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');

        // Reset hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');

        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Active navigation link on scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Project Tabs Functionality
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked button and corresponding panel
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');

        // Add fade-in animation
        document.getElementById(targetTab).classList.add('fade-in');
        setTimeout(() => {
            document.getElementById(targetTab).classList.remove('fade-in');
        }, 600);
    });
});

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};

    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    contactForm.classList.add('loading');

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Reset form
        contactForm.reset();

        // Show success message
        showNotification('¡Mensaje enviado exitosamente! Te contactaré pronto.', 'success');

        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        contactForm.classList.remove('loading');
    }, 2000);
});

// Notification System
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#f59e0b'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Close notification
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                    document.head.removeChild(style);
                }
            }, 300);
        }
    }, 5000);
}

// Header Background on Scroll
// function updateHeaderBackground() {
//    const header = document.querySelector('.header');
//    const scrolled = window.scrollY > 50;

//    if (scrolled) {
//        header.style.background = 'rgba(255, 255, 255, 0.98)';
//        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
//    } else {
//        header.style.background = 'rgba(255, 255, 255, 0.95)';
//        header.style.boxShadow = 'none';
//    }
//}

// window.addEventListener('scroll', updateHeaderBackground);

// Intersection Observer for Animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .project-card, .social-card, .contact-item, .skill-item');
    animatedElements.forEach(el => observer.observe(el));
});

// Floating Animation Controller
function controlFloatingAnimations() {
    const floatingCards = document.querySelectorAll('.floating-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        floatingCards.forEach(card => {
            card.style.animation = 'none';
        });
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', controlFloatingAnimations);

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');

        // Reset hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    }
});

// Smooth Page Load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Add loaded styles
    const loadedStyle = document.createElement('style');
    loadedStyle.textContent = `
        body.loaded {
            animation: fadeIn 0.5s ease-in;
        }
    `;
    document.head.appendChild(loadedStyle);
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handlers
const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// External Links Handling
document.addEventListener('DOMContentLoaded', () => {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
});

// Error Handling for Images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
        });
    });
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
    });
}

// Service Worker Registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered: ', registration))
        //     .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}

console.log('🚀 Jorge Erdmann - Hub Profesional loaded successfully!');
