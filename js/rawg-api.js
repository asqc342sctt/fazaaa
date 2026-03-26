// ═══════════ RAWG API MANAGEMENT SYSTEM ═══════════
// 🔑 Multiple API Keys with Smart Switching
// 📊 Usage Tracking & Monthly Limits
// 🔄 Automatic Failover System

class RAWGAPIManager {
    constructor() {
        // API Keys Configuration
        this.API_KEYS = [
            { 
                key: '63782c9e9d6946a097bf5d4cfcb16aa4', 
                name: 'Primary', 
                requests: 0, 
                lastUsed: null, 
                monthlyLimit: 100000,
                active: true
            },
            { 
                key: '830398473ad549d2985d258e255f384a', 
                name: 'Backup', 
                requests: 0, 
                lastUsed: null, 
                monthlyLimit: 100000,
                active: true
            }
        ];
        
        this.currentAPIIndex = 0;
        this.PAGE_SIZE = 50; // Increased from 20 to get more games
        
        // Load usage from localStorage
        this.loadAPIUsage();
        
        // Initialize status display
        this.initStatusDisplay();
    }
    
    // Get current API key
    getAPIKey() {
        const api = this.API_KEYS[this.currentAPIIndex];
        console.log(`Using ${api.name} API (requests this session: ${api.requests})`);
        return api.key;
    }
    
    // Switch to next API if current one fails
    switchAPI() {
        this.currentAPIIndex = (this.currentAPIIndex + 1) % this.API_KEYS.length;
        const api = this.API_KEYS[this.currentAPIIndex];
        console.log(`Switched to ${api.name} API`);
        return api.key;
    }
    
    // Track API usage
    trackAPIUsage(apiKey) {
        const api = this.API_KEYS.find(a => a.key === apiKey);
        if (api) {
            api.requests++;
            api.lastUsed = new Date();
            
            // Save to localStorage for persistence
            this.saveAPIUsage();
            
            // Update status display
            this.updateStatusDisplay();
        }
    }
    
    // Save API usage to localStorage
    saveAPIUsage() {
        try {
            const usageData = this.API_KEYS.map(api => ({
                key: api.key,
                requests: api.requests,
                lastUsed: api.lastUsed,
                active: api.active
            }));
            localStorage.setItem('fazza_api_usage', JSON.stringify(usageData));
        } catch (e) {
            console.error('Failed to save API usage:', e);
        }
    }
    
    // Load API usage from localStorage
    loadAPIUsage() {
        try {
            const saved = localStorage.getItem('fazza_api_usage');
            if (saved) {
                const usage = JSON.parse(saved);
                usage.forEach((savedApi, index) => {
                    if (this.API_KEYS[index]) {
                        this.API_KEYS[index].requests = savedApi.requests || 0;
                        this.API_KEYS[index].lastUsed = savedApi.lastUsed ? new Date(savedApi.lastUsed) : null;
                        this.API_KEYS[index].active = savedApi.active !== false;
                    }
                });
            }
        } catch (e) {
            console.error('Failed to load API usage:', e);
        }
    }
    
    // Main fetch function with retry logic
    async fetchGames(page = 1, options = {}) {
        const {
            genre = '',
            sort = '-rating',
            platform = '',
            search = '',
            retryCount = 0
        } = options;
        
        console.log('RAWGAPI: Fetching games with options:', { page, genre, sort, platform, search });
        
        // Build API URL with current key - remove page size limit to get more games
        const currentKey = this.getAPIKey();
        let url = `https://api.rawg.io/api/games?key=${currentKey}&page_size=40&page=${page}&ordering=${sort}&dates=2020-01-01,2024-12-31`;
        
        // Add exclude parameter to avoid common fallback games
        const excludeIds = [3498, 3328, 4200, 5679, 28, 409]; // Common fallback game IDs
        if (page === 1) {
            console.log('Excluding common fallback game IDs to ensure fresh data');
        }
        
        // Only add filters if they exist and are not empty
        if (genre && genre !== '') {
            url += `&genres=${genre}`;
            console.log('Adding genre filter:', genre);
        }
        if (platform && platform !== '') {
            url += `&platforms=${platform}`;
            console.log('Adding platform filter:', platform);
        }
        if (search && search.trim() !== '') {
            url += `&search=${encodeURIComponent(search.trim())}`;
            console.log('Adding search filter:', search);
        }
        
        console.log('Final API URL:', url);
        
        try {
            // Track API usage
            this.trackAPIUsage(currentKey);
            
            // Make API request
            console.log(`Fetching games with ${this.API_KEYS[this.currentAPIIndex].name} API...`);
            
            const response = await fetch(url);
            console.log('API Response status:', response.status);
            console.log('API Response headers:', response.headers);
            
            if (!response.ok) {
                if (response.status === 401 && retryCount < this.API_KEYS.length - 1) {
                    // API key invalid, try next one
                    console.log('API key invalid, switching to next API...');
                    this.switchAPI();
                    return this.fetchGames(page, { ...options, retryCount: retryCount + 1 });
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('API Response data:', data);
            console.log('Number of games received:', data.results?.length || 0);
            console.log('Total games available:', data.count || 0);
            
            if (!data.results || !data.results.length) {
                console.log('No games found in API response');
                throw new Error('No games found');
            }
            
            // Log first few games for debugging
            console.log('First 5 games:', data.results.slice(0, 5).map(g => ({ 
                name: g.name, 
                rating: g.rating,
                released: g.released,
                genres: g.genres?.map(gn => gn.name) || [] 
            })));
            
            // Log genre distribution
            const genreCount = {};
            data.results.forEach(game => {
                game.genres?.forEach(genre => {
                    genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
                });
            });
            console.log('Genre distribution:', genreCount);
            
            return {
                success: true,
                data: data,
                apiUsed: this.API_KEYS[this.currentAPIIndex].name
            };
            
        } catch (err) {
            console.error('RAWG API Error:', err);
            console.error('Error details:', {
                message: err.message,
                stack: err.stack,
                url: url,
                currentAPI: this.API_KEYS[this.currentAPIIndex].name,
                retryCount: retryCount
            });
            
            // If we haven't tried all APIs yet, switch and retry
            if (retryCount < this.API_KEYS.length - 1) {
                console.log('Retrying with next API...');
                this.switchAPI();
                return this.fetchGames(page, { ...options, retryCount: retryCount + 1 });
            }
            
            return {
                success: false,
                error: err.message,
                allAPIsFailed: true
            };
        }
    }
    
    // Initialize status display (hidden by default)
    initStatusDisplay() {
        if (typeof document !== 'undefined') {
            const statusDiv = document.createElement('div');
            statusDiv.id = 'rawg-api-status';
            statusDiv.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 1000;
                font-family: Arial, sans-serif;
                direction: ltr;
                display: none; /* Hidden by default */
            `;
            document.body.appendChild(statusDiv);
            this.updateStatusDisplay();
        }
    }
    
    // Update status display
    updateStatusDisplay() {
        if (typeof document !== 'undefined') {
            const statusDiv = document.getElementById('rawg-api-status');
            if (statusDiv) {
                const totalRequests = this.API_KEYS.reduce((sum, api) => sum + api.requests, 0);
                const currentAPI = this.API_KEYS[this.currentAPIIndex];
                
                statusDiv.innerHTML = `
                    <div>🔑 API: ${currentAPI.name}</div>
                    <div>📊 Requests: ${totalRequests}</div>
                    <div>🔄 Auto-switch: ON</div>
                `;
            }
        }
    }
    
    // Get API statistics
    getStats() {
        return {
            totalRequests: this.API_KEYS.reduce((sum, api) => sum + api.requests, 0),
            currentAPI: this.API_KEYS[this.currentAPIIndex].name,
            apis: this.API_KEYS.map(api => ({
                name: api.name,
                requests: api.requests,
                lastUsed: api.lastUsed,
                active: api.active
            }))
        };
    }
    
    // Reset API usage (for testing)
    resetUsage() {
        this.API_KEYS.forEach(api => {
            api.requests = 0;
            api.lastUsed = null;
        });
        this.saveAPIUsage();
        this.updateStatusDisplay();
        console.log('API usage reset');
    }
}

// Initialize and export
const RAWGAPI = new RAWGAPIManager();

// Export for global use
if (typeof window !== 'undefined') {
    window.RAWGAPI = RAWGAPI;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RAWGAPI;
}
