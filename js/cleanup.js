// Cleanup Script - Remove unwanted elements
document.addEventListener('DOMContentLoaded', function() {
    // Remove any unwanted floating elements
    function removeUnwantedElements() {
        // Elements to remove
        const unwantedSelectors = [
            '[style*="position: fixed"]',
            '[style*="position: absolute"]',
            '[style*="z-index: 999"]',
            '[style*="z-index: 9999"]',
            '.floating-widget',
            '.overlay-widget',
            '.notification-popup',
            '.search-widget',
            '.user-widget'
        ];
        
        // Remove elements containing unwanted content
        const elementsToRemove = document.querySelectorAll('*');
        elementsToRemove.forEach(element => {
            const text = element.textContent || '';
            const html = element.innerHTML || '';
            
            // Check for unwanted content
            if (text.includes('🔍') || text.includes('🔔') || text.includes('✏️') ||
                text.includes('Rahma sameh') || text.includes('googleusercontent') ||
                html.includes('googleusercontent')) {
                
                // Only remove if it's not part of the legitimate content
                if (!isLegitimateContent(element)) {
                    element.remove();
                    console.log('Removed unwanted element:', element);
                }
            }
        });
        
        // Remove elements by selectors
        unwantedSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!isLegitimateContent(element)) {
                    element.remove();
                    console.log('Removed floating element:', element);
                }
            });
        });
    }
    
    // Check if element is legitimate content
    function isLegitimateContent(element) {
        const legitimateClasses = [
            'main-header', 'nav-menu', 'mobile-toggle', 'hero', 'features',
            'games-section', 'apps-tools-section', 'web-games-section', 'main-footer',
            'container', 'game-card', 'feature-card', 'tool-card', 'web-game-card'
        ];
        
        const legitimateParents = ['header', 'nav', 'main', 'section', 'footer', 'article'];
        
        // Check if element or its parents have legitimate classes
        for (let cls of legitimateClasses) {
            if (element.classList && element.classList.contains(cls)) {
                return true;
            }
        }
        
        // Check if element is inside legitimate parents
        let parent = element.parentElement;
        while (parent) {
            if (legitimateParents.includes(parent.tagName.toLowerCase())) {
                return true;
            }
            parent = parent.parentElement;
        }
        
        return false;
    }
    
    // Remove unwanted scripts that might inject content
    function removeUnwantedScripts() {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            const content = script.textContent || script.src || '';
            if (content.includes('dashboard') && 
                !content.includes('mobile-menu') && 
                !content.includes('login-link')) {
                console.log('Removed unwanted script:', script);
                script.remove();
            }
        });
    }
    
    // Clean up immediately
    removeUnwantedElements();
    removeUnwantedScripts();
    
    // Clean up periodically (in case elements are added dynamically)
    setInterval(removeUnwantedElements, 3000);
    
    // Clean up on DOM changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                setTimeout(removeUnwantedElements, 100);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Hide any remaining floating elements with high z-index
    const style = document.createElement('style');
    style.textContent = `
        [style*="position: fixed"]:not(.main-header):not(.nav-menu):not(.mobile-toggle),
        [style*="position: absolute"]:not(.game-overlay):not(.tool-icon),
        [style*="z-index"]:not(.main-header):not(.nav-menu):not(.mobile-toggle) {
            display: none !important;
        }
        
        /* Hide any potential floating widgets */
        div[style*="top"]:not(.hero-visual):not(.featured-card),
        div[style*="right"]:not(.nav-menu),
        div[style*="bottom"]:not(.main-footer) {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Cleanup script initialized');
});
