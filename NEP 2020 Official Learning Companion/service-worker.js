// ============================================================
// NEP 2020 Official Learning Companion – Service Worker
// Author: Dr. Mateen Yousuf, Teacher – SED J&K
// Version: 1.0.0
// ============================================================

const CACHE_NAME = 'nep2020-companion-v1';

// Core files to cache on install
const CORE_ASSETS = [
  './index.html',
  './manifest.json',
  './service-worker.js',
  './conceptual-background.html',
  './user-manual.html'
];

// ============================================================
// INSTALL: Pre-cache core assets
// ============================================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_ASSETS).catch(err => {
        // Some files may not exist yet; cache what we can
        console.warn('[SW] Some assets could not be cached:', err);
      });
    }).then(() => {
      // Force this SW to become active immediately
      return self.skipWaiting();
    })
  );
});

// ============================================================
// ACTIVATE: Clean up old caches
// ============================================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => {
      // Take control of all open pages immediately
      return self.clients.claim();
    })
  );
});

// ============================================================
// FETCH: Cache-first strategy for all requests
// Falls back to network, then serves offline page if both fail
// ============================================================
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (e.g. Google Fonts if ever used)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Serve from cache; also update cache in background
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {});
        return cachedResponse;
      }

      // Not in cache — try network
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        // Cache the new response
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      }).catch(() => {
        // Both cache and network failed — return offline fallback
        return caches.match('./index.html');
      });
    })
  );
});

// ============================================================
// MESSAGE: Force update when user requests it
// ============================================================
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
