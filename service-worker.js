const CACHE_NAME = 'safejob-v2-white';
const FILES = ['./','./index.html','./style.css','./app.js','./manifest.json'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(FILES)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if(k !== CACHE_NAME) return caches.delete(k);
    }))).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      return caches.open(CACHE_NAME).then(c => { c.put(e.request, res.clone()); return res; });
    }).catch(()=> caches.match(e.request))
  );
});
