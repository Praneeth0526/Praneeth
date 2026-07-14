/**
 * Toggle Navigation System
 */

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.colorlib-nav-toggle');
    const aside = document.getElementById('colorlib-aside');
    const navLinks = document.querySelectorAll('#colorlib-main-menu a[data-nav-section]');
    let overlay;

    // Create overlay element
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.addEventListener('click', closeNavigation);
        document.body.appendChild(overlay);
    }

    // Initialize
    function init() {
        createOverlay();
        
        // Set initial state - navigation closed
        aside.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Add event listeners
        navToggle.addEventListener('click', toggleNavigation);
        
        // Close navigation when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeNavigation();
                updateActiveLink(this);
            });
        });

        // Close navigation on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && aside.classList.contains('active')) {
                closeNavigation();
            }
        });

        // Handle HTMX events
        document.addEventListener('htmx:beforeRequest', function() {
            showLoadingState();
        });

        document.addEventListener('htmx:afterSwap', function() {
            hideLoadingState();
        });
    }

    function toggleNavigation(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (aside.classList.contains('active')) {
            closeNavigation();
        } else {
            openNavigation();
        }
    }

    function openNavigation() {
        aside.classList.add('active');
        navToggle.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeNavigation() {
        aside.classList.remove('active');
        navToggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    function updateActiveLink(clickedLink) {
        // Remove active class from all nav items
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        // Add active class to clicked nav item
        clickedLink.parentElement.classList.add('active');
    }

    function showLoadingState() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.opacity = '0.7';
            mainContent.style.transition = 'opacity 0.3s ease';
        }
    }

    function hideLoadingState() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.opacity = '1';
        }
    }

    // Handle touch gestures on mobile
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', function(e) {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // If swipe is more horizontal than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Swipe right from left edge to open navigation
            if (touchStartX < 50 && deltaX > 100) {
                openNavigation();
            }
            // Swipe left when navigation is open to close it
            else if (aside.classList.contains('active') && deltaX < -100) {
                closeNavigation();
            }
        }

        touchStartX = 0;
        touchStartY = 0;
    });

    // Responsive handling
    function handleResize() {
        if (window.innerWidth > 768 && aside.classList.contains('active')) {
            // Auto close navigation on larger screens if desired
            // closeNavigation();
        }
    }

    window.addEventListener('resize', handleResize);

    // Initialize everything
    init();

    console.log('Toggle navigation system initialized');
});
