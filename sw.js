const CACHE_NAME = 'rincon-gaitero-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Dejar pasar directo a la red los audios, videos y peticiones por rangos (Range)
  if (
    event.request.headers.get('range') ||
    url.pathname.includes('/canciones/') ||
    url.pathname.includes('/episodios/') ||
    url.pathname.includes('/gifs/') ||
    url.pathname.includes('/audio/') ||
    url.pathname.match(/\.(mp3|ogg|wav|m4a|mp4|webm)$/i)
  ) {
    return;
  }

  // Para el resto de la web (HTML, CSS, JS, JSON, Logos): red primero y respaldo en caché
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (event.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
