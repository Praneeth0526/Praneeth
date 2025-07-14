/**
 * Smooth Scroll Navigation with Auto-Hide Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    let isUserInteracting = false;
    let hideTimer = null;
    let lastScrollY = window.scrollY;
    let isScrolling = false;

    const aside = document.getElementById('colorlib-aside');
    const navToggle = document.querySelector('.colorlib-nav-toggle');
    const navLinks = document.querySelectorAll('#colorlib-main-menu a[data-nav-section]');
    const sections = document.querySelectorAll('.page-section');

    // Initialize navigation state
    function initNavigation() {
        // Show navigation initially
        aside.classList.add('show');
        
        // Set up auto-hide timer
        startHideTimer();
    }

    // Auto-hide navigation after inactivity
    function startHideTimer() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            if (!isUserInteracting) {
                hideNavigation();
            }
        }, 3000); // Hide after 3 seconds of inactivity
    }

    function hideNavigation() {
        aside.classList.remove('show');
    }

    function showNavigation() {
        aside.classList.add('show');
        startHideTimer();
    }

    // Smooth scroll to section
    function smoothScrollTo(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Update active navigation item based on scroll position
    function updateActiveNavigation() {
        const scrollPosition = window.scrollY + 100; // Offset for better detection

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('data-section');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all nav items
                navLinks.forEach(link => {
                    link.parentElement.classList.remove('active');
                });

                // Add active class to current section's nav item
                const activeLink = document.querySelector(`[data-nav-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.parentElement.classList.add('active');
                }
            }
        });
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-nav-section');
            const targetId = targetSection + '-section';
            
            smoothScrollTo(targetId);
            
            // Show navigation briefly after click
            showNavigation();
        });
    });

    // Handle navigation toggle
    navToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (aside.classList.contains('show')) {
            hideNavigation();
        } else {
            showNavigation();
        }
    });

    // Track user interaction with navigation
    aside.addEventListener('mouseenter', function() {
        isUserInteracting = true;
        clearTimeout(hideTimer);
        showNavigation();
    });

    aside.addEventListener('mouseleave', function() {
        isUserInteracting = false;
        startHideTimer();
    });

    // Show navigation on mouse movement near edge
    document.addEventListener('mousemove', function(e) {
        // Show navigation if mouse is near left edge (within 100px)
        if (e.clientX <= 100) {
            showNavigation();
        }
    });

    // Handle scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Update active navigation
        updateActiveNavigation();
        
        // Show navigation briefly during scroll
        if (!isScrolling) {
            isScrolling = true;
            showNavigation();
        }

        // Clear previous timeout
        clearTimeout(scrollTimeout);

        // Set timeout to hide navigation after scrolling stops
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            if (!isUserInteracting) {
                startHideTimer();
            }
        }, 1000);

        lastScrollY = window.scrollY;
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideNavigation();
        } else if (e.key === 'Tab' || e.key === 'Enter') {
            showNavigation();
        }
    });

    // Touch events for mobile
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        
        // Show navigation on touch near left edge
        if (e.touches[0].clientX <= 50) {
            showNavigation();
        }
    });

    document.addEventListener('touchmove', function(e) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        
        // Show navigation during swipe gestures
        if (Math.abs(deltaY) > 50) {
            showNavigation();
        }
    });

    // Initialize everything
    initNavigation();
    updateActiveNavigation();

    // Intersection Observer for more accurate section detection
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('data-section');
                
                // Remove active class from all nav items
                navLinks.forEach(link => {
                    link.parentElement.classList.remove('active');
                });

                // Add active class to current section's nav item
                const activeLink = document.querySelector(`[data-nav-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.parentElement.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Add smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('Smooth scroll navigation initialized');
});
