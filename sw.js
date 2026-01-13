// Service Worker for Diet Tracker PWA

const CACHE_NAME = 'diet-tracker-v1';
const urlsToCache = [
    './',
    './index.html',
    './app.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache opened');
                return cache.addAll(urlsToCache.map(url => {
                    return new Request(url, { cache: 'reload' });
                })).catch((err) => {
                    console.error('Failed to cache:', err);
                });
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(() => {
                // Return a custom offline page or response
                return new Response('Offline - Please check your connection', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            })
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // If a window is already open, focus it
                for (let client of clientList) {
                    if ('focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise, open a new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

// Background sync for future functionality
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-meals') {
        event.waitUntil(syncMeals());
    }
});

async function syncMeals() {
    // Placeholder for future sync functionality
    console.log('Syncing meals...');
}
