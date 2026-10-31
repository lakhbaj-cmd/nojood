// Mizan service worker: makes the app open fast and work offline.
// When you change any file, raise the version number so phones get the update.
const VERSION = "nojood-v12";
const FILES = [
  "./", "index.html", "start.html", "portal.html", "dietitian.html",
  "style.css", "i18n.js", "recipes.js", "grocery.js", "db.js", "demo-db.js", "app.js", "manifest.webmanifest", "manifest-dietitian.webmanifest",
  "icon-192.png", "icon-512.png", "icon-180.png", "logo-mark.svg", "pro-icon-192.png", "pro-icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first (so updates show right away), fall back to the saved copy when offline
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("portal.html")))
  );
});
