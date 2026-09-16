const CACHE_NAME = "safejob-nw-v2-protected-2026";
const urlsToCache = ["/safejob-nw/", "/safejob-nw/index.html", "/safejob-nw/style.css", "/safejob-nw/app.js", "/safejob-nw/manifest.json"];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); }))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));
});
