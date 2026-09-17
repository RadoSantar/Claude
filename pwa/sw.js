/* Dieser Wert wird von tools/build-netlify-zip.js bei JEDEM Build automatisch auf die aktuelle
   APP_VERSION aus nuzlocke-v2-editionen.html überschrieben (siehe Kommentar dort) - der hier im
   Repo committete Wert ist nur der Stand des letzten Builds, keine separate Quelle der Wahrheit.
   Grund für die Automatisierung: CACHE_NAME blieb zwischen v1.9.49 und v1.9.65 unverändert, obwohl
   in dieser Zeit u. a. Standort-Suche, Regions-Karte, Zurückstellen-Mechanik für Bosse, Cloud-Sync-
   Umbenennung+QR-Code+PIN und die Urzeithöhle-Ergänzung dazukamen - die "fetch"-Strategie unten ist
   cache-first ohne Netzwerk-Fallback-Vorrang, d.h. ohne Cache-Namensänderung installiert der Browser
   zwar ein neues sw.js (Byte-Diff), aber die bereits gecachte index.html unter dem UNVERÄNDERTEN
   CACHE_NAME wird nie ersetzt (der activate-Handler löscht nur ANDERE Cache-Namen) - installierte
   PWA-Nutzer sahen dadurch über 15 Versionen lang denselben veralteten Stand, bis ein Nutzer meldete,
   dass ein frisch ergänzter Standort auf der Kartengrafik fehlte, obwohl der Code ihn längst enthielt. */
const CACHE_NAME = "nuzlocke-tracker-v1.9.65";
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
