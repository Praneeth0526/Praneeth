const CACHE_NAME = 'athos-dark-portfolio-v1.2';
const urlsToCache = [
  '/',
  '/static/css/custom-styles.css',
  '/static/js/custom-navigation.js',
  '/static/css/style.css',
  '/static/css/bootstrap.css',
  '/static/css/animate.css',
  '/static/js/main.js',
  '/static/js/jquery.min.js',
  'https://unpkg.com/htmx.org@1.9.10',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip HTMX requests for dynamic content
  if (event.request.url.includes('/sections/') || 
      event.request.url.includes('/load-more/') ||
      event.request.url.includes('/contact/submit/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
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
  );
});
