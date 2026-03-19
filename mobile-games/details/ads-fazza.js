(function() {
    const config = {
        bannerKey: 'abae43c3093c7f7459553dac34caad9a',
        smartLink: 'https://charmingpoliteinjunction.com/tmpvskkqt?key=19485795effc8a68161e2f658c5a3f76'
    };

    // 1. إضافة التنسيق
    const style = document.createElement('style');
    style.innerHTML = `
        .fazza-ad-unit { 
            display: flex !important; justify-content: center !important; 
            align-items: center !important; margin: 25px auto !important; 
            min-height: 60px; width: 100%; clear: both;
        }
    `;
    document.head.appendChild(style);

    // 2. وظيفة إنشاء الإعلان (بالطريقة التي نجحت معك أول مرة)
    function createBanner() {
        const wrapper = document.createElement('div');
        wrapper.className = 'fazza-ad-unit';
        
        const scriptOptions = document.createElement('script');
        scriptOptions.type = 'text/javascript';
        scriptOptions.text = `atOptions = { 'key' : '${config.bannerKey}', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`;
        
        const scriptInvoke = document.createElement('script');
        scriptInvoke.type = 'text/javascript';
        scriptInvoke.src = `https://charmingpoliteinjunction.com/${config.bannerKey}/invoke.js`;
        
        wrapper.appendChild(scriptOptions);
        wrapper.appendChild(scriptInvoke);
        return wrapper;
    }

    // 3. حقن الإعلانات مع التأكد من وجود العناصر
    function autoInjectAds() {
        // أ. الإعلان العلوي
        const main = document.querySelector('main') || document.body;
        if (main) {
            main.prepend(createBanner());
        }

        // ب. الإعلان الأوسط (لو وجد حاوية محتوى)
        const container = document.querySelector('.container, .game-detail-content, .games-grid');
        if (container && container.children.length > 2) {
            const midIndex = Math.floor(container.children.length / 2);
            container.insertBefore(createBanner(), container.children[midIndex]);
        }

        // ج. الإعلان السفلي (الحل النهائي)
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

    // تنفيذ الحقن فوراً إذا كانت الصفحة جاهزة، أو الانتظار
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInjectAds);
    } else {
        autoInjectAds();
    }
})();