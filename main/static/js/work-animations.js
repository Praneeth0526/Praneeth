// Work Section Animations & Interactions
document.addEventListener('DOMContentLoaded', function() {
    initializeWorkSection();
});

function initializeWorkSection() {
    // Check if we're on the work section
    if (document.querySelector('.modern-work')) {
        initializeWorkAnimations();
        initializeProjectInteractions();
        initializeModalHandling();
        initializeLoadMoreFunctionality();
    }
}

function initializeWorkAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.dataset.animation || 'fadeInUp';
                const delay = parseInt(element.dataset.delay) || 0;
                
                setTimeout(() => {
                    element.classList.add('animate-in');
                    element.style.animationName = animation;
                    element.style.animationDuration = '0.8s';
                    element.style.animationFillMode = 'both';
                    element.style.opacity = '1';
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

function initializeProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('loading')) {
                this.style.transform = 'translateY(0)';
            }
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function initializeModalHandling() {
    // Handle HTMX modal content swap
    document.addEventListener('htmx:afterSwap', function(evt) {
        if (evt.target.id === 'project-modal-content') {
            showProjectModal();
        }
    });
    
    // Handle modal events
    const modal = document.getElementById('project-modal');
    if (modal) {
        // Clean up when modal is hidden
        modal.addEventListener('hidden.bs.modal', function() {
            clearProjectLoadingStates();
        });
        
        // Handle modal show
        modal.addEventListener('show.bs.modal', function() {
            document.body.style.overflow = 'hidden';
        });
        
        // Handle modal hide
        modal.addEventListener('hidden.bs.modal', function() {
            document.body.style.overflow = '';
        });
    }
}

function showProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal && typeof bootstrap !== 'undefined') {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    } else if (modal && typeof $ !== 'undefined') {
        // Fallback to jQuery if Bootstrap 5 is not available
        $(modal).modal('show');
    }
}

function clearProjectLoadingStates() {
    document.querySelectorAll('.project-card.loading').forEach(card => {
        card.classList.remove('loading');
        card.style.transform = '';
    });
}

function initializeLoadMoreFunctionality() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        // Handle successful load more
        document.addEventListener('htmx:afterSwap', function(evt) {
            if (evt.target.id === 'projects-container') {
                // Re-initialize animations for new cards
                initializeNewProjectCards();
                
                // Update load more button visibility
                updateLoadMoreButton();
            }
        });
        
        // Handle load more errors
        document.addEventListener('htmx:responseError', function(evt) {
            if (evt.detail.elt.classList.contains('load-more-btn')) {
                showLoadMoreError();
            }
        });
    }
}

function initializeNewProjectCards() {
    const newCards = document.querySelectorAll('.project-card:not(.initialized)');
    
    newCards.forEach((card, index) => {
        // Mark as initialized
        card.classList.add('initialized');
        
        // Add stagger animation
        setTimeout(() => {
            card.classList.add('animate-in');
            card.style.animationName = 'slideInUp';
            card.style.animationDuration = '0.6s';
            card.style.animationFillMode = 'both';
        }, index * 100);
        
        // Add interactions
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('loading')) {
                this.style.transform = 'translateY(0)';
            }
        });
        
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Hide button if we have loaded all projects (this logic may need adjustment based on your backend)
    if (loadMoreBtn && projectCards.length % 6 !== 0) {
        loadMoreBtn.style.display = 'none';
    }
}

function showLoadMoreError() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        const originalText = loadMoreBtn.innerHTML;
        loadMoreBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error loading projects';
        loadMoreBtn.style.background = '#ef4444';
        
        setTimeout(() => {
            loadMoreBtn.innerHTML = originalText;
            loadMoreBtn.style.background = '';
        }, 3000);
    }
}

// Add CSS for ripple effect if not already added
function addRippleStyles() {
    if (!document.querySelector('#ripple-work-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-work-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Parallax effect for project images (optional performance enhancement)
function initializeParallaxEffect() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const projectImages = document.querySelectorAll('.project-image img');
        
        projectImages.forEach(img => {
            const card = img.closest('.project-card');
            if (card) {
                const rect = card.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    const yPos = (rect.top - window.innerHeight / 2) * 0.05;
                    img.style.transform = `translateY(${yPos}px) scale(1.05)`;
                }
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking && window.innerWidth > 768) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    addRippleStyles();
    initializeWorkSection();
    initializeParallaxEffect();
});

// Listen for HTMX content swaps
document.addEventListener('htmx:afterSwap', function(e) {
    if (e.detail.target.id === 'main-content' && document.querySelector('.modern-work')) {
        setTimeout(() => {
            initializeWorkSection();
            initializeParallaxEffect();
        }, 100);
    }
});
