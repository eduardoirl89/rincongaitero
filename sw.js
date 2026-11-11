self.addEventListener('fetch', (event) => {
  // Service worker básico para permitir la instalación PWA
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});