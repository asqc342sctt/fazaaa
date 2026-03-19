/**
 * =====================================================================
 * JavaScript Performance Enhancements for Mobile Games Page
 * =====================================================================
 */

/**
 * 1. Image Loading Optimization (Lazy Loading via Intersection Observer)
 * - Uses Intersection Observer for efficient off-screen image loading.
 * - Applies 'loading="lazy"' and 'decoding="async"' attributes.
 * - Applies GPU acceleration via 'translateZ(0)' and rendering quality.
 */
function optimizeImages() {
    const images = document.querySelectorAll('.game-card img');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // 1. Apply optimized loading attributes
                    if (!img.hasAttribute('loading')) {
                        img.setAttribute('loading', 'lazy');
                    }
                    if (!img.hasAttribute('decoding')) {
                        img.setAttribute('decoding', 'async');
                    }

                    // 2. Apply dynamic rendering/GPU optimization (falls back to CSS)
                    img.style.imageRendering = 'crisp-edges';
                    img.style.transform = 'translateZ(0)';

                    // 3. Error Handling (Placeholder Fallback)
                    img.addEventListener('error', function() {
                        this.src = '../images/placeholder.jpg'; // Path to your placeholder image
                        this.alt = 'صورة غير متوفرة';
                        this.classList.add('image-error');
                    });
                    
                    // Stop observing once the image is loaded/triggered
                    observer.unobserve(img);
                }
            });
        }, {
            // Load images slightly before they enter the viewport
            rootMargin: '50px 0px', 
            threshold: 0.01 // Trigger immediately upon entering the rootMargin
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers (only apply attributes/styles)
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            img.style.imageRendering = 'crisp-edges';
            img.style.transform = 'translateZ(0)';
        });
    }
}

/**
 * 2. Scrolling Optimization (Throttling Scroll Events)
 * - Uses requestAnimationFrame (rAF) to ensure scroll updates happen at optimal times
 * and avoid unnecessary reflows/repaints.
 * - Uses { passive: true } to prevent blocking the main thread during scrolling.
 */
function optimizeScrolling() {
    let ticking = false;
    
    function updateScroll() {
        // Placeholder for any complex scroll-dependent DOM manipulation (e.g., parallax, sticky elements)
        // If no DOM manipulation is needed, this function remains simple but the throttling mechanism is key.
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }
    
    // Listen for scroll events passively (highly recommended for performance)
    window.addEventListener('scroll', requestTick, { passive: true });
}

/**
 * 3. Layout Optimization (Applying Containment via JS)
 * - Ensures that CSS Containment properties are applied to critical elements
 * (like game cards) if they were not already applied via CSS.
 */
function optimizeLayout() {
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        // These properties help the browser isolate rendering for each card
        card.style.contain = 'layout style paint';
        card.style.willChange = 'transform, opacity'; // More specific than 'auto'
    });
}


/**
 * 4. Memory Optimization (Attempting Garbage Collection)
 * - Attempts to trigger garbage collection (GC) periodically.
 * *NOTE: window.gc is non-standard and only available in some environments 
 * (e.g., Chrome with experimental flags or Node.js). 
 * This will have no effect in production web browsers.*
 */
function optimizeMemory() {
    // Only attempts to run if the non-standard global GC function is available
    if (window.gc) {
        // Use requestIdleCallback if available, otherwise fallback to setTimeout
        const runGC = () => {
             // console.log('Attempting Garbage Collection...');
             window.gc();
        };

        if (window.requestIdleCallback) {
            // Run during browser idle time
            window.requestIdleCallback(runGC, { timeout: 2000 }); 
        } else {
            // Simple fallback, running less frequently is generally safer
            setTimeout(runGC, 5000); 
        }
    }
}


/**
 * =====================================================================
 * Initialization
 * =====================================================================
 */
document.addEventListener('DOMContentLoaded', function() {
    optimizeImages();
    optimizeScrolling();
    optimizeLayout();
});

window.addEventListener('load', function() {
    // Apply final GPU acceleration to the body after everything is loaded
    document.body.style.transform = 'translateZ(0)';
    
    // Run memory optimization once the page is fully loaded and stable
    optimizeMemory(); 
});