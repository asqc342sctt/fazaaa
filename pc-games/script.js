// Function to add numbering to most downloaded games
function addGameNumbering() {
    const mostDownloadedSection = document.querySelector('.most-downloaded');
    if (!mostDownloadedSection) return;
    
    const gameCards = mostDownloadedSection.querySelectorAll('.game-card');
    
    gameCards.forEach((card, index) => {
        // Remove existing numbering if any
        const existingNumber = card.querySelector('.game-number');
        if (existingNumber) {
            existingNumber.remove();
        }
        
        // Create new numbering element
        const gameNumber = document.createElement('div');
        gameNumber.className = 'game-number';
        gameNumber.textContent = (index + 1).toString();
        
        // Style the numbering
        gameNumber.style.cssText = `
            position: absolute;
            top: 15px;
            right: -30px;
            width: 120px;
            height: 30px;
            background: linear-gradient(135deg, #ffd700, #ffb347);
            color: #1a1a1a;
            text-align: center;
            line-height: 30px;
            font-weight: 800;
            font-size: 1rem;
            transform: rotate(45deg);
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.2);
            z-index: 2;
            font-family: 'Cairo', sans-serif;
        `;
        
        // Add to card
        card.appendChild(gameNumber);
    });
}

// Game Filter Class
class GameFilter {
    constructor() {
        this.games = [];
        this.filters = {
            type: '',
            platform: '',
            genre: '',
            year: ''
        };
        this.init();
    }

    init() {
        this.loadGames();
        this.setupEventListeners();
        // Initialize view and counts on load
        this.applyFilters();
    }

    loadGames() {
        const gameCards = document.querySelectorAll('.game-card');
        
        gameCards.forEach((card, index) => {
            const gameData = {
                element: card,
                title: card.querySelector('.game-title')?.textContent || '',
                type: card.dataset.type || '',
                platform: card.dataset.platform || '',
                genre: card.dataset.genre || '',
                year: card.dataset.year || ''
            };
            
            this.games.push(gameData);
        });
    }

    setupEventListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            const category = button.dataset.category;
            const value = button.dataset.value;
            
            if (category && value) {
                button.addEventListener('click', () => {
                    this.toggleFilter(category, value, button);
                });
            }
        });

        // Clear filters button
        const clearButton = document.querySelector('.clear-filters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    toggleFilter(category, value, button) {
        // Special case: "all" clears the filter for the category
        if (value === 'all') {
            this.filters[category] = '';
            // Remove active state from other buttons in the same category
            const categoryButtons = document.querySelectorAll(`[data-category="${category}"]`);
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Keep the "all" button visually active
            button.classList.add('active');
        } else if (this.filters[category] === value) {
            // Remove filter
            this.filters[category] = '';
            button.classList.remove('active');
        } else {
            // Add filter
            this.filters[category] = value;
            
            // Remove active class from other buttons in same category
            const categoryButtons = document.querySelectorAll(`[data-category="${category}"]`);
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');
        }
        
        this.applyFilters();
    }

    clearFilters() {
        this.filters = {
            type: '',
            platform: '',
            genre: '',
            year: ''
        };
        
        // Remove active class from all filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        this.applyFilters();
    }

    applyFilters() {
        let visibleCount = 0;
        
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            this.games.forEach(game => {
                let shouldShow = true;
                
                // Check each filter
                Object.keys(this.filters).forEach(category => {
                    if (this.filters[category] && game[category] !== this.filters[category]) {
                        shouldShow = false;
                    }
                });
                
                if (shouldShow) {
                    game.element.style.display = 'block';
                    game.element.style.opacity = '1';
                    visibleCount++;
                } else {
                    game.element.style.display = 'none';
                    game.element.style.opacity = '0';
                }
            });
            
            // Update results count
            const resultsCount = document.getElementById('resultsCount');
            if (resultsCount) {
                resultsCount.textContent = String(visibleCount);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addGameNumbering();
    new GameFilter();

    // تحسين التنقل في البطاقات - البطاقة كاملة قابلة للنقر
    function enableCardNavigation() {
        const cards = document.querySelectorAll('.game-card');
        cards.forEach(card => {
            // جعل البطاقة قابلة للنقر
            card.style.cursor = 'pointer';
            
            // إضافة مستمع النقر للبطاقة
            card.addEventListener('click', function(e) {
                // البحث عن رابط التحميل في البطاقة
                const downloadLink = card.querySelector('.card-buttons a');
                if (downloadLink && downloadLink.href) {
                    // فتح صفحة اللعبة المنفصلة
                    window.location.href = downloadLink.href;
                }
            });
            
            // التأكد من أن الأزرار تعمل بشكل صحيح
            const buttons = card.querySelectorAll('.card-buttons a');
            buttons.forEach(button => {
                button.style.cursor = 'pointer';
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            });
        });
    }

    enableCardNavigation();

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    
    function setDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }

    function switchTheme() {
        const isDark = document.body.classList.contains('dark-mode');
        setDarkMode(!isDark);
    }

    // Event listener for the theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', switchTheme);
    }

    // Apply the theme on initial load
    (function() {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            setDarkMode(true);
        }
    })();

    // تحسين البطاقات بدون حذف الأزرار
    setTimeout(function() {
        const cards = document.querySelectorAll('.game-card');
        
        cards.forEach(card => {
            // إضافة تأثيرات hover محسنة
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.2s ease';
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
            });
            
            // إضافة خصائص تحميل للصور
            const img = card.querySelector('img');
            if (img && !img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
                img.setAttribute('decoding', 'async');
            }
        });
    }, 1000);
});

// Run when page is fully loaded (including images)
window.addEventListener('load', function() {
    addGameNumbering();
});

/* =====================================================
   FAZZA PLAY - MAIN JAVASCRIPT
   ===================================================== */

(function() {
    'use strict';

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '';
        }
        
        lastScroll = currentScroll;
    });

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.game-card, .feature-card, .web-game-card').forEach(el => {
        observer.observe(el);
    });

})();
