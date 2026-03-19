// ===== VERSION CHECKING SYSTEM =====
// This file contains functions for automatic version checking and update notifications
// Can be used across the entire website

class VersionChecker {
    constructor(options = {}) {
        this.currentVersionData = null;
        this.isEmbedded = options.embedded || false;
        this.updateCheckInterval = null;
        this.checkInterval = options.checkInterval || 10 * 60 * 1000; // 10 minutes default
        this.silentCheckInterval = options.silentCheckInterval || 5 * 60 * 1000; // 5 minutes for silent checks
    }

    // Initialize the version system
    async init() {
        console.log('Initializing version checker...');

        // Load version data
        await this.loadVersionData();

        // Set up automatic checking if not embedded
        if (!this.isEmbedded) {
            this.setupAutoChecking();
        }

        return {
            getCurrentVersion: () => this.currentVersionData?.version,
            checkForUpdates: () => this.checkForUpdates(),
            forceReload: () => this.forceReload(),
            showUpdateNotification: (version) => this.showUpdateNotification(version)
        };
    }

    // Load version data from version.json
    async loadVersionData() {
        try {
            const response = await fetch('version.json?' + Date.now());
            const data = await response.json();
            this.currentVersionData = data;

            // Store in localStorage for cross-page reference
            localStorage.setItem('fp_last_version_check', Date.now());
            localStorage.setItem('fp_current_version', data.version);

            console.log('Version data loaded:', data.version);
        } catch (error) {
            console.error('Error loading version data:', error);
            throw error;
        }
    }

    // Set up automatic update checking
    setupAutoChecking() {
        // Check on page load (after a delay)
        setTimeout(() => {
            this.checkForUpdatesSilent();
        }, 3000);

        // Check when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkForUpdatesSilent();
            }
        });

        // Set up periodic checking
        this.updateCheckInterval = setInterval(() => {
            if (!document.hidden) {
                this.checkForUpdatesSilent();
            }
        }, this.checkInterval);
    }

    // Silent update check (no UI feedback)
    async checkForUpdatesSilent() {
        try {
            const response = await fetch('version.json?' + Date.now());
            const data = await response.json();

            if (data.version !== this.currentVersionData?.version) {
                console.log('Update detected:', data.version);
                this.currentVersionData = data;
                this.showUpdateNotification(data.version);
            }
        } catch (error) {
            console.error('Silent update check failed:', error);
        }
    }

    // Manual update check with UI feedback
    async checkForUpdates() {
        try {
            this.showLoading(true);

            const response = await fetch('version.json?' + Date.now());
            const data = await response.json();

            if (data.version !== this.currentVersionData?.version) {
                this.showStatusMessage(`🎉 تم العثور على إصدار جديد: ${data.version}!`, 'success');
                this.currentVersionData = data;
            } else {
                this.showStatusMessage('✅ أنت تستخدم أحدث إصدار!', 'success');
            }
        } catch (error) {
            console.error('Update check failed:', error);
            this.showStatusMessage('خطأ في التحقق من التحديثات', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Show update notification
    showUpdateNotification(newVersion) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.version-update-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'version-update-notification';

        notification.innerHTML = `
            <div class="version-update-content">
                <div class="version-update-icon">🔄</div>
                <div class="version-update-text">
                    <div class="version-update-title">تحديث متوفر!</div>
                    <div class="version-update-subtitle">الإصدار ${newVersion} جاهز للتحميل</div>
                </div>
                <div class="version-update-actions">
                    <button onclick="window.versionChecker.forceReload()" class="version-update-btn version-update-now">
                        تحديث الآن
                    </button>
                    <button onclick="this.closest('.version-update-notification').remove()" class="version-update-btn version-update-later">
                        لاحقاً
                    </button>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Add CSS if not already present
        if (!document.querySelector('#version-update-styles')) {
            const styles = document.createElement('style');
            styles.id = 'version-update-styles';
            styles.textContent = `
                .version-update-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 16px 20px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    z-index: 10000;
                    max-width: 400px;
                    font-family: 'Cairo', sans-serif;
                    animation: slideInRight 0.5s ease-out;
                }

                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .version-update-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .version-update-icon {
                    font-size: 24px;
                }

                .version-update-text {
                    flex: 1;
                }

                .version-update-title {
                    font-weight: 600;
                    font-size: 14px;
                }

                .version-update-subtitle {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-top: 2px;
                }

                .version-update-actions {
                    display: flex;
                    gap: 8px;
                }

                .version-update-btn {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .version-update-now {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }

                .version-update-now:hover {
                    background: rgba(255,255,255,0.3);
                }

                .version-update-later {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }

                .version-update-later:hover {
                    background: rgba(255,255,255,0.2);
                }

                @media (max-width: 480px) {
                    .version-update-notification {
                        left: 10px;
                        right: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 30000);
    }

    // Force reload page with cache clearing
    forceReload() {
        // Clear all caches
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }

        // Clear version cache
        localStorage.removeItem('fp_last_version_check');
        localStorage.removeItem('fp_current_version');

        // Force reload
        window.location.reload(true);
    }

    // Show loading state
    showLoading(show) {
        const loadingElement = document.getElementById('updateLoading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'inline-block' : 'none';
        }
    }

    // Show status message
    showStatusMessage(message, type = 'info') {
        const statusElement = document.getElementById('statusMessage');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `status-message ${type} show`;

            // Auto hide after 5 seconds
            setTimeout(() => {
                statusElement.classList.remove('show');
            }, 5000);
        }
    }
}

// Global instance
window.versionChecker = new VersionChecker();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.versionChecker.init();
    });
} else {
    window.versionChecker.init();
}
