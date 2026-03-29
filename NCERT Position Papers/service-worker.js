// Service Worker for NCERT Position Papers Archive
// Enables full offline functionality after first load

const CACHE_NAME = 'ncert-archive-v1';

// Files to cache for offline use
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './author.jpg'
];

// Install event – cache all files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Take over immediately
  self.skipWaiting();
});

// Activate event – clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Take control of all pages
  self.clients.claim();
});

// Fetch event – serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }
      // Otherwise fetch from network and cache
      return fetch(event.request).then((networkResponse) => {
        // Only cache same-origin requests
        if (event.request.url.startsWith(self.location.origin)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // If offline and not cached, return the main app
        return caches.match('./index.html');
      });
    })
  );
});
