/**
 * Enhanced Smooth Scroll Navigation System
 * Provides seamless single-page scroll navigation with auto-hide functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('#colorlib-aside');
    const navLinks = document.querySelectorAll('#colorlib-main-menu a[data-nav-section]');
    const sections = document.querySelectorAll('.page-section');
    
    let isScrolling = false;
    let hideTimer;
    
    // Auto-hide navigation functionality
    function showNavigation() {
        if (navbar) {
            navbar.style.opacity = '1';
            navbar.style.visibility = 'visible';
            navbar.style.transform = 'translateX(0)';
        }
        
        // Clear existing timer
        clearTimeout(hideTimer);
        
        // Set timer to hide navigation after inactivity
        hideTimer = setTimeout(() => {
            hideNavigation();
        }, 3000); // Hide after 3 seconds of inactivity
    }
    
    function hideNavigation() {
        if (navbar && window.innerWidth > 992) { // Don't auto-hide on mobile
            navbar.style.opacity = '0.3';
            navbar.style.transform = 'translateX(-10px)';
        }
    }
    
    // Show navigation on mouse movement or scroll
    document.addEventListener('mousemove', showNavigation);
    document.addEventListener('scroll', showNavigation);
    document.addEventListener('touchstart', showNavigation);
    
    // Show navigation when hovering over it
    if (navbar) {
        navbar.addEventListener('mouseenter', () => {
            clearTimeout(hideTimer);
            showNavigation();
        });
        
        navbar.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(hideNavigation, 1000);
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
    
    // Handle navigation clicks with enhanced smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                isScrolling = true;
                
                // Update active state immediately
                updateActiveNavigation(this);
                
                // Smooth scroll to target
                smoothScrollTo(targetSection, 800);
                
                // Reset scrolling flag after animation
                setTimeout(() => {
                    isScrolling = false;
                }, 800);
            }
        });
    });
    
    // Update active navigation state
    function updateActiveNavigation(activeLink) {
        navLinks.forEach(nav => nav.parentElement.classList.remove('active'));
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }
    }
    
    // Intersection Observer for automatic navigation updates
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        if (isScrolling) return; // Don't update during programmatic scrolling
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const navLink = document.querySelector(`a[href="#${sectionId}"]`);
                
                if (navLink) {
                    updateActiveNavigation(navLink);
                }
                
                // Trigger section animations
                triggerSectionAnimations(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Function to trigger section animations
    function triggerSectionAnimations(section) {
        section.classList.add('visible');
        
        const animateElements = section.querySelectorAll('.animate-box');
        animateElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fadeInUp', 'animated');
            }, index * 100);
        });
    }
    
    // Initialize first section
    const firstSection = document.querySelector('.page-section');
    if (firstSection) {
        firstSection.classList.add('visible');
        triggerSectionAnimations(firstSection);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.altKey) {
            const keyMap = {
                '1': '#home-section',
                '2': '#about-section', 
                '3': '#work-section',
                '4': '#certificate-section',
                '5': '#education-section',
                '6': '#contact-section'
            };
            
            const targetId = keyMap[e.key];
            if (targetId) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                const navLink = document.querySelector(`a[href="${targetId}"]`);
                
                if (targetSection && navLink) {
                    navLink.click();
                }
            }
        }
    });
    
    // Touch gesture support for mobile
    let startY = 0;
    let isGesturing = false;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        isGesturing = true;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (!isGesturing) return;
        
        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        
        // Show navigation on significant scroll
        if (Math.abs(deltaY) > 50) {
            showNavigation();
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        isGesturing = false;
    }, { passive: true });
    
    // Initialize navigation state
    showNavigation();
});
