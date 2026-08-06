var CACHE_NAME = 'caisse-app-v9';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/logo-bpmg.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){ return key !== CACHE_NAME; })
            .map(function(key){ return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

/* Réseau d'abord pour l'app (HTML/CSS/JS) afin que les mises à jour soient
   toujours visibles ; secours sur le cache hors-ligne uniquement si le
   réseau échoue. Les icônes (statiques) restent cache-first. */
self.addEventListener('fetch', function(event){
  if (event.request.method !== 'GET') return;
  var isIcon = event.request.url.indexOf('/icons/') !== -1;

  if (isIcon) {
    event.respondWith(
      caches.match(event.request).then(function(cached){
        return cached || fetch(event.request);
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).then(function(response){
      if (response.ok && response.type === 'basic'){
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, clone); });
      }
      return response;
    }).catch(function(){
      return caches.match(event.request).then(function(cached){
        if (cached) return cached;
        if (event.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
