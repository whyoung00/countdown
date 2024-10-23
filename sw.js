// Version the cache to manage updates more efficiently
const CACHE_NAME = 'edc-orlando-countdown-v2'; // Updated version from 'v1' to 'v2'
const urlsToCache = [
  '/',
  '/index.html',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-72x72.png',   // New icon added to cache
  '/icon-96x96.png',   // New icon added to cache
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js'
];

// Install event: Cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Ensure new service worker takes over immediately
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Claim any clients immediately
  );
});

// Fetch event: Serve cached content, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
