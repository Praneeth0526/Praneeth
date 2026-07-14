// Enhanced About Section Animations & Interactions
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutSection();
});

// Initialize all effects when about section is loaded
function initializeAboutSection() {
    // Check if we're on the about section
    if (document.querySelector('.modern-about')) {
        addFloatingTextStyles();
        initializeAboutAnimations();
        initializeProgressRings();
        initializeCounters();
        initializeTimeline();
        initializeSkillBubbles();
        initializeParallaxEffects();
        initializeTypingEffects();
        initializeGlitchEffects();
        initializeParticleEffects();
    }
}

function initializeAboutAnimations() {
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
                    element.style.animationDuration = '1s';
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

function initializeProgressRings() {
    const progressRings = document.querySelectorAll('.progress-ring');
    
    progressRings.forEach(ring => {
        const progressValue = parseInt(ring.dataset.progress);
        const progressFill = ring.querySelector('.progress-fill');
        const circumference = 2 * Math.PI * 42; // radius = 42
        
        // Set initial state
        progressFill.style.strokeDasharray = circumference;
        progressFill.style.strokeDashoffset = circumference;
        
        // Animate when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressRing(progressFill, circumference, progressValue);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(ring);
    });
}

function animateProgressRing(progressFill, circumference, targetValue) {
    const offset = circumference - (targetValue / 100) * circumference;
    
    setTimeout(() => {
        progressFill.style.strokeDashoffset = offset;
    }, 500);
}

function initializeCounters() {
    const counters = document.querySelectorAll('.counter-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter, current, target, increment);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function animateCounter(element, current, target, increment) {
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('timeline-visible');
                        
                        // Add CSS for timeline visibility
                        if (!document.querySelector('#timeline-styles')) {
                            const style = document.createElement('style');
                            style.id = 'timeline-styles';
                            style.textContent = `
                                .timeline-visible {
                                    animation: slideInFromSide 0.8s ease-out forwards;
                                }
                                @keyframes slideInFromSide {
                                    from {
                                        opacity: 0;
                                        transform: translateX(-50px);
                                    }
                                    to {
                                        opacity: 1;
                                        transform: translateX(0);
                                    }
                                }
                            `;
                            document.head.appendChild(style);
                        }
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(item);
    });
}

function initializeSkillBubbles() {
    const skillCards = document.querySelectorAll('.skill-hover');
    
    skillCards.forEach(card => {
        // Hover effect for other cards
        card.addEventListener('mouseenter', () => {
            skillCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.opacity = '0.6';
                    otherCard.style.transform = 'scale(0.95)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            skillCards.forEach(otherCard => {
                otherCard.style.opacity = '1';
                otherCard.style.transform = '';
            });
        });
        
        // Click effect with ripple
        card.addEventListener('click', function(e) {
            // Add active class temporarily
            this.classList.add('skill-active');
            setTimeout(() => {
                this.classList.remove('skill-active');
            }, 300);
            
            // Create floating text effect
            createFloatingText(this, this.dataset.skill);
        });
        
        // Add stagger entrance animation
        const index = Array.from(skillCards).indexOf(card);
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Initialize cards as hidden for entrance animation
    skillCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });
}

function createFloatingText(element, skillName) {
    const floatingText = document.createElement('div');
    floatingText.textContent = skillName;
    floatingText.style.cssText = `
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--accent-color);
        font-weight: bold;
        font-size: 0.9rem;
        pointer-events: none;
        z-index: 1000;
        animation: floatText 2s ease-out forwards;
    `;
    
    element.style.position = 'relative';
    element.appendChild(floatingText);
    
    setTimeout(() => {
        floatingText.remove();
    }, 2000);
}

// Add CSS for floating text animation
function addFloatingTextStyles() {
    if (!document.querySelector('#floating-text-styles')) {
        const style = document.createElement('style');
        style.id = 'floating-text-styles';
        style.textContent = `
            @keyframes floatText {
                0% {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-40px);
                }
            }
            .skill-active {
                animation: skillPulse 0.3s ease-out;
            }
            @keyframes skillPulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeParallaxEffects() {
    const floatingElements = document.querySelectorAll('.floating-bg-elements > *');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.01}deg)`;
        });
    });
    
    // Mouse parallax effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        floatingElements.forEach((element, index) => {
            const speed = (index + 1) * 10;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            element.style.transform += ` translate(${x}px, ${y}px)`;
        });
    });
}

// Initialize typing effects
function initializeTypingEffects() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeText(element, text, 50);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

function typeText(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Initialize glitch text effects
function initializeGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch-text');
    
    glitchElements.forEach(element => {
        element.dataset.text = element.textContent;
        
        element.addEventListener('mouseenter', () => {
            element.style.animation = 'glitch 0.3s infinite';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.animation = '';
        });
    });
}

// Initialize particle effects
function initializeParticleEffects() {
    const particleContainers = document.querySelectorAll('.particle-container');
    
    particleContainers.forEach(container => {
        // Create additional particles dynamically
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.classList.add('dynamic-particle');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: var(--accent-primary);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: particle-float ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                opacity: 0.7;
            `;
            container.appendChild(particle);
        }
    });
}

// Listen for HTMX content swaps
document.addEventListener('htmx:afterSwap', function(e) {
    if (e.detail.target.id === 'main-content') {
        setTimeout(initializeAboutSection, 100);
    }
});

// Also listen for manual navigation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize immediately if about section is already present
    setTimeout(initializeAboutSection, 100);
});
