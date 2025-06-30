self.addEventListener('install', e => {
  e.waitUntil(caches.open('pwa').then(cache => cache.addAll(['/', '/manifest.json'])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
