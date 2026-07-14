/**
 * Modern Navigation System
 * Navigation only appears when hamburger menu is clicked
 */

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.js-colorlib-nav-toggle');
    const navbar = document.querySelector('#colorlib-aside');
    const navLinks = document.querySelectorAll('#colorlib-main-menu a[data-nav-section]');
    const body = document.body;
    
    let isMenuOpen = false;
    
    // Toggle navigation menu
    function toggleNavigation() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            navbar.classList.add('show');
            body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            navbar.classList.remove('show');
            body.style.overflow = ''; // Restore scrolling
        }
    }
    
    // Close navigation
    function closeNavigation() {
        isMenuOpen = false;
        navbar.classList.remove('show');
        body.style.overflow = '';
    }
    
    // Hamburger menu click handler
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleNavigation();
        });
    }
    
    // Enhanced smooth scroll function
    function smoothScrollTo(target, duration = 1000) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        // Easing function for smooth animation
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active state
                navLinks.forEach(navLink => navLink.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');
                
                // Close navigation menu
                closeNavigation();
                
                // Smooth scroll to target
                smoothScrollTo(targetSection, 800);
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !navbar.contains(e.target) && !navToggle.contains(e.target)) {
            closeNavigation();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeNavigation();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeNavigation();
        }
    });
    
    // Update active navigation based on scroll position
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('.page-section');
        const scrollPos = window.pageYOffset + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.parentElement.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.parentElement.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttled scroll handler for better performance
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateActiveNavigation();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Initialize active state
    updateActiveNavigation();
    
    // Animation on scroll for section elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.animate-on-scroll, .modern-card, .skill-card, .project-card');
    animatableElements.forEach(el => {
        observer.observe(el);
    });
});

// CSS animation class
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-on-scroll,
    .modern-card,
    .skill-card,
    .project-card {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease-out;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
