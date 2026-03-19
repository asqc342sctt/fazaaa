// Logo Sound Effect
document.addEventListener('DOMContentLoaded', function() {
    // Create multiple path options to ensure sound works
    const soundPaths = [
        './صوت الشعار/short-scratch.mp3',
        '../صوت الشعار/short-scratch.mp3',
        '/صوت الشعار/short-scratch.mp3'
    ];
    
    let audio = null;
    
    // Preload audio with first working path
    function preloadAudio() {
        for (let path of soundPaths) {
            try {
                audio = new Audio(path);
                audio.volume = 0.5;
                audio.preload = 'auto';
                console.log('Loading audio from:', path);
                break;
            } catch (e) {
                console.log('Failed to load audio from:', path, e);
            }
        }
    }
    
    function playLogoSound() {
        if (!audio) {
            preloadAudio();
        }
        
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => {
                console.log('Audio play failed:', e);
                // Try to reload and play again
                preloadAudio();
                if (audio) {
                    setTimeout(() => audio.play(), 100);
                }
            });
        }
    }
    
    // Preload audio on load
    preloadAudio();
    
    // Add click event to all logo elements
    const logoElements = document.querySelectorAll('.header-logo');
    logoElements.forEach(logo => {
        logo.addEventListener('click', function(e) {
            // Don't prevent default to allow navigation and ad tracking
            
            // Prevent multiple rapid clicks
            if (this.dataset.clicked) return;
            this.dataset.clicked = 'true';
            
            playLogoSound();
            
            // Add shake animation
            this.style.animation = 'shake 0.3s ease-in-out';
            
            // Reset after animation
            setTimeout(() => {
                delete this.dataset.clicked;
                this.style.animation = '';
            }, 300);
        });
        
        // Add visual feedback
        logo.style.cursor = 'pointer';
        logo.style.transition = 'transform 0.2s ease';
        
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add shake animation to page
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px) rotate(-2deg); }
            75% { transform: translateX(5px) rotate(2deg); }
        }
    `;
    document.head.appendChild(style);
});
