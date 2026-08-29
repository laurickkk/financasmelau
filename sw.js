// Service worker simples: guarda o app em cache para abrir offline.
const CACHE = "financas-v1";
const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // As bibliotecas (React, Babel) vêm da rede; o resto tenta o cache primeiro.
  if (e.request.url.includes("unpkg.com")) return;
  e.respondWith(
    caches.match(e.request).then((resp) => resp || fetch(e.request))
  );
});
