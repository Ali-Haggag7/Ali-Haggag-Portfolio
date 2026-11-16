const CACHE_NAME = 'portfolio-dynamic-v3';
const OFFLINE_URL = '/~offline';
const MAX_DYNAMIC_ENTRIES = 60;

const PRECACHE_ASSETS = [
    '/',
    OFFLINE_URL,
    '/icon-192x192.png',
    '/icon-512x512.png'
];

async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
        const excess = keys.length - maxItems;
        for (let i = 0; i < excess; i++) {
            await cache.delete(keys[i]);
        }
    }
}

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

    const url = new URL(event.request.url);
    if (!url.protocol.startsWith('http')) return;

    // Never intercept cross-origin requests or API routes
    if (url.origin !== self.location.origin) return;
    if (url.pathname.startsWith('/api/')) return;

    // Cache-First for immutable Next.js hashed build chunks
    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(
            (async () => {
                const cache = await caches.open(CACHE_NAME);
                const cached = await cache.match(event.request);
                if (cached) return cached;

                const response = await fetch(event.request);
                if (response && response.ok) {
                    cache.put(event.request, response.clone());
                    trimCache(CACHE_NAME, MAX_DYNAMIC_ENTRIES);
                }
                return response;
            })()
        );
        return;
    }

    // Network-First with bounded cache fallback for pages & public assets
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            try {
                const networkResponse = await fetch(event.request);

                if (networkResponse && networkResponse.ok) {
                    cache.put(event.request, networkResponse.clone());
                    trimCache(CACHE_NAME, MAX_DYNAMIC_ENTRIES);
                }

                return networkResponse;
            } catch {
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
