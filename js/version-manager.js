// Version Manager - Load assets with version cache busting
class VersionManager {
    constructor() {
        this.version = '1.0.0'; // fallback version
        this.isLoaded = false;
    }

    async loadVersion() {
        try {
            const response = await fetch('version.json?' + Date.now());
            const data = await response.json();
            this.version = data.version;
            this.isLoaded = true;
            console.log(`Version loaded: ${this.version}`);
        } catch (error) {
            console.warn('Could not load version.json, using fallback version:', error);
        }
    }

    getAssetUrl(originalUrl) {
        if (!this.isLoaded) {
            // If version not loaded yet, return original URL
            return originalUrl;
        }

        // Add version parameter to prevent caching
        const separator = originalUrl.includes('?') ? '&' : '?';
        return `${originalUrl}${separator}v=${this.version}`;
    }

    async updateAllAssets() {
        await this.loadVersion();

        // Update CSS links
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            if (link.href && !link.href.includes('fonts.googleapis.com') && !link.href.includes('http')) {
                link.href = this.getAssetUrl(link.href);
            }
        });

        // Update JS scripts
        const jsScripts = document.querySelectorAll('script[src]');
        jsScripts.forEach(script => {
            if (script.src && !script.src.includes('http') && !script.src.includes('googletagmanager') && !script.src.includes('charmingpoliteinjunction')) {
                // Reload script with version parameter
                const newSrc = this.getAssetUrl(script.src);
                if (newSrc !== script.src) {
                    const newScript = document.createElement('script');
                    newScript.src = newSrc;
                    newScript.async = script.async;
                    newScript.defer = script.defer;

                    // Replace old script
                    script.parentNode.insertBefore(newScript, script);
                    script.remove();
                }
            }
        });

        console.log('All assets updated with version parameters');
    }
}

// Initialize version manager
const versionManager = new VersionManager();

// Auto-update assets when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    versionManager.updateAllAssets();
});

// Make version manager globally available
window.versionManager = versionManager;
