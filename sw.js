const CACHE_NAME = 'rincon-gaitero-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cacheo inteligente para los audios de la carpeta /episodios/
  if (url.pathname.includes('/episodios/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse; // Reproduce al instante desde el teléfono
        }

        // Si no está guardado, lo descarga de la red y guarda una copia
        const networkResponse = await fetch(event.request);
        // Solo guardamos en caché si es una descarga completa (status 200)
        if (networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      })
    );
    return;
  }

  // Para el resto de la web (HTML, CSS, JS, Logos)
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
