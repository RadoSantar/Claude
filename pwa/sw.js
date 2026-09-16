const CACHE_NAME = "nuzlocke-tracker-v1.9.49";
/* Sprites bewusst in einem EIGENEN, versionsunabhängigen Cache statt im CACHE_NAME-Cache: der
   Sprite-Cache wird bei einem App-Update NICHT mitgelöscht (anders als der Rest), da sich Sprite-
   Dateien unter denselben Pfaden praktisch nie ändern. Ohne diese Trennung würde jedes einzelne
   Versions-Update alle 2027 bereits heruntergeladenen Sprites verwerfen und beim nächsten Öffnen
   erneut anfordern - offline (oder bei schlechter Verbindung) direkt nach einem Update wären dann
   Sprites nicht verfügbar, obwohl sie vorher schon einmal geladen wurden. Nur erhöhen, falls sich die
   Ordnerstruktur unter sprites/ grundlegend ändert (siehe tools/extract-sprites.js).
*/
const SPRITE_CACHE = "nuzlocke-sprites-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== SPRITE_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const targetCache = event.request.url.includes("/sprites/") ? SPRITE_CACHE : CACHE_NAME;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(targetCache).then(cache => cache.put(event.request, copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
