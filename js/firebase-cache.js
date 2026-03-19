// ═════════════════════════════════════════
// 🗄️ Firebase Cache System for RAWG API
// ═════════════════════════════════════════

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWPa41E98r0Fhacx57QlEJAgOLLRFmSK4",
  authDomain: "fazzaplay-14ddc.firebaseapp.com",
  projectId: "fazzaplay-14ddc",
  storageBucket: "fazzaplay-14ddc.firebasestorage.app",
  messagingSenderId: "288892358832",
  appId: "1:288892358832:web:5340d3aacc33411b166b75",
  measurementId: "G-JR3R5CW8CT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const CACHE_COLLECTION = 'games_cache';
const CACHE_STATS_COLLECTION = 'cache_stats';

// Cache Configuration
const CACHE_CONFIG = {
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  MAX_CACHE_SIZE: 1000, // Maximum cached games
  FALLBACK_CACHE_KEY: 'fazza_games_fallback',
  API_CALLS_PER_DAY: 20000,
  CURRENT_API_CALLS: 'fazza_api_calls_today'
};

// ═════════════════════════════════════════
// 📊 Cache Statistics Management
// ═════════════════════════════════════════

class CacheManager {
  constructor() {
    this.stats = {
      totalCached: 0,
      apiCallsToday: 0,
      cacheHits: 0,
      cacheMisses: 0,
      lastUpdated: null
    };
    this.init();
  }

  async init() {
    await this.loadStats();
    await this.checkDailyReset();
  }

  async loadStats() {
    try {
      const doc = await db.doc(CACHE_STATS_COLLECTION + '/daily').get();
      if (doc.exists) {
        this.stats = doc.data();
        console.log('📊 Cache stats loaded:', this.stats);
      }
    } catch (error) {
      console.warn('⚠️ Could not load cache stats:', error);
    }
  }

  async saveStats() {
    try {
      await db.doc(CACHE_STATS_COLLECTION + '/daily').set(this.stats);
      console.log('💾 Cache stats saved');
    } catch (error) {
      console.warn('⚠️ Could not save cache stats:', error);
    }
  }

  async checkDailyReset() {
    const today = new Date().toDateString();
    const lastUpdate = this.stats.lastUpdated ? new Date(this.stats.lastUpdated).toDateString() : null;
    
    if (lastUpdate !== today) {
      console.log('🔄 Daily reset - API calls counter reset');
      this.stats.apiCallsToday = 0;
      this.stats.lastUpdated = new Date().toISOString();
      await this.saveStats();
    }
  }

  canMakeAPICall() {
    return this.stats.apiCallsToday < CACHE_CONFIG.API_CALLS_PER_DAY;
  }

  async incrementAPICalls() {
    this.stats.apiCallsToday++;
    await this.saveStats();
    console.log(`📈 API calls today: ${this.stats.apiCallsToday}/${CACHE_CONFIG.API_CALLS_PER_DAY}`);
  }

  async incrementCacheHit() {
    this.stats.cacheHits++;
    await this.saveStats();
  }

  async incrementCacheMiss() {
    this.stats.cacheMisses++;
    await this.saveStats();
  }
}

// ═════════════════════════════════════════
// 🎮 Games Cache System
// ═════════════════════════════════════════

class GamesCache {
  constructor(cacheManager) {
    this.cacheManager = cacheManager;
    this.localCache = new Map();
    this.init();
  }

  async init() {
    // Load from localStorage first for instant access
    this.loadFromLocalStorage();
    // Then sync with Firebase
    await this.syncWithFirebase();
  }

  loadFromLocalStorage() {
    try {
      const cached = localStorage.getItem(CACHE_CONFIG.FALLBACK_CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        this.localCache = new Map(data.games || []);
        console.log(`📱 Loaded ${this.localCache.size} games from localStorage`);
      }
    } catch (error) {
      console.warn('⚠️ Could not load from localStorage:', error);
    }
  }

  async syncWithFirebase() {
    try {
      const snapshot = await db.collection(CACHE_COLLECTION).limit(CACHE_CONFIG.MAX_CACHE_SIZE).get();
      let games = new Map();
      
      snapshot.forEach(doc => {
        const game = doc.data();
        if (this.isValidCache(game)) {
          games.set(game.cacheKey, game);
        }
      });
      
      this.localCache = games;
      this.saveToLocalStorage();
      console.log(`🔥 Synced ${games.size} games from Firebase`);
    } catch (error) {
      console.warn('⚠️ Could not sync with Firebase:', error);
    }
  }

  isValidCache(game) {
    if (!game || !game.timestamp) return false;
    const age = Date.now() - new Date(game.timestamp).getTime();
    return age < CACHE_CONFIG.CACHE_DURATION;
  }

  generateCacheKey(url) {
    return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  }

  async get(url) {
    const cacheKey = this.generateCacheKey(url);
    
    // Check local cache first
    if (this.localCache.has(cacheKey)) {
      const cached = this.localCache.get(cacheKey);
      if (this.isValidCache(cached)) {
        console.log('✅ Cache hit for:', url);
        await this.cacheManager.incrementCacheHit();
        return cached.data;
      } else {
        // Remove expired cache
        this.localCache.delete(cacheKey);
      }
    }
    
    console.log('❌ Cache miss for:', url);
    await this.cacheManager.incrementCacheMiss();
    return null;
  }

  async set(url, data) {
    const cacheKey = this.generateCacheKey(url);
    const cacheEntry = {
      cacheKey,
      data,
      timestamp: new Date().toISOString(),
      url
    };
    
    // Save to local cache
    this.localCache.set(cacheKey, cacheEntry);
    
    // Save to localStorage
    this.saveToLocalStorage();
    
    // Save to Firebase (async, don't wait)
    this.saveToFirebase(cacheKey, cacheEntry);
    
    console.log('💾 Cached data for:', url);
  }

  saveToLocalStorage() {
    try {
      const games = Array.from(this.localCache.entries());
      localStorage.setItem(CACHE_CONFIG.FALLBACK_CACHE_KEY, JSON.stringify({ games }));
    } catch (error) {
      console.warn('⚠️ Could not save to localStorage:', error);
    }
  }

  async saveToFirebase(cacheKey, cacheEntry) {
    try {
      await db.collection(CACHE_COLLECTION).doc(cacheKey).set(cacheEntry);
    } catch (error) {
      console.warn('⚠️ Could not save to Firebase:', error);
    }
  }

  async clear() {
    this.localCache.clear();
    localStorage.removeItem(CACHE_CONFIG.FALLBACK_CACHE_KEY);
    
    try {
      const snapshot = await db.collection(CACHE_COLLECTION).get();
      const batch = db.batch();
      snapshot.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      console.log('🗑️ Cache cleared successfully');
    } catch (error) {
      console.warn('⚠️ Could not clear Firebase cache:', error);
    }
  }

  getStats() {
    return {
      totalCached: this.localCache.size,
      apiCallsToday: this.cacheManager.stats.apiCallsToday,
      maxApiCalls: CACHE_CONFIG.API_CALLS_PER_DAY,
      cacheHits: this.cacheManager.stats.cacheHits,
      cacheMisses: this.cacheManager.stats.cacheMisses,
      hitRate: this.cacheManager.stats.cacheHits / (this.cacheManager.stats.cacheHits + this.cacheManager.stats.cacheMisses) * 100 || 0
    };
  }
}

// ═════════════════════════════════════════
// 🌐 Smart API Wrapper
// ═════════════════════════════════════════

class SmartAPI {
  constructor() {
    this.cacheManager = new CacheManager();
    this.gamesCache = new GamesCache(this.cacheManager);
    this.rawgKey = '63782c9e9d6946a097bf5d4cfcb16aa4';
  }

  async fetch(url, options = {}) {
    // Check cache first
    const cached = await this.gamesCache.get(url);
    if (cached) {
      return cached;
    }

    // Check if we can make API calls
    if (!this.cacheManager.canMakeAPICall()) {
      console.warn('⚠️ API limit reached, using fallback data');
      return this.getFallbackData();
    }

    // Make API call
    try {
      console.log('🌐 Making API call to:', url);
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the result
      await this.gamesCache.set(url, data);
      await this.cacheManager.incrementAPICalls();
      
      return data;
    } catch (error) {
      console.warn('⚠️ API call failed:', error);
      return this.getFallbackData();
    }
  }

  getFallbackData() {
    // Return cached fallback games from index.html
    return {
      results: FALLBACK_GAMES.slice(0, 20),
      count: FALLBACK_GAMES.length,
      next: null,
      previous: null
    };
  }

  async getStats() {
    return this.gamesCache.getStats();
  }

  async clearCache() {
    await this.gamesCache.clear();
  }
}

// ═════════════════════════════════════════
// 🚀 Global Instance
// ═════════════════════════════════════════

window.FazzaAPI = new SmartAPI();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SmartAPI, CacheManager, GamesCache };
}
