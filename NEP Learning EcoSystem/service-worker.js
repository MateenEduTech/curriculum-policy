// ─────────────────────────────────────────────────────────────
//  NEP Learning Ecosystem – Service Worker
//  Author: Mateen Yousuf, School Education Dept., J&K
//  Aligned: NEP 2020 | NCF 2023 | PARAKH
//  Strategy: Cache-First (full offline support)
// ─────────────────────────────────────────────────────────────

const CACHE_NAME = 'nep-learning-v1';
const CACHE_VERSION = '1.0.0';

// All files to cache on install (app shell)
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json'
];

// ── INSTALL: cache all app shell files ────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing NEP Learning Ecosystem v' + CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] All assets cached successfully');
        // Force activate immediately without waiting
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Cache failed:', err);
      })
  );
});

// ── ACTIVATE: clean up old caches ─────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating new service worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Now controlling all clients');
      return self.clients.claim();
    })
  );
});

// ── FETCH: Cache-First strategy ───────────────────────────────
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache (works fully offline)
          console.log('[SW] Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Not in cache — try network, then cache the result
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
              return networkResponse;
            }

            // Cache new successful responses
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });

            return networkResponse;
          })
          .catch(() => {
            // Offline fallback: return index.html for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            // For other requests, return a simple offline response
            return new Response(
              JSON.stringify({ error: 'Offline', message: 'Content not available offline' }),
              { headers: { 'Content-Type': 'application/json' }, status: 503 }
            );
          });
      })
  );
});

// ── MESSAGE: handle skip-waiting requests ─────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION, cacheName: CACHE_NAME });
  }
});

// ── BACKGROUND SYNC (future): queue quiz results offline ──────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-quiz-results') {
    console.log('[SW] Background sync: quiz results');
    // Future: sync locally stored quiz results to a server
  }
});
