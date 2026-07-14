/**
 * Flipbook.js - StPageFlip Integration for Portfolio Book
 */

(function() {
  'use strict';

  let PageFlip;
  let book;
  let isFlipping = false;
  let wheelTimeout;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBook);
  } else {
    initializeBook();
  }

  function initializeBook() {
    // Wait for StPageFlip library to load
    const checkPageFlip = setInterval(() => {
      if (typeof window.PageFlip !== 'undefined') {
        clearInterval(checkPageFlip);
        initializeFlipbook();
      }
    }, 50);

    // Fallback timeout
    setTimeout(() => {
      clearInterval(checkPageFlip);
      if (typeof window.PageFlip !== 'undefined') {
        initializeFlipbook();
      }
    }, 3000);
  }

  function initializeFlipbook() {
    PageFlip = window.PageFlip;

    // Initialize the book
    book = new PageFlip(document.getElementById('book'), {
      width: 600,
      height: 800,
      size: 'stretch',
      minWidth: 300,
      maxWidth: 1000,
      minHeight: 400,
      maxHeight: 1200,
      maxShadowBlur: 20,
      showCover: true,
      flipped: false,
      useMouseEvents: true,
      disableFlip: false,
      allowSwipe: true,
      allowZoom: false,
      clickEventForward: true,
      loadingImage: null,
      startPage: 0,
      endPagesCount: 0,
      mobileScrollSupport: true,
      swipeDistance: 10
    });

    // Update page counter on flip
    book.on('flip', function(object) {
      const currentPage = book.getCurrentPageIndex() + 1;
      const totalPages = book.getPageCount();
      updatePageCounter(currentPage, totalPages);
      updateActiveBookmark(currentPage);
    });

    // Initial setup
    const totalPages = book.getPageCount();
    updatePageCounter(1, totalPages);

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Attach event listeners
    attachWheelListener();
    attachTouchListener();
    attachButtonListeners();
    attachBookmarkListeners();
    attachFormListener();

    // Hide preloader
    hidePreloader();
  }

  /**
   * Wheel event handler with debouncing/throttling
   */
  function attachWheelListener() {
    let lastWheelTime = 0;
    const WHEEL_DEBOUNCE = 800; // ms between flips

    document.addEventListener('wheel', function(event) {
      if (isFlipping) return;

      const now = Date.now();
      if (now - lastWheelTime < WHEEL_DEBOUNCE) return;

      lastWheelTime = now;
      event.preventDefault();

      if (event.deltaY > 0) {
        // Scroll down = next page
        flipNext();
      } else if (event.deltaY < 0) {
        // Scroll up = previous page
        flipPrev();
      }
    }, { passive: false });
  }

  /**
   * Touch/Swipe event handler
   */
  function attachTouchListener() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    document.addEventListener('touchstart', function(event) {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', function(event) {
      if (isFlipping) return;

      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      const touchEndTime = Date.now();

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = touchEndTime - touchStartTime;

      // Only consider horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 800) {
        if (deltaX < 0) {
          // Swipe left = next page
          flipNext();
        } else if (deltaX > 0) {
          // Swipe right = previous page
          flipPrev();
        }
      }
    }, { passive: true });
  }

  /**
   * Attach click handlers to prev/next buttons
   */
  function attachButtonListeners() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', flipPrev);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', flipNext);
    }
  }

  /**
   * Attach click handlers to bookmarks
   */
  function attachBookmarkListeners() {
    const bookmarks = document.querySelectorAll('.bookmark');

    bookmarks.forEach(bookmark => {
      bookmark.addEventListener('click', function() {
        const pageNum = parseInt(this.dataset.page) - 1; // Convert to 0-indexed
        if (book && pageNum >= 0 && pageNum < book.getPageCount()) {
          isFlipping = true;
          book.turnToPage(pageNum);
          setTimeout(() => { isFlipping = false; }, 600);
        }
      });
    });
  }

  /**
   * Attach form submission handler
   */
  function attachFormListener() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const visitorName = this.querySelector('input[name="name"]').value.trim();
      const endorsementType = this.querySelector('select[name="endorsement"]').value;
      const message = this.querySelector('textarea[name="message"]').value.trim();

      // Send to backend
      fetch('/contact/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: visitorName,
          endorsement: endorsementType,
          message: message
        })
      })
      .then(response => response.json())
      .then(data => {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
          position: fixed;
          background: var(--accent-serif);
          color: #f5e3c5;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          font-size: 0.95rem;
          z-index: 1001;
          bottom: 6rem;
          left: 50%;
          transform: translateX(-50%);
          white-space: pre-wrap;
          word-wrap: break-word;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.3s ease;
        `;
        successMsg.textContent = `✓ ${data.message}`;
        document.body.appendChild(successMsg);

        // Reset form
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Remove message after 4 seconds
        setTimeout(() => {
          successMsg.remove();
        }, 4000);
      })
      .catch(error => {
        console.error('Error:', error);
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
          position: fixed;
          background: #d32f2f;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          font-size: 0.95rem;
          z-index: 1001;
          bottom: 6rem;
          left: 50%;
          transform: translateX(-50%);
          white-space: pre-wrap;
          word-wrap: break-word;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        errorMsg.textContent = '✗ Error sending message. Please try again.';
        document.body.appendChild(errorMsg);

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        setTimeout(() => {
          errorMsg.remove();
        }, 4000);
      });
    });
  }

  /**
   * Flip to next page
   */
  function flipNext() {
    if (!book || isFlipping) return;

    const currentPage = book.getCurrentPageIndex();
    if (currentPage < book.getPageCount() - 1) {
      isFlipping = true;
      book.flipNext();
      setTimeout(() => { isFlipping = false; }, 600);
    }
  }

  /**
   * Flip to previous page
   */
  function flipPrev() {
    if (!book || isFlipping) return;

    const currentPage = book.getCurrentPageIndex();
    if (currentPage > 0) {
      isFlipping = true;
      book.flipPrev();
      setTimeout(() => { isFlipping = false; }, 600);
    }
  }

  /**
   * Update page counter display
   */
  function updatePageCounter(current, total) {
    const counterEl = document.getElementById('pageCounter');
    if (counterEl) {
      counterEl.textContent = `${current} / ${total}`;
    }

    // Update button disabled states
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
      prevBtn.disabled = current === 1;
    }
    if (nextBtn) {
      nextBtn.disabled = current === total;
    }
  }

  /**
   * Update active bookmark
   */
  function updateActiveBookmark(pageNum) {
    const bookmarks = document.querySelectorAll('.bookmark');
    bookmarks.forEach(bm => {
      bm.classList.remove('active');
      if (parseInt(bm.dataset.page) === pageNum) {
        bm.classList.add('active');
      }
    });
  }

  /**
   * Hide preloader
   */
  function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('hidden');
        preloader.addEventListener('transitionend', () => {
          preloader.style.display = 'none';
        }, { once: true });
      }, 300);
    }
  }

  // Prevent default scroll behavior
  window.addEventListener('scroll', function() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });

})();
