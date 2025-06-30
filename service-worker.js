self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('impulseart-orders-v1').then(cache =>
      cache.addAll(['/', '/index.html', '/styles/style.css', '/scripts/main.js'])
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});