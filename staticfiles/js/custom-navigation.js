// Athos Dark Portfolio - Enhanced Navigation & Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const navToggle = document.querySelector('.js-colorlib-nav-toggle');
    const sidebar = document.querySelector('#colorlib-aside');
    const body = document.body;

    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    body.appendChild(overlay);

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });
    }

    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        closeMobileMenu();
    });

    // Close menu when pressing escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('show')) {
            closeMobileMenu();
        }
    });

    // Close menu when clicking navigation links on mobile
    const navLinks = document.querySelectorAll('#colorlib-main-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                closeMobileMenu();
            }
        });
    });

    function toggleMobileMenu() {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
        navToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    function closeMobileMenu() {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        navToggle.classList.remove('active');
        body.classList.remove('menu-open');
    }

    // Enhanced entrance animations
    function triggerEntranceAnimations() {
        const animatedElements = document.querySelectorAll('.animate-box, .modern-card, .stats-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated', 'fadeInUp');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Initialize all features
    triggerEntranceAnimations();
    
    // Add CSS for enhanced mobile experience
    if (!document.querySelector('#athos-dark-styles')) {
        const athosStyles = document.createElement('style');
        athosStyles.id = 'athos-dark-styles';
        athosStyles.textContent = `
            .menu-open {
                overflow: hidden;
            }
            
            .animate-box {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s ease;
            }
            
            .animate-box.animated {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(athosStyles);
    }
});

// jQuery legacy support for existing code
$(document).ready(function() {
	// Function to update active navigation - Issue 1: Improved sync
	function updateActiveNav() {
		var scrollPos = $(window).scrollTop();
		var windowHeight = $(window).height();
		
		// Remove active class from all nav items
		$('#colorlib-main-menu ul li').removeClass('active');
		
		// Get current section based on scroll position
		var currentSection = null;
		var minDistance = Infinity;
		
		// Check which section is currently most visible
		$('section[data-section]').each(function() {
			var sectionTop = $(this).offset().top;
			var sectionBottom = sectionTop + $(this).outerHeight();
			var sectionId = $(this).attr('data-section');
			
			// Calculate distance from current scroll position to section center
			var sectionCenter = sectionTop + $(this).outerHeight() / 2;
			var viewportCenter = scrollPos + windowHeight / 2;
			var distance = Math.abs(sectionCenter - viewportCenter);
			
			// Also check if section is visible in viewport
			var isVisible = (sectionBottom > scrollPos) && (sectionTop < (scrollPos + windowHeight));
			
			// Prioritize visible sections that are closest to viewport center
			if (isVisible && distance < minDistance) {
				minDistance = distance;
				currentSection = sectionId;
			}
		});
		
		// Set active navigation item
		if (currentSection) {
			$('#colorlib-main-menu ul li a[data-nav-section="' + currentSection + '"]').parent().addClass('active');
		}
		
		// Special case for top of page
		if (scrollPos < 200) {
			$('#colorlib-main-menu ul li').removeClass('active');
			$('#colorlib-main-menu ul li a[data-nav-section="home"]').parent().addClass('active');
		}
	}
	
	// Navigation highlighting on scroll - Issue 1: Better throttling
	var scrollTimeout;
	$(window).scroll(function() {
		if (scrollTimeout) {
			clearTimeout(scrollTimeout);
		}
		scrollTimeout = setTimeout(updateActiveNav, 50); // Faster response
	});
	
	// Initial call to set active nav
	setTimeout(updateActiveNav, 100);
	
	// Smooth scrolling for navigation links
	$('#colorlib-main-menu ul li a[data-nav-section]').click(function(e) {
		e.preventDefault();
		var target = $(this).attr('data-nav-section');
		var targetSection = $('section[data-section="' + target + '"]');
		
		if (targetSection.length) {
			$('html, body').animate({
				scrollTop: targetSection.offset().top - 20
			}, 800, function() {
				// Update active nav after scroll
				setTimeout(updateActiveNav, 100);
			});
		}
	});
	
	// Issue 8: Handle panel state changes for education section
	$('.panel-heading a').on('click', function() {
		var $panel = $(this).closest('.panel-default');
		
		setTimeout(function() {
			// Remove panel-open class from all panels
			$('.panel-default').removeClass('panel-open');
			// Add panel-open class to expanded panels
			$('.panel-collapse.in').closest('.panel-default').addClass('panel-open');
		}, 350); // Wait for Bootstrap animation to complete
	});
	
	// Issue 6: Ensure project images load correctly
	$('.project[style*="background-image"]').each(function() {
		var $this = $(this);
		var bgImage = $this.css('background-image');
		
		if (bgImage && bgImage !== 'none') {
			// Create a new image to test if it loads
			var img = new Image();
			img.onload = function() {
				$this.addClass('image-loaded');
			};
			img.onerror = function() {
				console.warn('Failed to load project image:', bgImage);
				// Add a fallback or placeholder
				$this.css('background-color', 'rgba(255, 255, 255, 0.1)');
			};
			// Extract URL from CSS background-image property
			var url = bgImage.replace(/^url\(['"]?(.+?)['"]?\)$/, '$1');
			img.src = url;
		}
	});
	
	// Responsive navigation toggle
	$('.js-colorlib-nav-toggle').on('click', function(e) {
		e.preventDefault();
		$('body').toggleClass('offcanvas');
	});
	
	// Close navigation when clicking on main content (mobile)
	$('#colorlib-main').on('click', function() {
		if ($('body').hasClass('offcanvas')) {
			$('body').removeClass('offcanvas');
		}
	});
	
	// Handle window resize
	$(window).resize(function() {
		setTimeout(updateActiveNav, 100);
	});
});
