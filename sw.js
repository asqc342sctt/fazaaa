// 🚀 Service Worker مبسط - Fazza Play

const CACHE_NAME = 'fazza-play-v1.3';
const urlsToCache = [
    '/',
    '/index.html',
    '/offline.html',
    '/css/style.css',
    '/css/dark-mode.css',
    '/css/arabic-fonts.css',
    '/js/script.js',
    '/js/theme.js',
    '/js/ads.js',
    '/images/logo.svg'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then(function(response) {
                        // تخزين الاستجابة في التخزين المؤقت
                        if (response && response.status === 200 && response.type === 'basic') {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                });
                        }

                        // If the response is HTML, inject the ads script before </body>
                        try {
                            const contentType = response.headers.get('content-type') || '';
                            if (contentType.includes('text/html')) {
                                return response.text().then(function(bodyText) {
                                    // If the page already includes the script, return original
                                    if (bodyText.includes('ads-fazza.js')) {
                                        return new Response(bodyText, {
                                            status: response.status,
                                            statusText: response.statusText,
                                            headers: response.headers
                                        });
                                    }

                                    const injection = '<script src="ads-fazza.js"></script>'; 
                                    const modified = bodyText.replace(/<\/body>/i, injection + '</body>');

                                    // Preserve original headers
                                    const newHeaders = new Headers(response.headers);
                                    // Ensure correct content-length is not causing issues
                                    newHeaders.set('content-length', String(new Blob([modified]).size));

                                    return new Response(modified, {
                                        status: response.status,
                                        statusText: response.statusText,
                                        headers: newHeaders
                                    });
                                });
                            }
                        } catch (e) {
                            // If anything goes wrong, fall back to original response
                            return response;
                        }

                        return response;
                    })
                    .catch(function() {
                        // إذا فشل الاتصال، إرجاع صفحة offline
                        if (event.request.destination === 'document') {
                            return caches.match('/offline.html');
                        }

                        // للصور والملفات الأخرى، إرجاع رسالة offline بسيطة
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain',
                            })
                        });
                    });
            })
    );
});
