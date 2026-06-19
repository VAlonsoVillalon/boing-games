const CACHE = 'boing-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/soundUtils.js',
  '/js/progress.js',
  '/js/main.js',
  '/js/games/memory.js',
  '/js/games/colors.js',
  '/js/games/puzzle.js',
  '/js/games/lines.js',
  '/js/games/sounds.js',
  '/js/games/numbers.js',
  '/js/games/simon.js',
  '/js/games/formas.js',
  '/js/games/letras.js',
  '/icon.svg',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
