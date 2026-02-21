const CACHE_NAME = 'portfolio-dynamic-v2';
const OFFLINE_URL = '/~offline';

const PRECACHE_ASSETS = [
    '/',
    OFFLINE_URL,
    '/icon-192x192.png',
    '/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            try {
                const networkResponse = await fetch(event.request);

                if (networkResponse && networkResponse.ok) {
                    cache.put(event.request, networkResponse.clone());
                }

                return networkResponse;
            } catch (error) {
                const cachedResponse = await cache.match(event.request);
                if (cachedResponse) {
                    return cachedResponse;
                }

                if (event.request.mode === 'navigate') {
                    return cache.match(OFFLINE_URL);
                }

                return new Response('', { status: 408, headers: { 'Content-Type': 'text/plain' } });
            }
        })()
    );
});