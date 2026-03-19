(function() {
    const config = {
        // إعلان الكمبيوتر والتابلت (كبير 728x90)
        desktop: {
            key: '86ad0b65f83e5a69757d4cbd05006855',
            url: 'https://exceedbronzetooth.com',
            width: 728,
            height: 90
        },
        // إعلان الموبايل (صغير 320x50)
        mobile: {
            key: 'abae43c3093c7f7459553dac34caad9a',
            url: 'https://charmingpoliteinjunction.com',
            width: 320,
            height: 50
        },
        smartLink: 'https://charmingpoliteinjunction.com/tmpvskkqt?key=19485795effc8a68161e2f658c5a3f76'
    };

    // التحقق من نوع الجهاز
    function isMobile() {
        return window.innerWidth < 768;
    }

    // 1. إضافة التنسيق
    const style = document.createElement('style');
    style.innerHTML = `
        .fazza-ad-unit { 
            display: flex !important; justify-content: center !important; 
            align-items: center !important; margin: 25px auto !important; 
            min-height: 90px; width: 100%; clear: both;
        }
        .fazza-ad-unit.mobile { min-height: 50px; }
        @media (max-width: 767px) {
            .fazza-ad-unit:not(.mobile) { display: none !important; }
        }
        @media (min-width: 768px) {
            .fazza-ad-unit.mobile { display: none !important; }
        }
    `;
    document.head.appendChild(style);

    // 2. وظيفة إنشاء الإعلان حسب الجهاز
    function createBanner() {
        const mobile = isMobile();
        const adConfig = mobile ? config.mobile : config.desktop;
        
        const wrapper = document.createElement('div');
        wrapper.className = mobile ? 'fazza-ad-unit mobile' : 'fazza-ad-unit';
        
        const scriptOptions = document.createElement('script');
        scriptOptions.type = 'text/javascript';
        scriptOptions.text = `atOptions = { 'key' : '${adConfig.key}', 'format' : 'iframe', 'height' : ${adConfig.height}, 'width' : ${adConfig.width}, 'params' : {} };`;
        
        const scriptInvoke = document.createElement('script');
        scriptInvoke.type = 'text/javascript';
        scriptInvoke.src = `${adConfig.url}/${adConfig.key}/invoke.js`;
        
        wrapper.appendChild(scriptOptions);
        wrapper.appendChild(scriptInvoke);
        return wrapper;
    }

    // 3. حقن الإعلانات مع التأكد من وجود العناصر
    function autoInjectAds() {
        // أ. الإعلان العلوي (تحت الهيدر)
        const header = document.querySelector('header');
        if (header) {
            header.after(createBanner());
        }

        // ب. الإعلان الأوسط (في منتصف المحتوى الرئيسي)
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.after(createBanner());
        } else {
            const container = document.querySelector('.container, .game-detail-content, .games-grid');
            if (container && container.children.length > 1) {
                const midIndex = Math.floor(container.children.length / 2);
                container.insertBefore(createBanner(), container.children[midIndex]);
            }
        }

        // ج. الإعلان السفلي (قبل الفوتر)
        const footer = document.querySelector('footer');
        if (footer) {
            footer.before(createBanner());
        } else {
            document.body.appendChild(createBanner());
        }
    }

    // 4. الـ Smartlink
    document.addEventListener('click', function() {
        if (!window.smartLinkActivated) {
            window.open(config.smartLink, '_blank');
            window.smartLinkActivated = true;
        }
    });
    
    // 5. إعادة تحميل الإعلانات عند تغيير حجم الشاشة
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            document.querySelectorAll('.fazza-ad-unit').forEach(el => el.remove());
            autoInjectAds();
        }, 250);
    });

    // تنفيذ الحقن فوراً إذا كانت الصفحة جاهزة، أو الانتظار
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInjectAds);
    } else {
        autoInjectAds();
    }
})();