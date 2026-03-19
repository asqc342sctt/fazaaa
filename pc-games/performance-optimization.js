// تحسينات الأداء الإضافية لألعاب الكمبيوتر

// تحسين التصفية باستخدام debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// تحسين تحميل الصور
function optimizeImages() {
    const images = document.querySelectorAll('.game-card img');
    images.forEach(img => {
        // إضافة خصائص تحميل محسنة
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
            img.setAttribute('decoding', 'async');
        }
        
        // تحسين التصيير
        img.style.imageRendering = 'crisp-edges';
        img.style.transform = 'translateZ(0)';
    });
}

// تحسين التصفية
function optimizeFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const debouncedFilter = debounce(() => {
        // تطبيق التصفية مع تحسين الأداء
        requestAnimationFrame(() => {
            // كود التصفية هنا
        });
    }, 100);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', debouncedFilter);
    });
}

// تحسين التمرير
function optimizeScrolling() {
    let ticking = false;
    
    function updateScroll() {
        // تحديث التمرير مع تحسين الأداء
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// تحسين الذاكرة
function optimizeMemory() {
    // تنظيف الذاكرة بشكل دوري
    setInterval(() => {
        if (window.gc) {
            window.gc();
        }
    }, 30000); // كل 30 ثانية
}

// تحسين التخطيط
function optimizeLayout() {
    // استخدام CSS containment
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.style.contain = 'layout style paint';
        card.style.willChange = 'auto';
    });
}

// تهيئة التحسينات
document.addEventListener('DOMContentLoaded', function() {
    optimizeImages();
    optimizeFiltering();
    optimizeScrolling();
    optimizeMemory();
    optimizeLayout();
});

// تحسينات إضافية عند تحميل الصفحة
window.addEventListener('load', function() {
    // تحسين التصيير
    document.body.style.transform = 'translateZ(0)';
    
    // تحسين الذاكرة
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            optimizeMemory();
        });
    }
});
