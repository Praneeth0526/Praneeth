/**
 * Section Visibility Animations
 */

document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.page-section');
    
    // Intersection Observer for section animations
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger any section-specific animations
                const sectionType = entry.target.getAttribute('data-section');
                triggerSectionAnimations(sectionType, entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    });

    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Make first section visible immediately
    if (sections.length > 0) {
        sections[0].classList.add('visible');
    }

    // Section-specific animations
    function triggerSectionAnimations(sectionType, sectionElement) {
        switch (sectionType) {
            case 'about':
                animateAboutSection(sectionElement);
                break;
            case 'work':
                animateWorkSection(sectionElement);
                break;
            case 'certificate':
                animateCertificateSection(sectionElement);
                break;
            case 'education':
                animateEducationSection(sectionElement);
                break;
            case 'contact':
                animateContactSection(sectionElement);
                break;
        }
    }

    function animateAboutSection(section) {
        const cards = section.querySelectorAll('.about-card, .skill-card, .tech-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    function animateWorkSection(section) {
        const projectCards = section.querySelectorAll('.project-card, .modern-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 150);
        });
    }

    function animateCertificateSection(section) {
        const certItems = section.querySelectorAll('.certificate-item, .cert-card');
        certItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    function animateEducationSection(section) {
        const eduItems = section.querySelectorAll('.education-item, .timeline-item');
        eduItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    function animateContactSection(section) {
        const contactElements = section.querySelectorAll('.contact-info, .contact-form, .contact-item');
        contactElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    console.log('Section animations initialized');
});
